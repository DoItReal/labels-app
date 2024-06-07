/* Used to display the catalog data in a table
 to allow the user to edit the count of the labels
 preview of the labels in the catalog
 */import React, { useState, useEffect, useContext } from 'react';
import { Autocomplete, Button, Grid, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import LabelTable from './PreviewLabelTable';
import LabelPreview from './PreviewLabels';
import { IloadedCatalog, isLoadedCatalog } from '../DB/Interfaces/Catalogs';
import { getLocalDesigns} from '../DB/LocalStorage/Designs';
import { Design, isDesign, isDesignArray } from '../DB/Interfaces/Designs';
import { enableStatesContext } from '../App';
import { formatDate } from '../tools/helpers';
import PDF from '../PDF/index';
import { getLabels } from '../DB/LocalStorage/Labels';
import { SearchBar as SearchBarTest } from './CatalogEditor'; 
import { GridRowSelectionModel } from '@mui/x-data-grid';
export default function DataTableStates({ previewedCatalog }: { previewedCatalog: IloadedCatalog }) {
    const [catalog, setCatalog] = useState<IloadedCatalog>(previewedCatalog);
    const [design, setDesign] = useState<Design | null>(null);
    const [qrCode, setQrCode] = useState<Boolean>(false);
    const [twoSided, setTwoSided] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [enableStates, updateStates] = useContext(enableStatesContext);

    const selectLabelsById = (selectedLabels: GridRowSelectionModel) => {
        console.log(selectedLabels);
    }
    /** updates the catalog in the state */
    const updateCatalog = (updatedCatalog: IloadedCatalog) => {
        setCatalog({ ...updatedCatalog });
    };
    /**
     * Adds a label to the selected catalog and returns the updated catalog
     */
    const addLabelLocally = (catalog: IloadedCatalog, label: any) => {
        var tmpCatalog = { ...catalog };
        const isLabelFound = catalog.labels.some((l) => l._id === label._id);
        //if label is found increment the count
        if (isLabelFound) {
            const newLabels = catalog.labels.map(lbl => {
                if (lbl._id === label._id) {
                    return {
                        ...lbl,
                        count: lbl.count + 1
                    }
                } else return lbl;
            });
            //update the catalog in the state
            tmpCatalog = (({ ...catalog, size: catalog.size + 1, labels: newLabels }));
        }
        //else add label to selected catalog
        else {
            const newCatalog = {
                ...catalog, labels: [...catalog.labels, { ...label, count: 1 }]
            };
            newCatalog.volume += 1;
            newCatalog.size += 1;
            if (isLoadedCatalog(newCatalog)) {
                //update the catalog in the state
                tmpCatalog = (newCatalog);
            }
        }
        return tmpCatalog;
    }


    const addLabelsLocally = (labels: any[]) => {
        var updatedCatalog = { ...catalog };
            labels.forEach(label => {
                updatedCatalog = addLabelLocally(updatedCatalog, label);
            });
            // saveSelectedCatalog(structuredClone(updatedCatalog));
            updateCatalog(structuredClone(updatedCatalog));
    }
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
            {enableStates.get('createPDF') && catalog && design && <PDF labels={catalog.labels.filter(label=>selectedRows.includes(label._id))} design={design} qrCode={qrCode} twoSided={twoSided} />}
            <Grid container spacing={0} style={{ maxWidth: '100%',height:'100%', marginBottom:'10vh', overflow:'auto' }}>
                <Grid container>
                    <Grid item xs={6}>
                        <InfoBar catalog={catalog} design={design} setDesign={setDesign} />
                    </Grid>
                    <Grid item xs={6}>
                        <PdfUI catalog={catalog} design={design} setDesign={setDesign} qrCode={qrCode} setQrCode={setQrCode} twoSided={twoSided} setTwoSided={setTwoSided} />
                    </Grid>
                    <Grid item xs={6} justifyContent='left'>
                        <SearchBarTest addLabels={addLabelsLocally } />
                    </Grid>
                   
                </Grid>
                
                <Grid item xs={6} sx={{overflow:'auto', maxHeight:'60vh'} }>
                    <LabelTable catalog={catalog} updateCatalog={updateCatalog} setSelectedRows={setSelectedRows} />
                </Grid>
                {/* Render LabelPreview component if design is available */}
                {design && (
                    <Grid item xs={6} style={{ maxHeight: '60vh', maxWidth: '100%', overflow: 'auto' }}>
                        <LabelPreview catalog={catalog} design={design} qrCode={qrCode} selectedRows={selectedRows }  />
                    </Grid>
                )}
            </Grid>
        </>
    );
}
/**
 * To add option to select: 1 sided or 2 sided Print
 */
const PdfUI = ({ catalog, design, setDesign, qrCode, setQrCode, twoSided, setTwoSided }:
    {
        catalog: IloadedCatalog,
        design: Design | null,
        setDesign: (design: Design) => void,
        qrCode: Boolean,
        setQrCode: (bool: Boolean) => void,
        twoSided: boolean,
        setTwoSided: (bool: boolean) => void
    }) => {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    return (
        <Grid container>
        <Grid item>
            <DesignSelector design={design} setDesign={setDesign} />
        </Grid>
         <Grid item>
                {/* Create PDF and show popovers */}
                <Button onClick={() => updateStates('createPDF', true)}>Create PDF</Button>
                <Button onClick={() => setQrCode(!qrCode)}>
                    {qrCode ? 'Hide QR Code' : 'Show QR Code'}
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={() => setTwoSided(!twoSided)}>
                    {twoSided ? '1 Sided Print' : '2 Sided Print'}
                </Button>
                </Grid>
        </Grid>
    );
};
const InfoBar = ({ catalog, design, setDesign}:
    {
        catalog: IloadedCatalog; design: Design | null; setDesign: (design: Design) => void }) => {
 
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
    const initDesigns = () => {
        const fetchedDesigns = getLocalDesigns();
        if (fetchedDesigns && isDesignArray(fetchedDesigns)) {
            
            setDesigns(fetchedDesigns);
            setDesign(fetchedDesigns[0]);
        }
    }
    useEffect(() => {
        // Fetch designs from session storage on component mount
        initDesigns();
    }, []);

    if (!designs.length || !isDesignArray(designs)) {
        return null;
    }

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
