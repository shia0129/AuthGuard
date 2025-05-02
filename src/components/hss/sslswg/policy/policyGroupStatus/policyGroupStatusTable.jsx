import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslswg/policyGroupStatus';
import { Link } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import { useRouter } from 'next/router';

function PolicyGroupStatusTable() {
  const { columns, deleteList, timeNameList } = useSelector((state) => state.swgPolicyGroupStatus);

  const dispatch = useDispatch();
  const router = useRouter();

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const value = props.value;
        switch (column.accessor) {
          case 'name':
            return reunderCodeTypeNameCell(value, original.id);
          case 'timeId': {
            const getLabelById = (id, timeNameList) => {
              const foundItem = timeNameList?.find((item) => item.value === id);
              return foundItem ? foundItem.label : '-';
            };
            const label = getLabelById(value, timeNameList);
            return <>{label}</>;
          }
          case 'isBlackList':
            return <>{value === 1 ? '적용' : '-'}</>;
          case 'action':
            return <>{value === 1 ? '허용' : '차단'}</>;
          default:
            return <>{value}</>;
        }
      },
    }));

  const handleUpdateColumnClick = (id) => {
    router.push({
      pathname: `/hss/sslswgManage/policyGroupManage/update`,
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
          },
          '.CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
          },
        }}
        name="swgPolicyGroupStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
    </GridItem>
  );
}

export default PolicyGroupStatusTable;
