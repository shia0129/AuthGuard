import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslswg/time/timeStatus';
import { Link } from '@mui/material';
import TimeStatusModal from '@components/modal/hss/sslswg/policy/timeStatusModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function TimeStatusTable(props) {
  const { getTimeStatusList } = props;

  const { columns, deleteList } = useSelector((state) => state.timeStatus);

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const formatDays = (days) => {
    const dayMapping = ['월', '화', '수', '목', '금', '토', '일'];
    // 숫자를 배열로 변환
    const dayArray = days.split(''); // "012345" -> ['0', '1', '2', '3', '4', '5']
    // 매핑된 요일 이름 가져오기
    const mappedDays = dayArray.map((day) => dayMapping[parseInt(day)]);
    // 요일 리스트 반환
    return mappedDays.join(', '); // 요일을 ", "로 구분하여 반환
  };

  // const formatTime = (value) => {
  //   const hours = value.slice(0, 2);
  //   const minutes = value.slice(2);
  //   return `${hours}:${minutes}`; // "09:00"
  // };

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
          case 'days': {
            const days = formatDays(value);
            return <>{days}</>;
          }
          case 'startTime':
          case 'endTime':
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
        name="timeStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {modalOpen && (
        <TimeStatusModal
          getTimeStatusList={getTimeStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default TimeStatusTable;
