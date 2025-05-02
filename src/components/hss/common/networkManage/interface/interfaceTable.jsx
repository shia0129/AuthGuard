import { useState,useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/common/interfaceModule';
import { Link } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import InterfaceModal from '@components/modal/hss/common/networkManage/interfaceModal';

function InterfaceTable(props) {
  const { getInterfaceList } = props;

  const { columns, deleteList } = useSelector((state) => state.interfaceModule);

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const makeColumns = () => {
    if (!columns.length) {
      return [];
    }
    return columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        return reunderCodeTypeNameCell(props.value, original.name);
      },
    }));
  };
  
/*
  const makeColumns = () =>
  
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        return reunderCodeTypeNameCell(props.value, original.name);
      },
    }));
*/
  const handleUpdateColumnClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };

  const handleChangeChecked = (value) => {
    dispatch(setDeleteList(value));
  };

  const reunderCodeTypeNameCell = (value, name) => {

    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        // onClick={() => handleUpdateColumnClick('update', id)}
        onClick={() => handleUpdateColumnClick('update', name)} // idx(구분자)로 사용할 id가 없어서 name 사용
      >
        {value}
      </Link>
    );
  };
  const customColumns = useMemo(() => makeColumns(), [columns]);
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
        name="interfaceModule"
        customColumn={customColumns}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />

      {modalOpen && (
        <InterfaceModal
          getInterfaceList={getInterfaceList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default InterfaceTable;
