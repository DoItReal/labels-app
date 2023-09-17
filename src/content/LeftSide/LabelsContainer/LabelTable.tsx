import * as React from 'react';
import {
    DataGrid
    , GridRow, GridRowSelectionModel, GridToolbar
} from '@mui/x-data-grid';
import { GridActionsCellItem } from "@mui/x-data-grid"; 
import { isNotNullOrUndefined } from '../../../tools/helpers';
import { labelDataType } from '../../../db';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import {  Box, Stack } from '@mui/material';
import { Alert } from '../../../components/Alert';
import { useState } from 'react';
import { SaveLabel } from '../SaveLabel/index';
import { filterCategoryContext } from './index';
import Preview from '../../../UI/Preview';


export function Filter(dbData: labelDataType[] | undefined) {
    const [filterCategory] = React.useContext(filterCategoryContext);
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

    return filteredList;
}

// to save in db and fetch it
const dataMap = new Map();
dataMap.set('bg', 'Bulgarian');
dataMap.set('en', 'English');
dataMap.set('de', 'Deutsch');
dataMap.set('rus', 'Russian');
dataMap.set('allergens', 'Allergens');



const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    No Labels Loaded
</Stack>);
function DataTable({ rows, columns,rowSelectionModel, setRowSelectionModel }: { rows: any, columns: any,rowSelectionModel:GridRowSelectionModel, setRowSelectionModel: (arg: GridRowSelectionModel)=>void }) {
    
   // if (dbData === undefined || dbData.length === 0) return null;
  
   // React.useEffect(() => console.log(rowSelectionModel));
    return (
        <Box height={1}  sx={{
            position:'relative',
            overflow: 'auto',
           
        }}>
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
            checkboxSelection
            
            onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
            rowSelectionModel={rowSelectionModel }
            sx={{
                height: 1,
                width: 1,
            }}
            slots={{
                noRowsOverlay: MyCustomNoRowsOverlay,
                toolbar: GridToolbar
            }}
            />
        </Box>
    );
}

export default function DataTableStates({ dbData, handleSaveLabel, deleteLabel, addLabels }:
    { dbData: labelDataType[] | undefined, handleSaveLabel: (arg: labelDataType) => void, deleteLabel: (arg: labelDataType) => void, addLabels:(arg:labelDataType[])=>void }) {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [preview, setPreview] = useState<labelDataType | undefined>(undefined);
    const [showPreview, setShowPreview] = useState(false);
    const [editLabel, setEditLabel] = useState<labelDataType | undefined>(undefined);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [error, setError] = useState<JSX.Element | null>(null);

    const handleSelectSingleElement = (element: string) => {
       // setRowSelectionModel(structuredClone([...rowSelectionModel, element]));
        console.log(rowSelectionModel);
        //to add it to DataGrid - Selected
    }
    const getColsRows = (data: any): [rows: any, columns: any] => {
        if (data === undefined || data.length === 0) return [[], []];
        const row = getRows(data);
        const colUnfilteredData = dataColUnfiltered(keys(row));
        colUnfilteredData.push({
            name: 'Actions',
            type: 'actions',
            width: 100
        });
        const cols = col(colUnfilteredData);
        return [row, [...cols]];

    }
    const handleDeleteLabel = React.useCallback((row: typeof GridRow & labelDataType) => async () => {
        try {
            await deleteLabel(row);
            const time = 5000;
            setError(<Alert severity="success" handleClose={() => setError(null)}><strong>Label: </strong> {row.bg} <strong>sucessfuly deleted!</strong></Alert>);
            setTimeout(() => setError(null), time);
        } catch (error) {
            const time = 5000;
            setError(<Alert severity="error" handleClose={() => setError(null)}><strong>Unable to delete Label!</strong></Alert>);
            setTimeout(() => setError(null), time);
        }
    }, []);
    const handleSetPreview = React.useCallback((row:typeof GridRow & labelDataType)=>() => {
        setPreview(row);
        setShowPreview(true);
    }, []);
    const handleClosePreview = () => {
        setPreview(undefined);
        setShowPreview(false);
    }

    const handleSetEdit = React.useCallback((row: typeof GridRow & labelDataType) => () => {
        setEditLabel(row);
        setShowEdit(true);
    }, []);
    const handleCloseEdit =  () => {
        setEditLabel(undefined);
        setShowEdit(false);
    }

    const col = (dataColUnfiltered: { name: any, type: string, width: number }[]) => dataColUnfiltered.map(element => {
        if (element !== null) {
            if (element.type === 'actions') {
                return ({
                    field: 'actions', headerName: 'Actions', sortable: false, type: "actions",
                    getActions: (params: any) => [
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            onClick={handleDeleteLabel( params.row)      }
                            label="Delete"
                            showInMenu={true}
                        />,
                        <GridActionsCellItem
                            icon={<AddIcon />}
                            onClick={
                                ()=>addLabels([params.row])
                            }
                            label="Add"
                            showInMenu={true}
                        />,
                        <GridActionsCellItem
                            icon={<PreviewIcon />}
                            onClick={handleSetPreview(params.row)}
                            label="Preview"
                            showInMenu={true}
                        />,
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            onClick={handleSetEdit(params.row)}
                            label="Edit"
                            showInMenu={true}
                        />
                    ]
                });
            } else if (element.type === 'allergens') {
                return { field: element.type, headerName: element.name, width: element.width, sortable: false, filterable:false };
            } else {
                return { field: element.type, headerName: element.name, width: element.width }
            }
        }
        else {
            return null;
        };
    }).filter(isNotNullOrUndefined);

    const [rows, columns] = getColsRows(Filter(dbData));
   
    return (
        <>
            <DataTable rows={rows} columns={columns} rowSelectionModel={rowSelectionModel} setRowSelectionModel={setRowSelectionModel} />
            {showPreview ? <Preview label={preview} open={showPreview} handleClose={handleClosePreview} /> : null}
            {showEdit && editLabel ? <SaveLabel open={showEdit} handleClose={handleCloseEdit} label={editLabel} handleSubmit={handleSaveLabel} /> : null}
            {error !== null ? error : null}
        </>
    )
}

const getRows = (data: any[]) => data.map(el => {
    el.id = structuredClone(el._id); el.actions = {}; return el;
});
const keys = (rows: any[]) => Object.keys(rows[0]);
const dataColUnfiltered = (keys: string[]) => keys.map((key) => {
    if (dataMap.get(key))
        return { name: dataMap.get(key), type: key, width: 150 }
    return null;
}).filter(isNotNullOrUndefined);

