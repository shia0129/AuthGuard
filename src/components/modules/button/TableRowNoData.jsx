import { Grid, TableCell, TableRow } from '@mui/material';

export const TableRowNoData = ({ colSpan, message }) => {
  return (
    <TableRow className="CMM-rt-tableArea-tableBody-tableRow">
      <TableCell
        colSpan={colSpan}
        sx={{ border: '0 !important' }}
        className="CMM-rt-tableArea-tableBody-tableRow-tableCell"
      >
        <Grid
          container
          item
          justifyContent="center"
          my={3}
          className="CMM-rt-tableArea-tableBody-tableRow-tableCell-grid"
        >
          {message}
        </Grid>
      </TableCell>
    </TableRow>
  );
};
