import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslswg/policyGroupUpdateStatus';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function PolicyGroupUpdateStatusTable() {
  const { columns, deleteList } = useSelector((state) => state.swgPolicyGroupUpdateStatus);

  const dispatch = useDispatch();

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        // const original = props.row.original;
        const value = props.value;

        switch (column.accessor) {
          case 'level':
            return <>{value === 1 ? '개별' : '그룹'}</>;
          case 'type': {
            const typeMap = new Map([
              ['site', '사이트 > 도메인'],
              ['url', '사이트 > URL'],
              ['regexpheader', '패턴 > HEADER'],
              ['regexppayload', '패턴 > PAYLOAD'],
              ['regexpurl', '패턴 > URL'],
              ['srcip', '출발지IP'],
            ]);

            return <>{typeMap.has(value) ? typeMap.get(value) : 'unknown'}</>;
          }
          case 'name':
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
        name="swgPolicyGroupUpdateStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
    </GridItem>
  );
}

export default PolicyGroupUpdateStatusTable;
