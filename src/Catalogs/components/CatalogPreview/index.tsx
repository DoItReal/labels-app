/* Used to display the catalog data in a table
 to allow the user to edit the count of the labels
 preview of the labels in the catalog
 */import React, { useState, useEffect, useContext } from 'react';
import Grid  from '@mui/material/Grid2';
import LabelTable from './PreviewLabelTable';
import LabelPreview from './PreviewLabels';
import { IloadedCatalog, isLoadedCatalog } from '../../../DB/Interfaces/Catalogs';
import { getLocalDesigns} from '../../../DB/LocalStorage/Designs';
import { Design, isDesignArray } from '../../../DB/Interfaces/Designs';
import { enableStatesContext } from '../../../App';
import PDF from '../../../PDF/index';
import { default as SearchBarTest } from '../SearchBar'; 
import InfoBar from '../CatalogInfoBar';
import OptionsUI from './OptionsUI';
export default function DataTableStates({ previewedCatalog }: { previewedCatalog: IloadedCatalog }) {
    const [catalog, setCatalog] = useState<IloadedCatalog>(previewedCatalog);
    const [design, setDesign] = useState<Design | null>(null);
    const [qrCode, setQrCode] = useState<Boolean>(false);
    const [twoSided, setTwoSided] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [enableStates, updateStates] = useContext(enableStatesContext);

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
                    <Grid size={{ xs: 6 }}>
                        <InfoBar catalog={catalog} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <OptionsUI catalog={catalog} design={design} setDesign={setDesign} qrCode={qrCode} setQrCode={setQrCode} twoSided={twoSided} setTwoSided={setTwoSided} />
                    </Grid>
                    <Grid size={{ xs: 6 }} justifyContent='left'>
                        <SearchBarTest addLabels={addLabelsLocally } />
                    </Grid>
                   
                </Grid>
                
                <Grid size={{ xs: 6 }} sx={{overflow:'auto', maxHeight:'60vh'} }>
                    <LabelTable catalog={catalog} updateCatalog={updateCatalog} setSelectedRows={setSelectedRows} />
                </Grid>
                {/* Render LabelPreview component if design is available */}
                {design && (
                    <Grid size={{ xs: 6 }} style={{ maxHeight: '60vh', maxWidth: '100%', overflow: 'auto' }}>
                        <LabelPreview catalog={catalog} design={design} qrCode={qrCode} selectedRows={selectedRows }  />
                    </Grid>
                )}
            </Grid>
        </>
    );
}



