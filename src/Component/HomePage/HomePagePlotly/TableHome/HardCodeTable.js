import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'id', label: 'Voyage ID', minWidth: 170 },
  { id: 'name', label: 'Vessel name', minWidth: 100 },
  {
    id: 'place',
    label: 'Principal place of purchase',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'year',
    label: 'Year arrived of enslaved people',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
 
];

function createData(id, name, place, year) {
  return { id, name, place, year };
}

const rows = [
  createData(11254, 'Kat', 'Accra', 1643),
  createData(110409, 'Wilhelmina Margaretta van Steeman', 'Accra', 1798),
  createData(11410, 'Mercurius', 'Accra', 1799),
  createData(124, 'Minerva', 'Accra', 1821),
  createData(900236, 'Rio Tâmega', 'Benguela', 1851),
  createData(900235, 'Havana', 'Benguela', 1851),
  createData(900234, 'Duas Clementinas', 'Benguela', 1850),
  createData(900233, 'General Rêgo', 'Benguela', 1849),
  createData(900232, 'Tourville	Rio de Janeiro', 'West Central Africa and St. Helena, port unspecified', 1848),
  createData(900231, 'NS do Rosario', 'Benguela', 1848),
  createData(900230, 'Indiano', 'Benguela', 1848),
  createData(900229, 'General Rêgo', 'West Central Africa and St. Helena, port unspecified', 1848),
  createData(900228, 'Brazil', 'West Central Africa and St. Helena, port unspecified', 1848),
  
];

export default function HardCodeTableHome() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
