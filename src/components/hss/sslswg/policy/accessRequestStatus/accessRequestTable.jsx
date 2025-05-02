import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setCheckList } from '@modules/redux/reducers/hss/sslswg/accessRequestStatus';
import { Link } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import AccessRequestModal from '@components/modal/hss/sslswg/policy/accessRequestModal';

function AccessRequestTable(props) {
  const { tableName } = props;
  const { columns, checkList } = useSelector((state) => state.accessRequestStatus[tableName] || {});

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const formatUnixToDatetime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const getAccessStatusText = (value) => {
    switch (value) {
      case 0:
        return '대기';
      case 1:
        return '허용';
      case 2:
        return '반려';
      default:
        return '-';
    }
  };

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const { value } = props;

        switch (column.accessor) {
          case 'name':
            return reunderCodeTypeNameCell(value, original.id);
          case 'registerDate':
          case 'accessDate':
            return formatUnixToDatetime(value);
          case 'inUsed':
            return getAccessStatusText(value);
        }

        return <>{value}</>;
      },
    }));

  const handleUpdateColumnClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };

  const handleChangeChecked = (value) => {
    dispatch(setCheckList({ tab: tableName, checkList: value }));
  };

  const reunderCodeTypeNameCell = (value, id) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => handleUpdateColumnClick('update', id)}
      >
        {value}
      </Link>
    );
  };

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
        name="accessRequestStatus"
        customColumn={makeColumns()}
        checkList={checkList}
        onChangeChecked={handleChangeChecked}
        tab={tableName}
      />

      {modalOpen && (
        <AccessRequestModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default AccessRequestTable;
