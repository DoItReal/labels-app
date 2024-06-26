import { useContext, useEffect, useRef, useState } from 'react';
import { enableStatesContext } from '../App';
import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react';
import Draggable from 'react-draggable';
import { Box, CircularProgress, Container, IconButton, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import LabelCanvas from '../DesignEditor/LabelCanvas';
import { Design } from '../DB/Interfaces/Designs';
import { IloadedCatalog, isLoadedCatalog,IloadedLabel,isIloadedLabelArray } from '../DB/Interfaces/Catalogs';
import { PDF } from './PDF';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
export default function PdfViewer({ labels, design, qrCode, twoSided }: {labels:IloadedLabel[], design: Design, qrCode:Boolean, twoSided:boolean }) {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    const [dataURLs, setDataURLs] = useState<Map<string, number>>(new Map());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pdfKey, setPdfKey] = useState<number>(0);
    const classes = useStyles();
    const id = enableStates.get('createPDF') ? 'PDFPopover' : undefined;
    const updatePdf = () => {
        setPdfKey(prevKey => prevKey + 1);
    };
    useEffect(() => {
        if (!labels || !isIloadedLabelArray(labels) || labels.length === 0 || !design || !enableStates.get('createPDF')) {
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
           const startTime = performance.now();
           const { newData, unmountMountedComponents } = await renderLabelsToDataUrls(labels, design, qrCode);
           const endTime = performance.now();
           console.log(`Time taken to render labels to data URLs: ${endTime - startTime} ms`);
           setDataURLs(structuredClone(newData));
           setIsLoading(false);
           return unmountMountedComponents;
        };

        fetchData();

       
    }, [enableStates, labels, design, qrCode]);

    const handleClose = (event: React.MouseEvent | React.TouchEvent) => {
        event.stopPropagation();
        updateStates('createPDF', false);
    };

    if (!enableStates.get('createPDF')) return null;

    return (
        <Draggable handle='.handle' defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 8 }}>
            <Paper
                elevation={5}
                id={id}
                classes={{ root: classes.popoverRoot }}
                sx={{ minWidth: '30%', minHeight: '75%', maxWidth: '50%', translate: "-50%", zIndex: '9999' }}
            >
                <Container disableGutters sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box className='handle' sx={{ backgroundColor: 'primary.main', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                        <IconButton
                            size="small"
                            title="Refresh"
                            onClick={updatePdf}
                            sx={{
                                backgroundColor: 'info.main',
                                border: '1px solid black',
                                borderRadius: '4px',
                                padding: "2px",
                                margin: '2px',
                                "&:hover": { backgroundColor: "info.main", border: '1px solid white' }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            title="Close"
                            onClick={handleClose}
                            onTouchEndCapture={handleClose}
                            sx={{
                                float: 'right',
                                padding: '2px',
                                margin: '2px',
                                borderRadius: '4px',
                                border: '1px solid black',
                                backgroundColor: 'error.main',
                                "&:hover": { backgroundColor: "error.main", border: '1px solid white' }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'contents' }}>
                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </div>
                        ) : (
                                <PDF key={pdfKey} imageURLs={dataURLs} design={design} twoSided={twoSided } />
                        )}
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
        position: 'absolute'
    },
}));
/*
    Used to render labels to data URLs.
    @param labels - The selected catalog
    @param design: Design - The selected design
    @param qrCode: Boolean - Whether to render QR codes
    @returns 1.A map of data URLs and their counts
             2.A function to unmount mounted components

*/
const renderLabelsToDataUrls = async (labels: IloadedLabel[], design: Design, qrCode: Boolean) => {
    const newData = new Map();
    const mountedComponents: {root:any,tempDiv:HTMLDivElement}[] = [];
    await Promise.all(
        labels.map(async (label) => {
            const tempDiv = document.createElement('div');
            const canvas = document.createElement('canvas');
            canvas.width = design.canvas.dim.width;
            canvas.height = design.canvas.dim.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const labelCanvas = <LabelCanvas design={design} blocks={design.blocks} label={label} qrCode={qrCode} />;
                const root = createRoot(tempDiv);
                root.render(labelCanvas);
                await new Promise((resolve) => setTimeout(resolve, 100));
                const sourceCanvas = tempDiv.querySelector('canvas') as HTMLCanvasElement | null;
                if (sourceCanvas) {
                    ctx.drawImage(sourceCanvas, 0, 0);
                    const dataURL = canvas.toDataURL();
                    const count = label.count; // Retrieve the count from the label
                    if (newData.has(dataURL)) {
                        newData.set(dataURL, newData.get(dataURL)! + count); // Add the count to existing dataURL count
                    } else {
                        newData.set(dataURL, count); // Set the count for the new dataURL
                    }
                } else {
                    console.error("Failed to find a canvas element in the temporary div. Has to optimize LabelCanvas");
                }
                mountedComponents.push({ root, tempDiv });
            }
        })
    );
    const unmountMountedComponents = () => {
        mountedComponents.forEach(({ root, tempDiv }) => {
            root.unmount();
            ReactDOM.unmountComponentAtNode(tempDiv);
        });
    };

    return { newData, unmountMountedComponents };
};