import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setCheckList } from '@modules/redux/reducers/hss/sslswg/blackListGroupStatus';
import { Link } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import { useRouter } from 'next/router';

function BlackListGroupStatusTable() {
  const { columns, checkList } = useSelector((state) => state.blackListGroupStatus);

  const dispatch = useDispatch();
  const router = useRouter();

  if (!columns?.length) return <></>;

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const value = props.value;
        switch (column.accessor) {
          case 'name':
            return reunderCodeTypeNameCell(value, original.id);
          case 'enabled':
            return <>{value === 1 ? '활성화' : '비활성화'}</>;
          default:
            return <>{value}</>;
        }
      },
    }));

  const handleUpdateColumnClick = (id) => {
    router.push({
      pathname: `/hss/sslswgManage/policyDefaultManage/blackListManage/update`,
      query: {
        id,
      },
    });
  };

  const handleChangeChecked = (value) => {
    dispatch(setCheckList(value));
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
        name="blackListGroupStatus"
        customColumn={makeColumns()}
        checkList={checkList}
        onChangeChecked={handleChangeChecked}
      />
    </GridItem>
  );
}

export default BlackListGroupStatusTable;
