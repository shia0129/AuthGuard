import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslva/policyDetailStatus';
import { Link } from '@mui/material';
import PolicyDetailStatusModal from '@components/modal/hss/sslva/policy/policyDetailStatusModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import ListComponent from '@components/hss/makeColumn/listComponent';

function PolicyDetailStatusTable(props) {
  const { getPolicyDetailStatusList, protocolList } = props;

  const { columns, deleteList, protocolTypeList } = useSelector(
    (state) => state.policyDetailStatus,
  );

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
          case 'proxyType':
            return <>{value === 0 ? 'Forward' : 'Reverse'}</>;
          case 'protocolTypeId':
            return <>{protocolTypeList.find((item) => item.value === value)?.label || 'Unknown'}</>;
          case 'passthrough':
          case 'verifyPeer':
          case 'validateProto':
          case 'denyOcsp':
          case 'userAuth':
          case 'linked':
          case 'https2http':
            return <>{value === 1 ? '사용' : '-'}</>;
          case 'protocolIdList':
            return <ListComponent data={value} list={protocolList} />;
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
    if (process.env.NODE_ENV === 'development') { //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return;
      } 
    }
    const all = makeColumns();
    setAllColumns(all);
  }, [protocolList]);

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
        name="policyDetailStatus"
        customColumn={allColumns}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {modalOpen && (
        <PolicyDetailStatusModal
          getPolicyDetailStatusList={getPolicyDetailStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          protocolList={protocolList}
        />
      )}
    </GridItem>
  );
}

export default PolicyDetailStatusTable;
