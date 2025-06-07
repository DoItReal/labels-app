/* Used to display the catalog data in a table
 to allow the user to edit the count of the labels
 preview of the labels in the catalog
 */

import { Stack } from '@mui/material';
import { DataGrid, GridToolbar, GridRowSelectionModel } from '@mui/x-data-grid';
import { IloadedCatalog, isLoadedCatalog } from '../../../DB/Interfaces/Catalogs';
import React from 'react';
import { getRows, dataColUnfiltered, keys } from '../DataTable/catalogUtils';
import { MyCustomNoRowsOverlay, getColsRows, getColumnDefs, handleCountChangeFactory } from '../DataTable/columns';
import { dataGridStyles } from '../../styles/dataTableStyles';
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
        <div style={{overflow:'auto', height:'100%'} }>
            <DataTable rows={rows} columns={columns} rowSelectionModel={rowSelectionModel} setRowSelectionModel={handleSetRowSelectionModel} />
        </div>
    )
}

function DataTable({ rows, columns,  rowSelectionModel, setRowSelectionModel }: { rows: any, columns: any, rowSelectionModel: GridRowSelectionModel, setRowSelectionModel: (arg: GridRowSelectionModel) => void }) {

    return (
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
                    sx={{ dataGridStyles }}
                    slots={{
                        noRowsOverlay: MyCustomNoRowsOverlay,
                        toolbar: GridToolbar
                    }}
                />
    );
}