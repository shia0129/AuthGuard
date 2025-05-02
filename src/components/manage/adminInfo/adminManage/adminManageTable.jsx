import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import { Link } from '@mui/material';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

function AdminManageTable({ onUserNameClick }) {
  const { columns } = useSelector((state) => state.adminManage);

  const makeColumns = () =>
    columns.map((column) => {
      switch (column.accessor) {
        case 'userName':
          return {
            ...column,
            Cell: (props) => {
              return reunderUserNameCell(props);
            },
          };
        default:
          break;
      }
      return column;
    });

  const reunderUserNameCell = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
        }}
        onClick={() => onUserNameClick(original)}
      >
        {original.userName}
      </Link>
    );
  }, []);
  return (
    <GridItem item xs>
      <HsReduxTable name="adminManage" customColumn={makeColumns()} />
    </GridItem>
  );
}

export default AdminManageTable;
