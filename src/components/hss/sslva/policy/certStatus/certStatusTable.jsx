import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslva/certStatus';
import { Link } from '@mui/material';
import CertStatusModal from '@components/modal/hss/sslva/policy/certStatusModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function CertStatusTable(props) {
  const { getCertStatusList } = props;

  const { columns, deleteList } = useSelector((state) => state.vaCertStatus);

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const formatUnixToDatetime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const { value } = props;

        switch (column.accessor) {
          case 'registerDate': {
            return formatUnixToDatetime(value);
          }
          case 'name':
          default:
            break;
          // return reunderCodeTypeNameCell(value, original.id);
        }

        return <>{value}</>;
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
        name="vaCertStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {/* {modalOpen && (
        <CertStatusModal
          getCertStatusList={getCertStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )} */}
    </GridItem>
  );
}

export default CertStatusTable;
