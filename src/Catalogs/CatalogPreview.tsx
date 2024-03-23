/* Used to display the catalog data in a table
 to allow the user to edit the count of the labels
 preview of the labels in the catalog
 */

import LabelTable from './PreviewLabelTable';
import LabelPreview from './PreviewLabels';
import { IloadedCatalog, isLoadedCatalog } from './Interfaces/CatalogDB';
import { Button, Grid, Input, InputLabel, MenuItem, Select } from '@mui/material';
import { fetchDesigns, getLocalDesigns, setLocalDesigns } from '../DesignEditor/DesignDB';
import { useContext, useEffect, useState } from 'react';
import { Design, isDesign, isDesignArray } from '../DesignEditor/Interfaces/CommonInterfaces';
import { enableStatesContext } from '../App';

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}
export default function DataTableStates({ catalog }:
    { catalog: IloadedCatalog }) {
        const [design, setDesign] = useState<Design | null>(null);
          
   
    return (

        <Grid container spacing={1} style={{ maxWidth: '100%',height:'75vh' }}>
            <Grid item width={1} >
                <InfoBar catalog={catalog} design={design} setDesign={setDesign } />
            </Grid>  
            <Grid item width={1 / 2} >
                <LabelTable catalog={catalog} />
            </Grid>
            { design ? (
            <Grid item width={1 / 2} style={{ maxHeight: '100%', maxWidth: '100%', overflow: 'auto' }}>
                    <LabelPreview catalog={catalog} design={design} />
                </Grid>
            ) : null}
        </Grid>
    )
}

const InfoBar = ({ catalog,design, setDesign }: { catalog: IloadedCatalog,design:Design | null, setDesign: (design:Design)=>void }) => {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    return (
        <Grid container columnSpacing={1 }>
            <Grid item>
                <InputLabel>Catalog Name</InputLabel>
                <Input type='text' placeholder='Catalog Name' size='medium' value={catalog.name}
                    disabled />
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
                <DesignSelector design={design}  setDesign={setDesign} />
            </Grid>
            <Grid item>
                {/* Create PDF and show popovers */}

                <Button onClick={()=> updateStates('createPDF', true)}>Create PDF</Button>
            </Grid>
        </Grid>
    )
};
// WORK IN PROGRESS.......
// DesignSelector component to select the design from the available designs
const DesignSelector = ({ design, setDesign }: { design: Design | null, setDesign: (design: Design) => void }) => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const updateDesign = (id: string) => {
        // Find the design with the selected id
        const selectedDesign = designs.find(design => design._id === id);
        if (selectedDesign && isDesign(selectedDesign)) {
            setDesign(selectedDesign);
        }
    }
    const MockDesigns =  () => {
        const fetchedDesigns = getLocalDesigns();
        // If fetchedDesigns is null or not an array of designs return null
        if (!fetchedDesigns || !isDesignArray(fetchedDesigns)) {
            return [];
        } // If fetchedDesigns is an array of designs return the fetchedDesigns
        return (fetchedDesigns);
    }
    // Fetch designs from session storage on component mount
    useEffect(() => {
        // Fetch designs only if designs is empty
        if (!designs || !isDesignArray(designs)) {
            const fetchedDesigns = MockDesigns();
            if (fetchedDesigns) {
                setDesigns(fetchedDesigns);
                setDesign(fetchedDesigns[0]);
            }
        }
    }, []);
    if (!designs || !isDesignArray(designs)) return null;
  
    return (
        <>
                <InputLabel>Design</InputLabel>
                <Select value={design ? design._id : designs[0]._id} size='small' onChange={(e) => { updateDesign(e.target.value); }} >
                {designs.map( design =>
                    <MenuItem key={design._id} value={design._id}>{design.name}</MenuItem>
                )
                    }
                </Select>
        </>
    )

    }