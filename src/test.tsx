import * as React from 'react';
import { DataGrid, GridActionsColDef, GridApi, GridCallbackDetails, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { GridActionsCellItem } from "@mui/x-data-grid"; 
import { isNotNullOrUndefined } from './tools/helpers';
import { labelDataType } from './db';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/material';
export function Filter(dbData: labelDataType[] | undefined, filterText: string, filterCategory: Array<string>) {
    let filteredList: labelDataType[] = [];
    if (!dbData || dbData.length === 0) return [];
    filterCategory.forEach((item) => {
        if (item === "all") {
            filteredList = dbData;
            return;
        }
        dbData.forEach(e => {
            if (e.category && e.category.length === 0) {
                return;
            } else {
                for (let i = 0; i < e.category.length; i++) {
                    if (e.category[i] === item) { filteredList.push(e); }
                }
            }
        });
        for (let i = 0; i < filteredList.length - 1; i++) {
            for (let j = i + 1; j < filteredList.length; j++) {
                if (filteredList[i]._id === filteredList[j]._id) {
                    filteredList.splice(j, 1);
                    j -= 1;
                }
            }

        }
        return filteredList;
    });

    return filteredList.filter(data => data.bg.toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
}

// to save in db and fetch it
const dataMap = new Map();
dataMap.set('bg', 'Bulgarian');
dataMap.set('en', 'English');
dataMap.set('de', 'Deutsch');
dataMap.set('rus', 'Russian');
dataMap.set('allergens', 'Allergens');

const rows = (data:any[])=> data.map(el => {
    el.id = structuredClone(el._id); el.actions = {}; return el;
});
const keys = (rows:any[]) => Object.keys(rows[0]);
const dataColUnfiltered = (keys:string[]) => keys.map((key) => {
    if (dataMap.get(key))
        return { name: dataMap.get(key), type: key, width: 200 }
    return null;
}).filter(isNotNullOrUndefined);
const col = (dataColUnfiltered: {name:any,type:string,width:number}[])=>dataColUnfiltered.map(element => {
    if (element !== null) {
        if (element.type === 'actions') {
            return ({
                field: 'actions', headerName: 'Actions', sortable: false, type: "actions",
                getActions: (params:GridActionsColDef) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log(params);
                        }}
                        label="Delete"
                        showInMenu={true}
                    />,
                    <GridActionsCellItem
                        icon={<AddIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('add');
                        }}
                        label="Add"
                        showInMenu={true}
                    />,
                    <GridActionsCellItem
                        icon={<PreviewIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('preview');
                        }}
                        label="Preview"
                        showInMenu={true}
                    />,
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Edit');
                        }}
                        label="Edit"
                        showInMenu={true}
                    />
                ]
            });
        } else {
            return { field: element.type, headerName: element.name, width: element.width }
        }
    }
    else {
    return null; };
}).filter(isNotNullOrUndefined);

const getColsRows = (data: any) => {
    if (data === undefined || data.length === 0) return [[], []];
    const row = rows(data);
    const colUnfilteredData = dataColUnfiltered(keys(row));
    colUnfilteredData.push({
        name: 'Actions',
        type: 'actions',
        width: 100
    });
    const cols = col(colUnfilteredData);
    return [row, [...cols]];

}

const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    No Labels Loaded
</Stack>);
export default function DataTable({ dbData }: {dbData:labelDataType[]|undefined}) {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
   // if (dbData === undefined || dbData.length === 0) return null;
    const [rows, columns] = getColsRows(dbData);
   // React.useEffect(() => console.log(rowSelectionModel));
    return (
        <DataGrid
            density='compact'
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            checkboxSelection
            
            onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
            sx={{
                height: 1,
                width: 1
            }}
            slots={{
                noRowsOverlay: MyCustomNoRowsOverlay
            }}
        />
    );
}

