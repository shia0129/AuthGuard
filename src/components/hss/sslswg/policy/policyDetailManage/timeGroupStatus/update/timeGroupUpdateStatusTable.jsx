import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslswg/time/timeGroupUpdateStatus';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function TimeGroupUpdateStatusTable() {
  const { columns, deleteList } = useSelector((state) => state.timeGroupUpdateStatus);

  const dispatch = useDispatch();

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
        // const original = props.row.original;
        const value = props.value;

        switch (column.accessor) {
          case 'action':
            return <>{value === 1 ? '허용' : '차단'}</>;
          case 'days': {
            const days = formatDays(value);
            return <>{days}</>;
          }
          case 'name':
          case 'startTime':
          case 'endTime':
          default:
            return <>{value}</>;
        }
      },
    }));

  const handleChangeChecked = (value) => {
    dispatch(setDeleteList(value));
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
        name="timeGroupUpdateStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
    </GridItem>
  );
}

export default TimeGroupUpdateStatusTable;
