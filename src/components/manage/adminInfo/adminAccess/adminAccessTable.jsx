import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import { Typography } from '@mui/material';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

function AdminAccessTable() {
  const { columns } = useSelector((state) => state.adminAccess);

  const makeColumns = () =>
    columns.map((column) => {
      switch (column.accessor) {
        case 'accResultNm':
          return {
            ...column,
            Cell: (props) => {
              return renderAccessResultCell(props);
            },
          };

        default:
          break;
      }
      return column;
    });

  const renderAccessResultCell = useCallback(
    ({ value }) => (
      <Typography sx={{ color: value === '실패' ? 'red' : 'blue', fontWeight: 'bold' }}>
        {value}
      </Typography>
    ),
    [],
  );
  return (
    <GridItem item>
      <HsReduxTable name="adminAccess" customColumn={makeColumns()} />
    </GridItem>
  );
}

export default AdminAccessTable;
