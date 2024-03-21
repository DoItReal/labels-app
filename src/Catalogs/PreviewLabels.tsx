import React, { useEffect, useRef, useState } from 'react';
import { IloadedCatalog, isLoadedCatalog } from './Interfaces/CatalogDB';
import LabelCanvas from '../DesignEditor/LabelCanvas';
import { Design } from '../DesignEditor/Interfaces/CommonInterfaces';
import { Grid } from '@mui/material';
import ReactDOM from 'react-dom';

interface Props {
    design: Design
    catalog: IloadedCatalog;
}

const PreviewLabels = ({ catalog, design }: Props) => {
    const [labelData, setLabelData] = useState<Map<string, number>>(new Map());
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const renderLabelsToDataUrls = async () => {
            const newData = new Map<string, number>();
            await Promise.all(
                catalog.labels.map(async (label, labelIndex) => {
                    for (let i = 0; i < label.count; i++) { // Render each label based on its count
                        const tempDiv = document.createElement('div');
                        const canvas = document.createElement('canvas');
                        canvas.width = design.canvas.dim.width;
                        canvas.height = design.canvas.dim.height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            // Render LabelCanvas into div
                            const labelCanvas = <LabelCanvas design={design} blocks={design.blocks} label={label} />;
                            ReactDOM.render(labelCanvas, tempDiv);
                            await new Promise(resolve => setTimeout(resolve, 0)); // Wait for rendering to complete
                            // Draw content of the div onto canvas
                            ctx.drawImage(tempDiv.querySelector('canvas') as HTMLCanvasElement, 0, 0);
                            // Convert canvas to data URL
                            const dataURL = canvas.toDataURL();
                            if (newData.has(dataURL)) {
                                newData.set(dataURL, newData.get(dataURL)! + 1); // Increment count if dataURL exists
                            } else {
                                newData.set(dataURL, 1); // Set count to 1 if dataURL is new
                            }
                        }
                    }
                })
            );
            setLabelData(newData);
        };

        renderLabelsToDataUrls();

        // Clean up function
        return () => {
            labelRefs.current.forEach(ref => {
                if (ref && ref.firstChild) {
                    ReactDOM.unmountComponentAtNode(ref);
                }
            });
        };
    }, [catalog, design]);

    if (!design) return null;

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Grid container spacing={1} style={{ maxWidth: '100%', maxHeight:'100%', overflowX: 'hidden' }}>
            {Array.from(labelData.entries()).map(([dataURL, count], index) => (
                <React.Fragment key={index}>
                    {[...Array(count)].map((_, i) => ( // Render each label according to its count
                        <Grid item xs={6} key={`${index}-${i}`}> {/* Each label takes half of the row */}
                            <img src={dataURL} alt={`Preview ${index}`} style={{ width: '100%', height: 'auto' }} />
                        </Grid>
                    ))}
                </React.Fragment>
            ))}
            </Grid>
        </div>
    );
};

export default PreviewLabels;