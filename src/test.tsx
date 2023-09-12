import * as React from 'react';
import { DataGrid, GridActionsColDef, GridRow, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { GridActionsCellItem } from "@mui/x-data-grid"; 
import { isNotNullOrUndefined } from './tools/helpers';
import { labelDataType } from './db';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import {  Paper, Popover, Stack } from '@mui/material';
import { Label } from './labels';
import { Alert } from './components/Alert';
import { useState } from 'react';
import { Theme } from '@emotion/react';
import { makeStyles } from '@mui/styles';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { SaveLabel } from './content/LeftSide/SaveLabel';
import { ErrorUI } from './Error';
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



const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    No Labels Loaded
</Stack>);
function DataTable({ rows, columns,rowSelectionModel, setRowSelectionModel }: { rows: any, columns: any,rowSelectionModel:GridRowSelectionModel, setRowSelectionModel: (arg: GridRowSelectionModel)=>void }) {
    
   // if (dbData === undefined || dbData.length === 0) return null;
  
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
            rowSelectionModel={rowSelectionModel }
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

export default function DataTableStates({ dbData, handleSaveLabel, deleteLabel }: { dbData: labelDataType[] | undefined, handleSaveLabel:(arg:labelDataType)=>void, deleteLabel:(arg:labelDataType)=>void }) {
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
                            onClick={handleDeleteLabel(params.row)      }
                            label="Delete"
                            showInMenu={true}
                        />,
                        <GridActionsCellItem
                            icon={<AddIcon />}
                            onClick={
                                ()=>handleSelectSingleElement(params.id)
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
            } else {
                return { field: element.type, headerName: element.name, width: element.width }
            }
        }
        else {
            return null;
        };
    }).filter(isNotNullOrUndefined);

    const [rows, columns] = getColsRows(dbData);
   
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
        return { name: dataMap.get(key), type: key, width: 200 }
    return null;
}).filter(isNotNullOrUndefined);

function Preview({ label, open, handleClose }:
    { label: labelDataType | undefined, open: boolean, handleClose:()=>void }) {
    const previewURL = React.useRef<string>('');

    const id = open ? 'simple-popover' : undefined;

    if (label !== undefined) {
        //to do Get width and height of A4 page, signsInPage from PDF class
        let width = 720;
        let height = 920;
        let signsInPage = 8;
        var sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus });
        sign.setId(label._id);
        previewURL.current = sign.generate().toDataURL('image/jpeg');
    }
    const classes = useStyles();
    const eventHandler = (e: DraggableEvent, data: DraggableData) => e.preventDefault();
    return (
        <Draggable handle=".handle" onDrag={(e, data) => eventHandler(e, data)}><Popover
            id={id}
            open={open}
            onClose={handleClose }
            anchorReference={"none"}
            classes={{
                root: classes.popoverRoot,
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}>

            <img className="handle" src={previewURL.current} width='100%' height='100%' alt="Label Preview"></img>
        </Popover></Draggable>

    );
}
const useStyles = makeStyles((theme:Theme) => ({
    popoverRoot: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 100,
        scale:0.8
    },
}));