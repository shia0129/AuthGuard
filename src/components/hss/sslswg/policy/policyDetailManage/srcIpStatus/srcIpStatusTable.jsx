import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslswg/srcIp/srcIpStatus';
import { Link } from '@mui/material';
import SrcIpStatusModal from '@components/modal/hss/sslswg/policy/srcIpStatusModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function SrcIpStatusTable(props) {
  const { getSrcIpStatusList } = props;

  const { columns, deleteList } = useSelector((state) => state.srcIpStatus);

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const value = props.value;

        switch (column.accessor) {
          case 'name':
            return reunderCodeTypeNameCell(value, original.id);
          case 'action':
            return <>{value === 1 ? '허용' : '차단'}</>;
          default:
            return <>{value}</>;
        }
      },
    }));

  const handleUpdateColumnClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };

  const handleChangeChecked = (value) => {
    dispatch(setDeleteList(value));
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
        name="srcIpStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {modalOpen && (
        <SrcIpStatusModal
          getSrcIpStatusList={getSrcIpStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default SrcIpStatusTable;
