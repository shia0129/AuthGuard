import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslva/segmentStatus';
import { Link } from '@mui/material';
import SegmentStatusModal from '@components/modal/hss/sslva/policy/segmentStatusModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import StatusTypeComponent from '@components/hss/makeColumn/statusTypeComponent';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import segmentStatusApi from '@api/hss/sslva/policy/segmentStatusApi';

function SegmentStatusTable(props) {
  const { getSegmentStatusList, getLoadingStatus } = props;

  const { columns, deleteList } = useSelector((state) => state.segmentStatus);

  const parameterData = useSelector((state) => state.zone);
  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const [apiCall, openModal] = useApi();

  const { instance, source } = AuthInstance();
  segmentStatusApi.axios = instance;

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
            return (
              <StatusTypeComponent
                statusType={original.enabled}
                id={original.id}
                handleClickStatusType={handleClickStatusType}
              />
            );
        }

        return <>{value}</>;
      },
    }));

  const handleClickStatusType = (value, id) => {
    openModal({
      message:
        value === '1' ? '해당 세그먼트를 중지하시겠습니까?' : '해당 세그먼트를 시작하시겠습니까?',
      onConfirm: () => {
        updateEnabledData(id);
      },
    });
  };

  const updateEnabledData = async (id) => {
    getLoadingStatus(true);
    const result = await apiCall(segmentStatusApi.updateSegmentStatus, id);
    getLoadingStatus(false);

    openModal({
      message: result,
      onConfirm: () => {
        getSegmentStatusList(parameterData.parameters.current);
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
        name="segmentStatus"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {modalOpen && (
        <SegmentStatusModal
          getSegmentStatusList={getSegmentStatusList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default SegmentStatusTable;
