/**
 * Component for previewing labels based on a design and catalog.
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { IloadedCatalog, IloadedLabel } from '../../../DB/Interfaces/Catalogs';
import LabelCanvas from '../../../DesignEditor/LabelCanvas';
import { Design } from '../../../DB/Interfaces/Designs';
import { CircularProgress, Grid } from '@mui/material';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

interface Props {
    design: Design;
    catalog: IloadedCatalog;
    qrCode: Boolean;
    selectedRows: string[];
}

/**
 * Component for previewing labels based on a design and catalog.
 * @param catalog The loaded catalog containing labels.
 * @param design The design to be used for rendering labels.
 * @returns The PreviewLabels component.
 */
const PreviewLabels = ({ catalog, design, qrCode, selectedRows }: Props) => {
    const [labelData, setLabelData] = useState<Map<string, number>>(new Map());
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    useLayoutEffect(() => {
        /**
         * Renders labels to data URLs.
         */
        if (selectedRows.length === 0) {
            setLabelData(new Map());
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const labels = catalog.labels.filter(label => selectedRows.includes(label._id));
            const { newData, unmountMountedComponents } = await renderLabelsToDataUrls(labels, design, qrCode);
            setLabelData(structuredClone(newData));
            setIsLoading(false);
            return unmountMountedComponents;
        };

        fetchData();

    }, [catalog, design, setLabelData, labelRefs, qrCode, selectedRows]);

    if (!design) return null;
    return (
        <div style={{ width: '100%',height:'100%', overflow: 'auto' }}>
            {isLoading ? ( // Show loading indicator while labels are being rendered
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </div>
            ) : (
                <Grid container spacing={1} style={{ maxWidth: '100%', overflowX: 'hidden',overflowY:'visible' }}>
                    {Array.from(labelData.entries()).map(([dataURL, count], index) => (
                        <React.Fragment key={`${dataURL}-${index}`}>
                            {[...Array(count)].map((_, i) => ( // Render each label according to its count
                                <Grid item xs={3} key={`${index}-${i}`}> {/* Each label takes half of the row */}
                                    <img src={dataURL} alt={`Preview ${index}`} style={{ width: '100%', height: 'auto' }} />
                                </Grid>
                            ))}
                        </React.Fragment>
                    ))}
                </Grid>)}
        </div>
    );
};

export default PreviewLabels;

const renderLabelsToDataUrls = async (labels: IloadedLabel[], design: Design, qrCode: Boolean) => {
    const newData = new Map();
    const mountedComponents: { root: any, tempDiv: HTMLDivElement }[] = [];
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
                await new Promise((resolve) => setTimeout(resolve, 1000));
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