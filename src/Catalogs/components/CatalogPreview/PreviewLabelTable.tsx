/* Used to display the catalog data in a table
 to allow the user to edit the count of the labels
 preview of the labels in the catalog
 */

import { DataGrid, GridToolbar, GridRowSelectionModel } from '@mui/x-data-grid';
import { IloadedCatalog } from '../../../DB/Interfaces/Catalogs';
import React from 'react';
import { MyCustomNoRowsOverlay, getColsRows, handleCountChangeFactory } from '../DataTable/columns';
import { dataGridWrapperStyle } from '../../styles/dataTableStyles';
import Grid from '@mui/material/Grid2';
export default function DataTableStates({ catalog, updateCatalog, setSelectedRows }:
    {
        catalog: IloadedCatalog,
        updateCatalog: (catalog: IloadedCatalog) => void,
        setSelectedRows: (arg: string[]) => void
    }) {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

    const handleSetRowSelectionModel = (element: GridRowSelectionModel) => {
        //@ts-ignore
        setSelectedRows(element);
        setRowSelectionModel(element);
        //to add it to DataGrid - Selected
    }
  
    const handleCountChange = React.useMemo(
        () => handleCountChangeFactory(catalog, updateCatalog),
        [catalog, updateCatalog]
    )
    const [rows, columns] = getColsRows(catalog, handleCountChange);
    return (
        
            <DataTable rows={rows} columns={columns} rowSelectionModel={rowSelectionModel} setRowSelectionModel={handleSetRowSelectionModel} />
    )
}

function DataTable({ rows, columns,  rowSelectionModel, setRowSelectionModel }: { rows: any, columns: any, rowSelectionModel: GridRowSelectionModel, setRowSelectionModel: (arg: GridRowSelectionModel) => void }) {

    return (
        <Grid sx={dataGridWrapperStyle}>
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
            onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
            rowSelectionModel={rowSelectionModel}
            checkboxSelection
                    slots={{
                        noRowsOverlay: MyCustomNoRowsOverlay,
                        toolbar: GridToolbar
                    }}
            />
                </Grid>
    );
}