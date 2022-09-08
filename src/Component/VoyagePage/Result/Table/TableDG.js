// import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { VoyageContext } from "../../VoyageApp";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

const option_url = "/voyage/" + "?hierarchical=false"; // labels in dropdowns
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;


function TableDG() {
    const { search_object, options_flat } = useContext(VoyageContext);
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])

    const [selectedFields, setSelectedFields] = useState([
        "id",
        "voyage_itinerary",
        "voyage_slaves_numbers__imp_total_num_slaves_embarked",
        "voyage_itinerary__first_landing_region__geo_location__name",
        "voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name",
      ])
    
      
    const ParseColumns = (columns) => {
        var newColumns = [];
        var len = selectedFields.length;
        for (let i=0; i<len;i++) {
            let colName = selectedFields[i]
            let col = {field: colName, headerName: options_flat[colName].flatlabel, editable: true, width: 250}
            // let col = {field: colName, headerName: "kkk", editable: true,}
            newColumns.push(col)
        }
        setColumns(newColumns)
        // console.log(columns)
    }

    useEffect(() => {
        var data = new FormData();
        data.append("hierarchical", "False");
        
        for (var property in search_object) {
          search_object[property].forEach((v) => {
            data.append(property, v);
          });
        }
        

        selectedFields.forEach((v) => {
            console.log(v)
            data.append("selected_fields", v);
            
        });  
        // data.append("results_page", page)
        // console.log(data.values())
        
        axios
          .post("/voyage/", (data = data))
          .then(function (response) {
            setRows(Object.values(response.data));
            // console.log(rows)
            ParseColumns()
            console.log('columns', columns) 
            console.log('rows', rows)
          })
          .catch(function (error) {
            console.log(error);
          });
      }, []);






    return (
        <div style={{ height: 400, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                <DataGrid
                rows={rows}
                rowCount={10000}
                loading={false}
                pagination
                pageSize={10}
                paginationMode="server"
                onPageChange={(newPage) => {}}
                columns={columns}
              />
                {/* <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    onPageChange={()=>{}}
                    disableSelectionOnClick 
                /> */}
                </div>
            </div>
        </div>
      );
}

export default TableDG;

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'firstName',
//     headerName: 'First name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'lastName',
//     headerName: 'Last name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 110,
//     editable: true,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params) =>
//       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// export default function DataGridDemo() {
//   return (
//     <Box sx={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSize={5}
//         rowsPerPageOptions={[5]}
//         checkboxSelection
//         disableSelectionOnClick
//       />
//     </Box>
//   );
// }

