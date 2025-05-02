import { DataGrid } from '@mui/x-data-grid';

function GridTable({ rows, columns, border = false, ...others }) {
  return (
    <DataGrid
      autoHeight
      disableColumnMenu
      sx={{
        boxShadow: border ? 0 : 2,
        border: 1,
        borderColor: border ? '#fff' : 'primary.light',

        '& .MuiDataGrid-columnHeaders, .MuiDataGrid-cell': {
          borderBottom: '1px solid rgb(224, 224, 224)',
          fontSize: '0.875rem',
        },
        '& .MuiDataGrid-columnSeparator': {
          color: 'rgb(224, 224, 224)',
        },
        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator': {
          display: 'none',
        },
        '&': {
          background: '#fff',
        },
      }}
      columns={columns}
      rows={rows}
      {...others}
    />
  );
}

export default GridTable;
