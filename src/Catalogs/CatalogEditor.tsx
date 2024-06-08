import { Autocomplete, Badge, Box, Button, IconButton, Input, InputLabel, Stack, TextField, Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridEditInputCell, GridPreProcessEditCellProps, GridRenderEditCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { isNotNullOrUndefined } from '../tools/helpers';
import { updateSelectedLabel, saveSelectedCatalog, deleteSelectedLabels, loadedCatalogToCatalog, editCatalogLocally } from '../DB/SessionStorage/Catalogs';
import { IloadedCatalog, isLoadedCatalog } from '../DB/Interfaces/Catalogs';
import { saveSelectedCatalog as saveTempCatalog } from '../DB/SessionStorage/TempCatalogs';
import { createCatalogDB, updateCatalogDB } from '../DB/Remote/Catalogs';
import { formatDate } from '../tools/helpers';
import { debounce } from 'lodash';
import Grid from '@mui/material/Unstable_Grid2';
import { getLabels, getLocalLabelById } from '../DB/LocalStorage/Labels';
import DeleteIcon from '@mui/icons-material/Delete';
import { labelDataType } from '../DB/Interfaces/Labels';
import SendIcon from '@mui/icons-material/Send';

// TODO: to save in db and fetch it
const dataMap = new Map();
dataMap.set('bg', 'Bulgarian');
dataMap.set('en', 'English');
dataMap.set('de', 'Deutsch');
dataMap.set('ru', 'Russian');
dataMap.set('allergens', 'Allergens');
dataMap.set('count', 'Count');
dataMap.set('actions', 'Actions');
 

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
    const handleCountChange = (newValue: number, rowId: string) => {
        // Update the count value in the catalog.labels array
        const updatedLabels = catalog.labels.map((label: any) => {
            if (label._id === rowId) {
                return { ...label, count: newValue };
            }
            return label;
        });
        console.log(updatedLabels)
        updateCatalog({ ...catalog, labels: [...updatedLabels] });
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
        const newLabels = catalog.labels.filter((label: any) => label._id !== row._id);
        const updatedCatalog = { ...catalog, size: catalog.size - 1, labels: newLabels };
        updateCatalog(updatedCatalog);
        const label = getLocalLabelById(row._id);
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
        <Box sx={{overflow:'auto', maxHeight:'100%'} }>
            <DataTable rows={rows} columns={columns} catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
        </Box>
    )
}
export const SearchBar = ({ addLabels }: { addLabels: (label: any) => void }) => {
    const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
    const labels = getLabels();

    const handleAddLabels = (labelsArr: any[]) => {
       // const updatedSelectedLabels = [...selectedLabels];
        if (selectedLabels.length === 0) {
            setSelectedLabels(labelsArr);
            return;
        }
        const labelCountMap = new Map<string, number>(); // Map to store label counts

        labelsArr.forEach(label => {
            const labelId = label._id;
            labelCountMap.set(labelId, (labelCountMap.get(labelId) || 0) + 1);
        });

        const updatedSelectedLabels = labelsArr.filter((label) => {
            const labelId = label._id;
            const labelCount = labelCountMap.get(labelId) || 0;

            if (labelCount >= 1) {
                let count = labelCount % 2 === 0 ? 0 : 1;
                labelCountMap.set(labelId, count); // Decrease count by 1
                return labelCount % 2 === 0 ? false : true; // Keep label in selectedLabels
            }

            return false; // Remove label from selectedLabels
        });
        
        setSelectedLabels(updatedSelectedLabels);  
    };
    const handleSubmit = () => {
        addLabels(selectedLabels);
    }
    return (
        <Grid container sx={{ width: '100%', display:'flex', flexDirection:'center', flex:'center' }}>
            <Grid xs={6} >
            <Box>
        <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={labels}
                    limitTags={5}
                    disableCloseOnSelect
                    getOptionLabel={(option) => {
                        const opt = option.translations.find((el: any) => el.lang === 'bg');
                        return opt ? opt.name : '';
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Label/s" />}
                    value={selectedLabels}
                    onChange={(event, value) => handleAddLabels(value)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} style={{
                            backgroundColor: selectedLabels.some(label => label._id === option._id) ? 'lightblue' : 'inherit',
                            border: selectedLabels.some(label => label._id === option._id) ? '1px dotted black' : 'inherit',
                        }}>
                                {option.translations.find((el: any) => el.lang === 'bg')?.name}
                        </li>
                    )}
                    />
                </Box>
            </Grid>
            <Grid xs={1}>
            <Box>
                <IconButton onClick={handleSubmit }>
                <Badge badgeContent={selectedLabels.length} color="primary">
                    <SendIcon />
                </Badge>
                    </IconButton>
                </Box>
            </Grid>
      </Grid>
    );
};

const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    No Labels Loaded
</Stack>);
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
        <Grid container >
            <Grid xs={6} sm={8} md={10} lg={12} xl={12 }>
                <InfoBar catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
            </Grid>
            <Grid xs={12} sm={12} md={12} lg={12} xl={12 } >
                <SearchBar addLabels = {addLabels} />
            </Grid>
            <Grid xs={6} sm={8} md={10} lg={12} xl={12} >
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
                    width: 1
                }}
                slots={{
                    noRowsOverlay: MyCustomNoRowsOverlay,
                    toolbar: GridToolbar
                }}
            />
                </Box>
            </Grid>
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
        <Grid container spacing={1} style={{marginTop:5, minWidth: '100%', height: '100%' }}>
            <Grid>
                <InputLabel>Catalog Name</InputLabel>
                <Input type='text' placeholder='Catalog Name' size='medium' value={name}
                    onChange={(e) => { setName(e.target.value); handleNameChange(e.target.value) }} />
                </Grid>
            <Grid>
                <InputLabel>Created At</InputLabel>
                <Input value={formatDate(catalog.date)} disabled />
            </Grid>
            <Grid>
                <InputLabel>Size</InputLabel>
                <Input value={catalog.size} disabled />
            </Grid>
            <Grid>
                <Button variant='contained' color='primary'
                    onClick={saveCatalog}>
                    Save
                </Button>
            </Grid>
        </Grid>
    );
}