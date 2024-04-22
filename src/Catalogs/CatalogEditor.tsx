import { Autocomplete, Box, Button, Grid, Input, InputLabel, Stack, TextField, Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridEditInputCell, GridPreProcessEditCellProps, GridRenderEditCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { isNotNullOrUndefined } from '../tools/helpers';
import { updateSelectedLabel, saveSelectedCatalog, deleteSelectedLabels } from '../DB/SessionStorage/Catalogs';
import { IloadedCatalog, isLoadedCatalog } from '../DB/Interfaces/Catalogs';
import { createCatalogDB, updateCatalogDB } from '../DB/Remote/Catalogs';
import { formatDate } from '../tools/helpers';
import { debounce } from 'lodash';
import { getLabels, getLocalLabelById } from '../DB/LocalStorage/Labels';
import DeleteIcon from '@mui/icons-material/Delete';
import { labelDataType } from '../DB/Interfaces/Labels';

// TODO: to save in db and fetch it
const dataMap = new Map();
dataMap.set('bg', 'Bulgarian');
dataMap.set('en', 'English');
dataMap.set('de', 'Deutsch');
dataMap.set('rus', 'Russian');
dataMap.set('allergens', 'Allergens');
dataMap.set('count', 'Count');
dataMap.set('actions', 'Actions');
 
/*
const getRows = (data: any[]) => {
    return data.map(el => {
        const translationObject = Object.fromEntries(
            el.translations.map((translation, element) => [el.translations[element].lang, el.translations[element].name])
        );
       el.id = structuredClone(el._id);
       el.actions = {
           name: 'Actions',
           type: 'actions',
           width: 100
       };
       return el;
    })
};*/
const getRows = (data: labelDataType[]) => data.map(el => {
    // Modify the object to include the translations as rows
    const translationObject = Object.fromEntries(
        el.translations.map((translation, element) => [el.translations[element].lang, el.translations[element].name])
    );
    return { ...el, id: el._id, ...translationObject, actions: { name: 'Actions', type: 'actions', width: 50 } };
});
const keys = (rows: any[]) => Object.keys(rows[0]);
const dataColUnfiltered = (keys: string[]) => keys.map((key) => {
    if (dataMap.get(key))
        return { name: dataMap.get(key), type: key, width: 150 }
    return null;
}).filter(isNotNullOrUndefined);



function NameEditInputCell(props: GridRenderEditCellParams) {
    const { error } = props;

    return (
        <Tooltip open={!!error} title={error}>
            <GridEditInputCell {...props} />
        </Tooltip>
    );
}

function renderEditName(params: GridRenderEditCellParams) {
    return <NameEditInputCell {...params} />;
}

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
            if (updatedCatalog._id === '1') {
                const newCatalog = await createCatalogDB(updatedCatalog);
                if(isLoadedCatalog(newCatalog)) setCatalog(newCatalog);
            }
            else
            // Otherwise, update the existing catalog
            await updateCatalogDB(updatedCatalog);
        } catch (e) {
            console.error(e);
        }
    }
    const handleCountChange = (newValue: number, rowId: string) => {
        // Update the count value in the catalog.labels array
        const updatedLabels = catalog.labels.map((label: any) => {
            if (label.id === rowId) {
                return { ...label, count: newValue };
            }
            return label;
        });
        updateCatalog({ ...catalog, labels: updatedLabels });
    };
    const getColsRows = (catalog: IloadedCatalog): [rows: any, columns: any] => {
        // If the catalog is not loaded or there are no labels, return empty arrays
        if (!isLoadedCatalog(catalog) || catalog.labels.length === 0) return [[], []];
        // Otherwise, return the rows and columns
        const row = getRows(catalog.labels);
        const colUnfilteredData = dataColUnfiltered(keys(row));
        const cols = col(colUnfilteredData);
        //console.log(cols);
        return [row, [...cols]];

    }
    const handleDeleteLabel = (row: any) => () => {
        //remove the label from the catalog and setCatalog state
        const newLabels = catalog.labels.filter((label: any) => label.id !== row.id);
        const updatedCatalog = { ...catalog, size: catalog.size - 1, labels: newLabels };
        updateCatalog(updatedCatalog);
        const label = getLocalLabelById(row.id);
        if (label) {
            deleteSelectedLabels([label]);
            saveSelectedCatalog(updatedCatalog);
        }
        }
    const col = (dataColUnfiltered: { name: any, type: string, width: number }[]) => dataColUnfiltered.map(element => {
        if (element !== null) {
            if (element.type === 'allergens') {
                return { field: element.type, headerName: element.name, width: 120, sortable: false, filterable: false };
            } else if (element.type === 'count') {
                return {
                    field: element.type, headerName: element.name, type: 'number', width: 80, max: 20, min: 1, editable: true, sortable: false, filterable: false,
                    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                        const hasError = params.props.value < 1 || params.props.value > 25 ? "The count must be > 0 and < 25" : null;
                        if (!hasError) {
                            const lbl = { ...params.row };
                            lbl.count = params.props.value;
                            updateSelectedLabel(lbl);
                            handleCountChange(params.props.value, lbl.id);
                        }
                        return { ...params.props, error: hasError };
                    },
                    renderEditCell: renderEditName,
                    hideable:false
                };
            } else if (element.type === 'actions') {
                return {
                    field: 'actions', headerName: 'Delete', sortable: false, type: "actions",
                    getActions: (params: any) => [
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            onClick={handleDeleteLabel(params.row)}
                            label="Delete"
                            showInMenu={false}
                        />
                    ]
                };
            } else {
                return { field: element.type, headerName: element.name, width: element.width }
            }
        }
        else {
            return null;
        };
    }).filter(isNotNullOrUndefined);

    const [rows, columns] = getColsRows(catalog);
   
    return (
        <DataTable rows={rows} columns={columns} catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
    )
}
const SearchBar = ({ addLabel }: { addLabel: (label: any) => void }) => {
    const labels = getLabels();

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={labels}
            getOptionLabel={(option) => {
                const opt = option.translations.find(el => el.lang === 'bg');
                return opt ? opt.name : '';
            } // Display 'bg' attribute in autocomplete
            }
            renderInput={(params) => <TextField {...params} label="Insert Label" />}
            onChange={(event, value) => {
                addLabel(value); // This will be the selected object containing both 'bg' and '_id'
                // Do something with selected value, like updating state
            }}
        />
    );
};
const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    No Labels Loaded
</Stack>);
function DataTable({ rows, columns, catalog, updateCatalog, saveCatalog }: { rows: any, columns: any, catalog: IloadedCatalog, updateCatalog: (catalog: IloadedCatalog) => void, saveCatalog: () => void }) {
    const addLabel = (label: any) => {
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
            //save the updated catalog to local storage
            saveSelectedCatalog(structuredClone({ ...catalog, size: catalog.size + 1, labels: newLabels }));
            //update the catalog in the state
            updateCatalog(({ ...catalog, size: catalog.size + 1, labels: newLabels }));
        }
        //else add label to selected catalog
        else {
            const newCatalog = {
                ...catalog, labels: [...catalog.labels, { ...label, count: 1 }]
            };
            newCatalog.volume += 1;
            newCatalog.size += 1;
            if (isLoadedCatalog(newCatalog)) {
                //save the updated catalog to local storage
                saveSelectedCatalog(newCatalog);
                //update the catalog in the state
                updateCatalog(newCatalog);
            }
        }
    }
    return (
        <Grid container>
            <Grid item xs={12 } >
                <InfoBar catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
            </Grid>
            <Grid item xs={12} >
                <SearchBar addLabel = {addLabel} />
            </Grid>
        <Box height={1} sx={{
            position: 'relative',
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
        </Grid>
    );
}

const InfoBar = ({ catalog, updateCatalog, saveCatalog }: { catalog: IloadedCatalog, updateCatalog: (catalog: IloadedCatalog) => void, saveCatalog: () => void }) => {
    const [name, setName] = useState(catalog.name);

   // Debounce the handleNameChange function
    const handleNameChange = debounce((newValue: string) => {
        updateCatalog({ ...catalog, name: newValue });
    }, 1000);

    return (
        <Grid container spacing={1} style={{ maxWidth: '100%', height: '100%' }}>
            <Grid item>
                <InputLabel>Catalog Name</InputLabel>
                <Input type='text' placeholder='Catalog Name' size='medium' value={name}
                    onChange={(e) => { setName(e.target.value); handleNameChange(e.target.value) }} />
                </Grid>
            <Grid item>
                <InputLabel>Created At</InputLabel>
                <Input value={formatDate(catalog.date)} disabled />
            </Grid>
            <Grid item>
                <InputLabel>Size</InputLabel>
                <Input value={catalog.size} disabled />
            </Grid>
            <Grid item>
                <Button variant='contained' color='primary'
                    onClick={saveCatalog}>
                    Save
                </Button>
            </Grid>
        </Grid>
    );
}