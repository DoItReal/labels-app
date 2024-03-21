/* Used to display the catalog data in a table
 to allow the user to edit the count of the labels
 preview of the labels in the catalog
 */

import LabelTable from './PreviewLabelTable';
import LabelPreview from './PreviewLabels';
import { IloadedCatalog, isLoadedCatalog } from './Interfaces/CatalogDB';
import { Grid, Input, InputLabel } from '@mui/material';
import { fetchDesigns, getLocalDesigns, setLocalDesigns } from '../DesignEditor/DesignDB';
import { useEffect, useState } from 'react';
import { Design } from '../DesignEditor/Interfaces/CommonInterfaces';

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}
export default function DataTableStates({ catalog }:
    { catalog: IloadedCatalog }) {
const [designs, setDesigns] = useState<Design[]>([]);

    useEffect(() => {
        const storedDesigns = getLocalDesigns();
        if (storedDesigns) {
            setDesigns(storedDesigns);

        } else {
            const fetchDesignsFromDB = async () => {
                try {
                    const fetchedDesigns: string = await fetchDesigns();
                    const JSONfetchedDesigns: Design[] = JSON.parse(fetchedDesigns);
                    setDesigns(JSONfetchedDesigns);
                    // Store blocks in session storage
                    setLocalDesigns(JSON.parse(fetchedDesigns));
                } catch (error) {
                    console.error('Error fetching blocks:', error);
                }
            };

            fetchDesignsFromDB();
        }
    }, []);
        
   
    return (

        <Grid container spacing={1} style={{ maxWidth: '100%',height:'75vh' }}>
            <Grid item width={1} >
                <InfoBar catalog={catalog} />
            </Grid>  
            <Grid item width={1 / 2} >
                <LabelTable catalog={catalog} />
            </Grid>
            <Grid item width={1 / 2}  style={{ maxHeight: '100%',maxWidth: '100%', overflow: 'auto' }}>
                <LabelPreview catalog={catalog} design={designs[0] } />
            </Grid>
        </Grid>
    )
}

const InfoBar = ({ catalog }: { catalog: IloadedCatalog }) => {
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
            </Grid>
        </Grid>
    )
};