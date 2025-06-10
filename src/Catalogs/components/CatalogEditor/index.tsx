import { editCatalogLocally } from '../../../DB/SessionStorage/Catalogs';
import { IloadedCatalog, isLoadedCatalog } from '../../../DB/Interfaces/Catalogs';
import { createCatalogDB, updateCatalogDB } from '../../../DB/Remote/Catalogs';
import Grid from '@mui/material/Grid2';
import SearchBar from '../SearchBar'; 
import InfoBar from '../CatalogInfoBar';
import { dataGridWrapperStyle, gridContainerStyle, topBarWrapperStyle } from '../../styles/dataTableStyles';
import React from 'react';
import LabelTable from './EditorLabelTable';
export default function DataTableStates({ catalog,setCatalog}:
    { catalog: IloadedCatalog, setCatalog: (arg: IloadedCatalog) => void }) {
    const updateCatalog = (updatedCatalog: IloadedCatalog) => {
        setCatalog(updatedCatalog);
    }
    const saveCatalog = async () => {
        const updatedCatalog = { ...catalog, lastUpdated: new Date().toISOString(), updates: catalog.updates + 1 };
        setCatalog(updatedCatalog);
        try {
            // If the catalog is new, create it in the database
            if (updatedCatalog._id === 'newCatalog1') {
                const newCatalog = await createCatalogDB(updatedCatalog);
                if (!newCatalog) return;

                if (isLoadedCatalog(newCatalog)) {
                    setCatalog(newCatalog);
                } else {
                    const updated = { ...catalog, _id: newCatalog._id };
                    setCatalog(updated);
                    editCatalogLocally(updated);
                }
            }
            else {
                // Otherwise, update the existing catalog
                await updateCatalogDB(updatedCatalog);
                editCatalogLocally(updatedCatalog);
            }
        } catch (e) {
            console.error(e);
        }
    }
    var updatedCatalog = { ...catalog };
    /**
     * adds labels to catalog and updates the catalog in the state
     */
    const addLabels = (labels: any[]) => {
        labels.forEach(label => {
            updatedCatalog = addLabel(updatedCatalog, label);
        });
        // saveSelectedCatalog(structuredClone(updatedCatalog));
        updateCatalog(structuredClone(updatedCatalog));
    }
    /**
     * adds label to catalog and return the Updated Catalog  
     */
    const addLabel = (tmpCatalog: IloadedCatalog, label: any) => {
        var updatedCatalog = tmpCatalog;
        const isLabelFound = updatedCatalog.labels.some((l) => l._id === label._id);
        //if label is found increment the count
        if (isLabelFound) {
            const newLabels = updatedCatalog.labels.map(lbl => {
                if (lbl._id === label._id) {
                    return {
                        ...lbl,
                        count: lbl.count + 1
                    }
                } else return lbl;
            });

            //update the catalog in the state
            updatedCatalog = (({ ...updatedCatalog, size: updatedCatalog.size + 1, labels: newLabels }));
            // return updatedCatalog;
        }
        //else add label to selected catalog
        else {
            const newCatalog = {
                ...updatedCatalog, labels: [...updatedCatalog.labels, { ...label, count: 1 }]
            };
            newCatalog.volume += 1;
            newCatalog.size += 1;
            if (isLoadedCatalog(newCatalog)) {
                //update the catalog in the state
                updatedCatalog = newCatalog;
                //   return newCatalog;
            }
        }
        return updatedCatalog;
    }
   
    return (
        <Grid container spacing={0} sx={gridContainerStyle} >
            {/* Top section: InfoBar + SearchBar */}
            <Grid container sx={topBarWrapperStyle}>
                <Grid size={{ xs: 6, sm: 8, md: 10, lg: 12, xl: 12 }}>
                    <InfoBar catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
                </Grid>
                <Grid size={{ xs: 12 }} >
                    <SearchBar addLabels={addLabels} />
                </Grid>
            </Grid>

            {/* Bottom section: DataGrid fills remaining space */}
            <Grid size={{ xs: 12 }} sx={dataGridWrapperStyle}>
                <LabelTable catalog={catalog} updateCatalog={updateCatalog} />
            </Grid>
        </Grid>
    )
}