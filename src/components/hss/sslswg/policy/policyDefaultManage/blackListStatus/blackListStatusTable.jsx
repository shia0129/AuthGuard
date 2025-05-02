import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setCheckList } from '@modules/redux/reducers/hss/sslswg/blackListStatus';
import { Link } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
// import BlackListReasonChoiceModal from '@components/modal/hss/sslswg/policy/blackListReasonChoiceModal';

function BlackListStatusTable() {
  const { columns, checkList } = useSelector((state) => state.blackListStatus);

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
          // case 'value':
          //   return reunderCodeTypeNameCell(value, original.id);
          case 'type': {
            const getLabel = (value) => {
              switch (value) {
                case 'site':
                  return '도메인';
                case 'url':
                  return 'URL';
                default:
                  return '';
              }
            };
            return <>{getLabel(value)}</>;
          }
          case 'enabled':
            return <>{value === 1 ? '활성화' : '비활성화'}</>;
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
        name="blackListStatus"
        customColumn={makeColumns()}
        checkList={checkList}
        onChangeChecked={handleChangeChecked}
      />
      {/* {modalOpen && (
        <BlackListReasonChoiceModal
          open={modalOpen}
          close={setModalOpen}
          modalParams={modalParams}
        />
      )} */}
    </GridItem>
  );
}

export default BlackListStatusTable;
