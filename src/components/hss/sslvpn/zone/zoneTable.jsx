import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslvpn/zone';
import { Link } from '@mui/material';
import ZoneModal from '@components/modal/hss/sslvpn/zoneModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import StatusTypeComponent from '@components/hss/makeColumn/statusTypeComponent';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import zoneApi from '@api/hss/sslvpn/zoneApi';

function ZoneTable(props) {
  const { getZoneList, getLoadingStatus } = props;

  const { columns, deleteList } = useSelector((state) => state.zone);

  const parameterData = useSelector((state) => state.zone);
  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const [apiCall, openModal] = useApi();

  const { instance, source } = AuthInstance();
  zoneApi.axios = instance;

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;

        switch (column.accessor) {
          case 'enabled':
            return (
              <StatusTypeComponent
                statusType={original.enabled}
                id={original.id}
                handleClickStatusType={handleClickStatusType}
              />
            );
        }

        return reunderCodeTypeNameCell(props.value, original.name);
      },
    }));

  const handleClickStatusType = (value, id) => {
    openModal({
      message: value === '1' ? '해당 ZONE을 중지하시겠습니까?' : '해당 ZONE을 시작하시겠습니까?',
      onConfirm: () => {
        updateEnabledData(id);
      },
    });
  };

  const updateEnabledData = async (id) => {
    getLoadingStatus(true);
    const result = await apiCall(zoneApi.updateZoneStatus, id);
    getLoadingStatus(false);

    openModal({
      message: result,
      onConfirm: () => {
        getZoneList(parameterData.parameters.current);
      },
    });
  };

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
        onClick={() => handleUpdateColumnClick('update', name)}
      >
        {value}
      </Link>
    );
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    return () => {
      source.cancel();
    };
  }, []);

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
        name="zone"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {modalOpen && (
        <ZoneModal
          getZoneList={getZoneList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default ZoneTable;
