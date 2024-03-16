import { useContext, useEffect, useRef, useState } from 'react';
import { enableStatesContext } from '../App';
import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react';
import Draggable from 'react-draggable';
import { Box, Container, IconButton, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import LabelCanvas from '../DesignEditor/LabelCanvas';
import { Design, isDesignArray } from '../DesignEditor/Interfaces/CommonInterfaces';
import { getLocalDesigns } from '../DesignEditor/DesignDB';
import { IloadedCatalog, isLoadedCatalog, } from '../Catalogs/Interfaces/CatalogDB';
import { getSelectedCatalog} from '../Catalogs/CatalogDB';
import { PDF } from './PDF';
const isStringArray = (arr: any[] | null): arr is string[] => {
    if (!arr) return false;
    return arr.every(str => typeof str === 'string');
}
const isHTMLCanvasElement = (canvas: any | null): canvas is HTMLCanvasElement => {
    return canvas && canvas instanceof HTMLCanvasElement;
}
const isHTMLCanvasElementArray = (canvasArr: any[] | null): canvasArr is HTMLCanvasElement[] => {
    if (!canvasArr) return false;
    return canvasArr.every(canvas => isHTMLCanvasElement(canvas));
}
export default function PdfViewer() {
    const [selectedCatalog, setSelectedCatalog] = useState<IloadedCatalog | {}>(getSelectedCatalog());
    const [enableStates, updateStates] = useContext(enableStatesContext);
    const PDFrow = useRef<JSX.Element | null>(null);
    const [ReactElementArr, setReactElementArr] = useState<Array<React.JSX.Element> | []>([]);
    const [dataURLs, setDataURLs] = useState<Array<string>>([]);
    const [design, setDesign] = useState<Design | null>(null);
    const classes = useStyles();
    const id = enableStates.get('createPDF') ? 'PDFPopover' : undefined;

    // If enableStates does not have createPDF key or the value is false return null 
    // no need to continue as the popover is not visible
    if (!enableStates.get('createPDF')) return null;
    // If selectedCatalog is empty or its type is not IloadedCatalog return null
    // no need to continue as there is no data to display
    if (!isLoadedCatalog(selectedCatalog) || selectedCatalog.labels.length === 0) {
        console.log('selectedCatalog catalog array is empty or its type is not IloadedCatalog' + selectedCatalog);
        console.log(selectedCatalog);
        return null;
    }
    
    const MockDesign = async () => {
        const designs = await getLocalDesigns();
        if (!designs || !isDesignArray(designs)) return null;
        setDesign(designs[0]);
        return (designs[0]);
    }
    // If design is not set, call MockDesign and set the design
    // TODO: get the design from designDB fetchLoadedDesign() 
    if (!design) MockDesign().then((design) => {
        if (design !== null)
            generateReactElementArray(design).then()
    });
    
    const handleClose = (event: React.MouseEvent | React.TouchEvent) => {
        event.stopPropagation();
        updateStates('createPDF', false);
    }
    const update = () => {
        updateStates('updatePDF', true);
    }
    if (enableStates.get('updatePDF') && dataURLs && dataURLs.length > 0) {
        PDFrow.current = <PDF imageURLs={dataURLs} />;
        //updateStates('updatePDF', false);
    }
    const generateReactElementArray = async (selectedDesign:Design|null = design) => {
        if (selectedDesign === null) return;
        // If ReactElementArr is not empty generateDataUrl and return;
        if (!ReactElementArr || (ReactElementArr.length > 0)) {
            generateDataUrl();
            return;
        }
        const arr: Array<React.JSX.Element> = [];

        for (const label of selectedCatalog.labels) {
            const canvasLabel = <LabelCanvas key={'ReactLabel$'+label._id} label={label} design={selectedDesign} blocks={selectedDesign.blocks} />;

            arr.push(canvasLabel);

        }
        if (arr) setReactElementArr(arr);
    }
    const generateDataUrl = () => {
        if (dataURLs.length > 1) return;
        const arr = [];
        for (const label of selectedCatalog.labels) {
            const cnv = document.getElementById('canvas$' + label._id);
            if (cnv && cnv.getAttribute('data-url')) {
                //TODO: for PERFORMANCE passing as OBJ{url:cnv.getAttribute('data-url'), count:label.count}
                for (let i = 1; i <= label.count; i++) {
                    arr.push(cnv.getAttribute('data-url'));
                }
            }
        }
        if (arr.length > 1 && isStringArray(arr))
            setDataURLs(arr);
    }
    
    generateReactElementArray();
    
    //console.log(dataURLs);
    return (
        <> {ReactElementArr ? <div style={{ display: 'none', visibility: 'hidden' }}>
            {ReactElementArr && !isHTMLCanvasElementArray(ReactElementArr) ?
                ReactElementArr.map(canvas =>
                    canvas) : null
            }
        </div> : null}
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
        </>
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
