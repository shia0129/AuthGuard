import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslva/policyGroupStatus';
import { Link } from '@mui/material';
import PolicyGroupStatusModal from '@components/modal/hss/sslva/policy/policyGroupStatusModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import ListComponent from '@components/hss/makeColumn/listComponent';

function PolicyGroupStatusTable(props) {
  const { getPolicyGroupStatusList } = props;

  const { columns, deleteList, detailList } =
    useSelector((state) => state.vaPolicyGroupStatus) ?? {};

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [allColumns, setAllColumns] = useState([]);

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const value = props.value;

        switch (column.accessor) {
          case 'name':
            return reunderCodeTypeNameCell(value, original.id);
          case 'detailIdList':
            return <ListComponent data={value} list={detailList} />;
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

  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    const all = makeColumns();
    setAllColumns(all);
  }, [detailList]);

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
            height: 'unset', // 높이 자동 조절!
          },
          '.CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
            lineHeight: '35px',
          },
        }}
        name="vaPolicyGroupStatus"
        customColumn={allColumns}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {modalOpen && (
        <PolicyGroupStatusModal
          getPolicyGroupStatusList={getPolicyGroupStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default PolicyGroupStatusTable;
