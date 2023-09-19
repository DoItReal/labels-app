import { Label } from '../../labels';
import * as PDFLib from 'pdf-lib';
import { useContext, useRef, useState } from 'react';
import { IaddedLabel, IcontentProps } from '../Content';
import { enableStatesContext } from '../../App';
import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react';
import Draggable from 'react-draggable';
import { Box, Container, IconButton, Paper, Popover } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
export default function RightSide({ addedLabels }: IcontentProps) {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    const PDFrow = useRef<JSX.Element | null>(null);

    const classes = useStyles();
    const id = enableStates.get('createPDF') ? 'PDFPopover' : undefined;

    if (!enableStates.get('createPDF')) return null;
    const handleClose = (event: React.MouseEvent) => {
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
                        <IconButton size="small" title="Close" onClick={handleClose} sx={{
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
function CreatePDF({ labels }: { labels: IaddedLabel[] }) {
    const [pdf, setPdf] = useState('');
    const canvasArr: Array<HTMLCanvasElement> = [];
    for (const entry of labels) {
        // const labelsImg = [];
        const width = PDFLib.PageSizes.A4[0];
        const height = PDFLib.PageSizes.A4[1];
        let signsInPage = 8;

        let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(entry.allergens, { bg: decodeURI(entry.bg), en: entry.en, de: entry.de, rus: entry.rus });
        sign.setId(entry._id);

        if (entry.count && entry.count > 1) {
            for (let i = 1; i <= entry.count; i++) {
               canvasArr.push(sign.generate());
            }
           } else {
           canvasArr.push(sign.generate());
          }
    }

   PDF(canvasArr, setPdf);
    return (
            <iframe title='PDF Labels' src={pdf} style={{width:'100%', height:'100%'} }></iframe>
    );
}

async function PDF(signs: Array<HTMLCanvasElement>, setPdf:(arg: string) => void) {

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

    const chunks = [];
    for (let i = 0; i < signs.length; i += 8) {
        chunks.push(signs.slice(i, i + 8));
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

        // Print each entry on the page
        for (const sign of chunk) {
            var jpgImage = await doc.embedJpg(sign.toDataURL('image/jpeg'));

            //used for debugging

            //draws just created JPEG image to the page
            page.drawImage(jpgImage, {
                x: x + 10,
                y: y - sign.height,
                width: sign.width,
                height: sign.height
            });
            if (x > 0) {
                x = 0;
                y -= sign.height + 5;
            } else x = x + sign.width + 5;
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