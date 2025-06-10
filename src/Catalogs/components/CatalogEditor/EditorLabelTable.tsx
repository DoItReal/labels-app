import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { MyCustomNoRowsOverlay, getColsRows, handleCountChangeFactory } from "../DataTable/columns";
import { IloadedCatalog } from "../../../DB/Interfaces/Catalogs";
import React from "react";
import { getLocalLabelById } from "../../../DB/LocalStorage/Labels";
import { deleteSelectedLabels, saveSelectedCatalog } from "../../../DB/SessionStorage/Catalogs";


const DataTable = ({ catalog, updateCatalog }:
    {
        catalog: IloadedCatalog,
        updateCatalog: (catalog: IloadedCatalog) => void
    }) => {
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
    const [rows, columns] = getColsRows(catalog, handleCountChange, handleDeleteLabel, { includeActions: true },);
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
                slots={{
                    noRowsOverlay: MyCustomNoRowsOverlay,
                    toolbar: GridToolbar
                }}
            />
    );
}


export default DataTable;