/* Used to display the catalog data in a table
 to allow the user to edit the count of the labels
 preview of the labels in the catalog
 */import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, Input, InputLabel, MenuItem, Select } from '@mui/material';
import LabelTable from './PreviewLabelTable';
import LabelPreview from './PreviewLabels';
import { IloadedCatalog } from './Interfaces/CatalogDB';
import { getLocalDesigns} from '../DesignEditor/DesignDB';
import { Design, isDesign, isDesignArray } from '../DesignEditor/Interfaces/CommonInterfaces';
import { enableStatesContext } from '../App';
import { formatDate } from '../tools/helpers';
import PDF from '../PDF/index';
export default function DataTableStates({ previewedCatalog }: { previewedCatalog: IloadedCatalog }) {
    const [catalog, setCatalog] = useState<IloadedCatalog>(previewedCatalog);
    const [design, setDesign] = useState<Design | null>(null);
    const updateCatalog = (updatedCatalog: IloadedCatalog) => {
        setCatalog({ ...updatedCatalog });
    };

    useEffect(() => {
        // Fetch designs from session storage on component mount
        const fetchedDesigns = getLocalDesigns();
        if (fetchedDesigns && isDesignArray(fetchedDesigns)) {
            setDesign(fetchedDesigns[0]);
        }
    }, []);

    return (
        <>
            {/* Render PDF component if catalog and design are available */}
            { catalog && design && <PDF selectedCatalog={catalog} design={design} />}
            <Grid container spacing={1} style={{ maxWidth: '100%', height: '75vh' }}>
                <Grid item xs={12}>
                    <InfoBar catalog={catalog} design={design} setDesign={setDesign} />
                </Grid>
                <Grid item xs={6}>
                    <LabelTable catalog={catalog} updateCatalog={updateCatalog} />
                </Grid>
                {/* Render LabelPreview component if design is available */}
                {design && (
                    <Grid item xs={6} style={{ maxHeight: '100%', maxWidth: '100%', overflow: 'auto' }}>
                        <LabelPreview catalog={catalog} design={design} />
                    </Grid>
                )}
            </Grid>
        </>
    );
}

const InfoBar = ({ catalog, design, setDesign}:
    {
        catalog: IloadedCatalog; design: Design | null; setDesign: (design: Design) => void }) => {
    const [enableStates, updateStates] = useContext(enableStatesContext);

    return (
        <Grid container columnSpacing={1}>
            <Grid item>
                <InputLabel>Catalog Name</InputLabel>
                <Input type="text" placeholder="Catalog Name" size="medium" value={catalog.name} disabled />
            </Grid>
            <Grid item>
                <InputLabel>Created At</InputLabel>
                <Input value={formatDate(catalog.date)} disabled />
            </Grid>
            <Grid item>
                <InputLabel>Size</InputLabel>
                <Input value={catalog.size} disabled />
            </Grid>
            <Grid item>
                <DesignSelector design={design} setDesign={setDesign} />
            </Grid>
            <Grid item>
                {/* Create PDF and show popovers */}
                <Button onClick={()=>updateStates('createPDF',true)}>Create PDF</Button>
            </Grid>
        </Grid>
    );
};

const DesignSelector = ({ design, setDesign }: { design: Design | null; setDesign: (design: Design) => void }) => {
    const [designs, setDesigns] = useState<Design[]>([]);

    const updateDesign = (id: string) => {
        // Find the design with the selected id
        const selectedDesign = designs.find((design) => design._id === id);
        if (selectedDesign && isDesign(selectedDesign)) {
            setDesign(selectedDesign);
        }
    };

    useEffect(() => {
        // Fetch designs from session storage on component mount
        if (!designs || !isDesignArray(designs)) {
            const fetchedDesigns = getLocalDesigns();
            if (fetchedDesigns && isDesignArray(fetchedDesigns)) {
                setDesigns(fetchedDesigns);
                setDesign(fetchedDesigns[0]);
            }
        }
    }, []);

    if (!designs || !isDesignArray(designs)) return null;

    return (
        <>
            <InputLabel>Design</InputLabel>
            <Select value={design ? design._id : designs[0]._id} size="small" onChange={(e) => updateDesign(e.target.value)}>
                {designs.map((design) => (
                    <MenuItem key={design._id} value={design._id}>
                        {design.name}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
};
