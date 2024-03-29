import { Box, Button, Grid, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridEditInputCell, GridPreProcessEditCellProps, GridRenderEditCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { isNotNullOrUndefined } from '../tools/helpers';
import { addSelectedLabel, updateSelectedLabel, loadCatalog, newCatalog } from './CatalogDB';
import { IloadedCatalog, isLoadedCatalog } from './Interfaces/CatalogDB';
import { createCatalogDB, getCatalogs, updateCatalogDB } from './CatalogsDB';
import { formatDate } from '../tools/helpers';
import { debounce } from 'lodash';

// TODO: to save in db and fetch it
const dataMap = new Map();
dataMap.set('bg', 'Bulgarian');
dataMap.set('en', 'English');
dataMap.set('de', 'Deutsch');
dataMap.set('rus', 'Russian');
dataMap.set('allergens', 'Allergens');
dataMap.set('count', 'Count');
 

const getRows = (data: any[]) => {
   return data.map(el => {
        el.id = structuredClone(el._id); el.actions = {}; return el;
    })
};
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
            if (updatedCatalog._id === '1')
            await createCatalogDB(updatedCatalog);
            else
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
        if (!isLoadedCatalog(catalog) || catalog.labels.length === 0) return [[], []];
        const row = getRows(catalog.labels);
        const colUnfilteredData = dataColUnfiltered(keys(row));
        const cols = col(colUnfilteredData);
        return [row, [...cols]];

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

const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    No Labels Loaded
</Stack>);
function DataTable({ rows, columns, catalog, updateCatalog, saveCatalog }: { rows: any, columns: any, catalog: IloadedCatalog, updateCatalog: (catalog: IloadedCatalog) => void, saveCatalog: () => void }) {

    return (
        <Grid container>
           <InfoBar catalog={catalog} updateCatalog={updateCatalog} saveCatalog={saveCatalog} />
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
                Grid</Grid>
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