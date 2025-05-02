import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslswg/time/timeGroupStatus';
import { Link } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import TimeGroupStatusModal from '@components/modal/hss/sslswg/policy/timeGroupStatusModal';
import { useRouter } from 'next/router';

function TimeGroupStatusTable(props) {
  const { getTimeGroupStatusList } = props;

  const { columns, deleteList } = useSelector((state) => state.timeGroupStatus);

  const dispatch = useDispatch();
  const router = useRouter();

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

  const handleUpdateColumnClick = (id) => {
    router.push({
      pathname: `/hss/sslswgManage/policyDetailManage/timeManage/update`,
      query: {
        id,
      },
    });
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
        onClick={() => handleUpdateColumnClick(id)}
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
            height: 'unset', // 높이 자동 조절!
          },
          '.CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
            lineHeight: '35px',
          },
        }}
        name="timeGroupStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />

      {modalOpen && (
        <TimeGroupStatusModal
          getTimeGroupStatusList={getTimeGroupStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      )}
    </GridItem>
  );
}

export default TimeGroupStatusTable;
