import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { saveSelectedCatalog, deleteSelectedLabels, editCatalogLocally } from '../../../DB/SessionStorage/Catalogs';
import { IloadedCatalog, isLoadedCatalog } from '../../../DB/Interfaces/Catalogs';
import { createCatalogDB, updateCatalogDB } from '../../../DB/Remote/Catalogs';
import Grid from '@mui/material/Grid2';
import {  getLocalLabelById } from '../../../DB/LocalStorage/Labels';
import SearchBar from '../SearchBar'; 
import InfoBar from '../CatalogInfoBar';
import { MyCustomNoRowsOverlay, getColsRows, handleCountChangeFactory } from '../DataTable/columns';
import { dataGridWrapperStyle, gridContainerStyle, topBarWrapperStyle } from '../../styles/dataTableStyles';
import React from 'react';
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
  
    const handleDeleteLabel = (row: any) => () => {
        //remove the label from the catalog and setCatalog state
        const newLabels = catalog.labels.filter((label: any) => label._id !== row.id);
        const updatedCatalog = { ...catalog, size: catalog.size - 1, labels: newLabels };
        updateCatalog(updatedCatalog);
        const label = getLocalLabelById(row._id);
        if (label) {
            deleteSelectedLabels([label]);
            saveSelectedCatalog(updatedCatalog);
        }
        }
    const handleCountChange = React.useMemo(
        () => handleCountChangeFactory(catalog, updateCatalog),
        [catalog, updateCatalog]
    );
    const [rows, columns] = getColsRows(catalog, handleCountChange, handleDeleteLabel,  { includeActions: true },);
   
    return (
            <DataTable rows={rows} columns={columns} catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
    )
}

// this component renders the DataTable with the rows and columns passed as props
function DataTable({ rows, columns, catalog, updateCatalog, saveCatalog }: { rows: any, columns: any, catalog: IloadedCatalog, updateCatalog: (catalog: IloadedCatalog) => void, saveCatalog: () => void }) {
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
    const addLabel = (tmpCatalog:IloadedCatalog,label: any) => {
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
        <Grid container spacing={0} sx={gridContainerStyle } >
            {/* Top section: InfoBar + SearchBar */}
            <Grid container sx={topBarWrapperStyle}>
            <Grid size={{ xs: 6, sm: 8, md: 10, lg: 12, xl: 12 }}>
                <InfoBar catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
            </Grid>
            <Grid size={{ xs: 12 }} >
                <SearchBar addLabels = {addLabels} />
                </Grid>
            </Grid>

            {/* Bottom section: DataGrid fills remaining space */}
            <Grid size={{ xs: 12 }} sx={ dataGridWrapperStyle}>
            <DataGrid
                density='compact'
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 15 },
                    },
                }}
                pageSizeOptions={[10, 15, 25, 50, 100]}
                slots={{
                    noRowsOverlay: MyCustomNoRowsOverlay,
                    toolbar: GridToolbar
                }}
            />
            </Grid>
        </Grid>
    );
}

