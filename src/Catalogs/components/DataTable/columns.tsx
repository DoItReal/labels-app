// components/DataTable/columns.tsx
import { GridRenderEditCellParams, GridEditInputCell, GridPreProcessEditCellProps, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { isNotNullOrUndefined } from '../../../tools/helpers';
import { updateSelectedLabel } from '../../../DB/SessionStorage/Catalogs';
import React from 'react';
import { Stack, Tooltip } from '@mui/material';
import { keys } from './catalogUtils';
import { IloadedCatalog, isLoadedCatalog } from '../../../DB/Interfaces/Catalogs';
import { getRows, dataColUnfiltered } from './catalogUtils';

export const MyCustomNoRowsOverlay = () => (<Stack height="100%" alignItems="center" justifyContent="center">
    Empty Catalog
</Stack>);
export function NameEditInputCell(props: GridRenderEditCellParams) {
    const { error } = props;
    return (
        <Tooltip open={!!error} title={error}>
            <GridEditInputCell {...props} />
        </Tooltip>
    );
}

export function renderEditName(params: GridRenderEditCellParams) {
    return <NameEditInputCell {...params} />;
}

// It doesnt update count TO FIX !!
export const getColumnDefs = (
    rawCols: { name: any, type: string, width: number }[],
    handleDeleteLabel?: (row: any) => () => void,
    handleCountChange?: (newValue: number, rowId: string) => void,
    options: { includeActions?: boolean } = {}
) =>
    rawCols.map(element => {
        if (!element) return null;
        const { type, name, width } = element;

        if (type === 'allergens') {
            return { field: type, headerName: name, width: 120, sortable: false, filterable: false };
        } else if (type === 'count' && handleCountChange) {
            return {
                field: type,
                headerName: name,
                type: 'number',
                width: 80,
                editable: true,
                sortable: false,
                filterable: false,
                preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                    const hasError = params.props.value < 1 || params.props.value > 25 ? 'The count must be > 0 and < 25' : null;
                    if (!hasError) {
                        const lbl = { ...params.row, count: params.props.value };
                        updateSelectedLabel(lbl);
                        handleCountChange(params.props.value, lbl.id);
                    }
                    return { ...params.props, error: hasError };
                },
                renderEditCell: renderEditName,
                hideable: false
            };
        } else if (type === 'actions' && options.includeActions !== false) {
            return {
                field: 'actions',
                headerName: 'Delete',
                sortable: false,
                type: 'actions',
                getActions: (params: any) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        onClick={handleDeleteLabel?.(params.row)}
                        label="Delete"
                        showInMenu={false}
                    />
                ]
            };
        } else if (type !== 'actions') {
            return { field: type, headerName: name, width };
        }

        return null;
    }).filter(isNotNullOrUndefined);

export const handleCountChangeFactory = (
    catalog: IloadedCatalog,
    updateCatalog: (catalog: IloadedCatalog) => void
) => (newValue: number, rowId: string) => {
    const updatedLabels = catalog.labels.map((label) =>
        label._id === rowId ? { ...label, count: newValue } : label
    );
    updateCatalog({ ...catalog, labels: updatedLabels });
};

export const getColsRows = (catalog: IloadedCatalog, handleCountChange:(newValue:number,rowId:string)=>void, handleDeleteLabel?: (row: any) => () => void, options: { includeActions?: boolean } = { includeActions: false }, ): [rows: any, columns: any] => {
    // If the catalog is not loaded or there are no labels, return empty arrays
    if (!isLoadedCatalog(catalog) || catalog.labels.length === 0) return [[], []];
    // Otherwise, return the rows and columns
    if (!options.includeActions) {
        const row = getRows(catalog.labels);
        const colUnfilteredData = dataColUnfiltered(keys(row));
        const cols = getColumnDefs(colUnfilteredData, undefined, handleCountChange, options);
        return [row, [...cols]];
    } else {
        const row = getRows(catalog.labels, true);
        const colsRaw = dataColUnfiltered(keys(row));
        const cols = getColumnDefs(colsRaw, handleDeleteLabel, handleCountChange, options);
        return [row, [...cols]];
    }

}