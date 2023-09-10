import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const dataCol = [
    { name: 'Bulgarian', type: 'bg', width: 250 },
    { name: 'English', type: 'en', width: 250 },
    { name: 'Deutsch', type: 'de', width: 250 },
    { name: 'Russian', type: 'rus', width: 250 },
    { name: 'Allergens', type: 'allergens', width: 250 }
];
const col = dataCol.map(element => {
    return { field: element.type, headerName: element.name, width: element.width }
});
const columns: GridColDef[] =  [
    
       ...col,
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        }
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataTable() {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={newData}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
}

const data = [
    { _id: "64a48ea2cc625d18c094b452", bg: ' Мляко с ориз', en: "Milk with rice", de: "Milch mit Reis", rus: "Молоко с риссом", allergens: [8]},
    { _id: "64a824b0223efefb69bca6ed", bg: "Риба в палачинка", en: "Fish meat in pancake", de: "Fischfleisch im Pfannkuchen", rus: "Мясо рыбы в блинчиках", allergens: [1, 6, 8, 12]},
];
//@ts-ignore
const newData = data.map(el => { el.id = el._id; delete el._id; return el; })