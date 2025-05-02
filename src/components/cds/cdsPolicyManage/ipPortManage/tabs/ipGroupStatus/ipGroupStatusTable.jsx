import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/ipGroupStatus';
import { Button, Link, Stack } from '@mui/material';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import IpGroupStatusModal from '@components/modal/cds/cdsPolicyManage/ipPortManage/ipGroupStatusModal';

function IpGroupStatusTable(props) {
  const { getIpGroupStatusList, onClickIpAddress } = props;

  const { columns, deleteList } = useSelector((state) => state.ipGroupStatus);

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const makeColumns = () =>
    columns.map((column) => {
      switch (column.accessor) {
        case 'ipObjectList':
          return {
            ...column,
            Cell: (props) => {
              return renderCellIpAddress(props, column);
            },
          };
        default:
          return {
            ...column,
            Cell: (props) => {
              const original = props.row.original;

              return reunderCodeTypeNameCell(props.value, original.id);
            },
          };
      }
    });

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

  const renderCellIpAddress = ({ row: { original } }) => {
    return (
      <GridItem container divide={2}>
        {original.ipObjectList?.map((item, index) => (
          <Stack key={index} direction="row" spacing={0.5} sx={{ padding: '5px' }}>
            <Button
              key={index}
              variant="contained"
              onClick={() => onClickIpAddress(item)}
              color="info"
              sx={{
                maxHeight: '22px',
                minWidth: '100px',
                backgroundColor: '#00BCD4',
                marginBottom: '4px',
                marginLeft: '4px',
              }}
            >
              {item}
            </Button>
          </Stack>
        ))}
      </GridItem>
    );
  };

  return (
    <GridItem item>
      <HsReduxTable
        sx={{
          '.CMM-rt-tableArea-reactRow': {
            height: 'unset',
          },
          '.CMM-rt-headerArea-tableHead, .CMM-rt-headerArea-tableHead tr th, .CMM-rt-rowArea-tableCell':
            {
              padding: '0',
            },
          '.MuiStack-root': {
            flexWrap: 'wrap',
          },
          '.CMM-rt-rowArea-tableCell div a, .CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
            lineHeight: '35px',
          },
        }}
        name="ipGroupStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />

      {modalOpen && (
        <IpGroupStatusModal
          getIpGroupStatusList={getIpGroupStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default IpGroupStatusTable;
