import * as React from 'react';
import { DataGrid, GridActionsColDef, GridApi, GridCallbackDetails, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { GridActionsCellItem } from "@mui/x-data-grid"; 
import { isNotNullOrUndefined } from './tools/helpers';
import { labelDataType } from './db';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
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

const data:any[] = [
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8] },
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12] },
];
const dataMap = new Map();
dataMap.set('bg', 'Bulgarian');
dataMap.set('en', 'English');
dataMap.set('de', 'Deutsch');
dataMap.set('rus', 'Russian');
dataMap.set('allergens', 'Allergens');

const rows = data.map(el => {
    el.id = el._id; el.actions = {}; return el;
});

const keys = Object.keys(rows[0]);
const dataColUnfiltered = keys.map((key) => {
    if (dataMap.get(key))
        return { name: dataMap.get(key), type: key, width: 250 }
    return null;
}).filter(isNotNullOrUndefined);
dataColUnfiltered.push({
    name: 'Actions',
    type: 'actions',
    width:100
});

const col = dataColUnfiltered.map(element => {
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

const columns: GridColDef[] =  [
    ...col,
   
];


export default function DataTable() {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    React.useEffect(() => console.log(rowSelectionModel));
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
                    width:1
                } }
            />
    );
}

