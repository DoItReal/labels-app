import { Label } from '../../labels';
import * as PDFLib from 'pdf-lib';
import { useContext, useEffect, useRef, useState } from 'react';
import { IaddedLabel, IcontentProps } from '../Content';
import { enableStatesContext } from '../../App';
import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react';
import Draggable from 'react-draggable';
import { Box, Container, Grid, IconButton, Paper, Popover } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import LabelCanvas from '../../DesignEditor/LabelCanvas';
import { Design, isDesignArray } from '../../DesignEditor/Interfaces/CommonInterfaces';
import { getLocalDesigns } from '../../DesignEditor/DesignDB';
export default function RightSide({ addedLabels }: IcontentProps) {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    const PDFrow = useRef<JSX.Element | null>(null);

    const classes = useStyles();
    const id = enableStates.get('createPDF') ? 'PDFPopover' : undefined;

    if (!enableStates.get('createPDF')) return null;
    const handleClose = (event: React.MouseEvent | React.TouchEvent) => {
        event.stopPropagation();
        updateStates('createPDF', false);
    }
    const update = () => {
        updateStates('updatePDF', true);
    }
    if (enableStates.get('updatePDF')) {
        PDFrow.current = <CreatePDF labels={addedLabels} />;
        updateStates('updatePDF', false);
    }

    return (
        <Draggable handle='.handle' defaultPosition={{
            x: window.innerWidth/2, y: window.innerHeight/8
        }}>
            <Paper elevation={5}
                id={id}
                classes={{
                    root: classes.popoverRoot,
                }}   
                sx={{ minWidth: '30%', minHeight: '75%', maxWidth: '50%', translate: "-50%" }}
            >
                <Container disableGutters  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Box className='handle' sx={{backgroundColor:'primary.main', borderTopLeftRadius:'4px', borderTopRightRadius:'4px'} } >
                        <IconButton size="small" title="Refresh" onClick={update} sx={{
                            backgroundColor: 'info.main',
                            border: '1px solid black',
                            borderRadius: '4px',
                            padding: "2px",
                            margin: '2px',
                            "&:hover": {
                                backgroundColor: "info.main",
                                border: '1px solid white'
                            }
                        }} ><RefreshIcon />
                        </IconButton>
                        <IconButton size="small" title="Close" onClick={handleClose} onTouchEndCapture={handleClose} sx={{
                            float: 'right',
                            padding: '2px',
                            margin: '2px',
                            borderRadius: '4px',
                            border: '1px solid black',
                            backgroundColor: 'error.main',
                            "&:hover": {
                                backgroundColor: "error.main",
                                border: '1px solid white'
                            }
                        }} ><CloseIcon />
                        </IconButton>  
                    </Box>

                    <Box sx={{ display: 'contents' }} > 
                    {PDFrow.current}
                    </Box>
                </Container>
        </Paper>
        </Draggable>
    );
}
const useStyles = makeStyles((theme: Theme) => ({
    popoverRoot: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        position:'absolute'
    },
}));
const CreatePDF = ({ labels }: { labels: IaddedLabel[] }) => {
    const [pdf, setPdf] = useState('');
    const [design, setDesign] = useState<Design|null>(null);
   
    const [canvasArr, setCanvasArr] = useState < Array<React.JSX.Element> | Array<HTMLCanvasElement>| []>([]);
    const [ReactElementArr, setReactElementArr] = useState < Array<React.JSX.Element> | []>([]);
    const elementRefs = useRef<Array<React.RefObject<any>>>([]);
    const [dataURLs, setDataURLs] = useState<Array<string>>([]);
    // Update the elementRefs whenever ReactElementArr changes
    useEffect(() => {
        elementRefs.current = ReactElementArr.map(() => React.createRef());
    }, [ReactElementArr]);



    const MockDesign = async () => {
        const designs = await getLocalDesigns();
        if (!designs || !isDesignArray(designs)) return null;
        setDesign(designs[0]);
        
        }
    if (!design) {
        MockDesign();
        return null;
    }

    const generateArray = async () => {
        if (!ReactElementArr || (ReactElementArr.length > 0)) {
            generateDataUrl();
            return;
        }
        const arr: Array<React.JSX.Element> = [];
        
        for (const label of labels) {
            const width = PDFLib.PageSizes.A4[0];
            const height = PDFLib.PageSizes.A4[1];
            let signsInPage = 8;
            const canvasLabel = <LabelCanvas key={label._id} label={label} design={design} blocks={design.blocks} />;
           
                arr.push(canvasLabel);

        }
        
        if( arr ) setReactElementArr(arr);
    }
    const generateDataUrl = () => {
        if (dataURLs.length > 1) return;
        const arr = [];
        for (const label of labels) {
            const cnv = document.getElementById('canvas$' + label._id);
            if (cnv && cnv.getAttribute('data-url')) {
                arr.push(cnv.getAttribute('data-url'));
            }
        }
        if(arr.length > 1 && isStringArray(arr))
        setDataURLs(arr);
    }
    const isStringArray = (arr: any[] | null): arr is string[] => {
        if (!arr) return false;
        return arr.every(str => typeof str === 'string');
    }
    /* Old version
            let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
            sign.setContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus });
            sign.setId(label._id);
    
            if (label.count && label.count > 1) {
                for (let i = 1; i <= label.count; i++) {
                   canvasArr.push(sign.generate());
                }
               } else {
               canvasArr.push(sign.generate());
              }
        }
        */
    const isHTMLCanvasElement = (canvas: any | null): canvas is HTMLCanvasElement => {
        return canvas && canvas instanceof HTMLCanvasElement;
    }
    const isHTMLCanvasElementArray = (canvasArr: any[] | null): canvasArr is HTMLCanvasElement[] => {
        if (!canvasArr) return false;
        return canvasArr.every(canvas => isHTMLCanvasElement(canvas));
    }
    // Function to transform an array of ReactCanvas components to an array of DataURLs
    //React.JSX.Element is not HTMLCanvasElement
    //NOt working Work In Progess!!
    const transformToDataUrl = (reactElements: Array<React.JSX.Element> | Array<HTMLCanvasElement>): Array<string> | [] => {
       if(reactElements) console.log(reactElements);
        if (!reactElements) return [];
        const arr: Array<string> = [];
        for (const canvas of canvasArr) {
            if (canvas && canvas instanceof HTMLCanvasElement) {
                arr.push(canvas.toDataURL());
            }
        }
        return arr;
    }
    const generate = () => {
        if (pdf) return;
        if (!canvasArr) return;
        if (dataURLs.length < 1) return;

            PDF(design, dataURLs, setPdf);

    }
        generateArray();
    generate();  
  //  const cnv = document.getElementById('canvas$' + labels[0]._id);
   // if (cnv && cnv.getAttribute('data-url')) console.log(cnv.getAttribute('data-url'));
   // console.log(transformToDataUrl(ReactElementArr));
    return (
        <Grid container>
            <div style={{visibility:'hidden'} }>
            {ReactElementArr && !isHTMLCanvasElementArray(ReactElementArr) ? 
                    ReactElementArr.map(canvas =>
            canvas): null
                }
            </div>
            <iframe title='PDF Labels' src={pdf} style={{ width: '100%', height: '100%' }}></iframe>
            </Grid>
        );
    
}

// Function to transform an array of ReactCanvas components to an array of DataURLs

async function PDF(design:Design,labels: Array<string>, setPdf:(arg: string) => void) {

    //creates new PDF Document
    const doc = await PDFLib.PDFDocument.create();
    //adds page to just created PDF Document

    /*          Method doc.addPage(pageSize(w,h))
     * 1 - (w,h) < <number>, <number> >  ... doc.addPage(700,800);
     * 2 - (PageSizes.*) ... doc.addPage(PageSizes.A4);
     * 3
     * 
     */
    //  const page = doc.addPage(PDFLib.PageSizes.A4);
   // console.log(labels);
   // const labelsURLs = transformToDataUrl(labels);
    const chunks = [];
    for (let i = 0; i < labels.length; i += 8) {
        chunks.push(labels.slice(i, i + 8));
    }
    
    // Generate pages for each chunk of entries
    for (const chunk of chunks) {
        const page = doc.addPage(PDFLib.PageSizes.A4);

        const tmpWidth = page.getSize().width;
        const tmpHeight = page.getSize().height;
        const width = tmpWidth - 10;
        const height = tmpHeight - 10;
        let y = height - 5;
        let x = 0;

        // Print each label on the page
        for (const label of chunk) {
           // label.width = width / 2;
          //  label.height = height / 4;
            //  console.log(label);
          //  const cnv = document.getElementById('canvas$' + label._id);
        //    if (cnv && cnv.getAttribute('data-url')) console.log(cnv.getAttribute('data-url'));
            var jpgImage = await doc.embedPng(label);
          //  const jpgImage = await doc.embedJpg(label);
          
            //used for debugging
           // console.log(jpgImage);
            //draws just created JPEG image to the page
            page.drawImage(jpgImage, {
                x: x + 5,
                y: y - height/4,
                width: width/2-5,
                height: height/4 -10
            });
            if (x > 0) {
                x = 0;
                y -= (height-10) /4;
            } else x = x + width/2 + 5;
        }

    }


    //saving the PDF doc as dataUri
    try {
        const dataUri = await doc.saveAsBase64({ dataUri: true });
        setPdf(dataUri);
    } catch (e) {
        console.log(e);
        setPdf('');
    }
   /* 
// Save the PDF document to a file
const pdfBytes = await doc.save();

// Use the pdfBytes to save the PDF document or perform further operations
// Example: Save the PDF to a file
    var file = new Blob([pdfBytes], { type: 'application/pdf' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
    */
    }