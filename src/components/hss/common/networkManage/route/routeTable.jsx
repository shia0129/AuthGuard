import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/common/route';
import { Link } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import RouteModal from '@components/modal/hss/common/networkManage/routeModal';

function RouteTable(props) {
  const { getRouteList } = props;

  const { columns, deleteList } = useSelector((state) => state.route);

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const makeColumns = () => {
    if (!columns.length) {
      return [];
    }
    return columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const value = props.value;

        switch (column.accessor) {
          case 'name':
            return reunderCodeTypeNameCell(value, original.name);
          case 'type':
            return <>{capitalize(value)}</>;
          case 'isDefault':
            return <>{value === '1' ? '사용' : '-'}</>;
          case 'target':
          case 'netmask':
          case 'gateway':
            return <>{value.length !== 0 ? value : '-'}</>;
          default:
            return <>{value}</>;
        }
      },
    }));
  };

  const handleUpdateColumnClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };

  const handleChangeChecked = (value) => {
    console.log(value);
    console.log(value);
    dispatch(setDeleteList(value));
  };

  const reunderCodeTypeNameCell = (value, name) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        // onClick={() => handleUpdateColumnClick('update', id)}
        onClick={() => handleUpdateColumnClick('update', name)} // idx(구분자)로 사용할 id가 없어서 name 사용
      >
        {value}
      </Link>
    );
  };
  const customColumns = useMemo(() => makeColumns(), [columns]);
  return (
    <GridItem item>
      <HsReduxTable
        sx={{
          '.CMM-rt-headerArea-tableHead, .CMM-rt-headerArea-tableHead tr th': {
            height: '35px !important',
            padding: '0',
          },
          '.CMM-rt-tableArea-reactRow': {
            cursor: 'pointer',
          },
          '.CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
          },
        }}
        name="route"
        customColumn={customColumns}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />

      {modalOpen && (
        <RouteModal
          getRouteList={getRouteList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default RouteTable;
