import { Box, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridEditInputCell, GridPreProcessEditCellProps, GridRenderEditCellParams, GridToolbar } from '@mui/x-data-grid';
import { isNotNullOrUndefined } from '../../../tools/helpers';
import { IaddedLabel } from '../../Content';

// to save in db and fetch it
const dataMap = new Map();
dataMap.set('bg', 'Bulgarian');
dataMap.set('en', 'English');
dataMap.set('de', 'Deutsch');
dataMap.set('rus', 'Russian');
dataMap.set('allergens', 'Allergens');
dataMap.set('count', 'Count');


const getRows = (data: any[]) => data.map(el => {
    el.id = structuredClone(el._id); el.actions = {}; return el;
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
export default function DataTableStates({ labels, updateLabel }:
    { labels: IaddedLabel[], updateLabel: (arg: IaddedLabel) => void }) {

    const getColsRows = (data: any): [rows: any, columns: any] => {
        if (data === undefined || data.length === 0) return [[], []];
        const row = getRows(data);
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
                            updateLabel(lbl);
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

    const [rows, columns] = getColsRows(labels);

    return (
            <DataTable rows={rows} columns={columns} />
    )
}

const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    No Labels Loaded
</Stack>);
function DataTable({ rows, columns  }: { rows: any, columns: any}) {

    return (
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
    );
}