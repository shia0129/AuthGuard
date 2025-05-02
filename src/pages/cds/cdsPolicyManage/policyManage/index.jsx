import { useState, useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import PolicyManageSearchForm from '@components/cds/cdsPolicyManage/policyManage/policyManageSearchForm';
import PolicyManageActionButton from '@components/cds/cdsPolicyManage/policyManage/policyManageActionButton';
import PolicyManageTable from '@components/cds/cdsPolicyManage/policyManage/policyManageTable';
import PolicyManageModal from '@components/modal/cds/cdsPolicyManage/policyManage/modal/policyManage/policyManageModal';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import {
  setParameters,
  setColumns,
  setPolicyManageList,
  setResetCheckList,
} from '@modules/redux/reducers/policyManage';
import useApi from '@modules/hooks/useApi';
import policyManageApi from '@api/indirectLink/policyManageApi';
import codeApi from '@api/system/codeApi';

function PolicyManage() {
  const { instance, source } = AuthInstance();

  codeApi.axios = instance;
  policyManageApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [processMode, setProcessMode] = useState('');
  const [updatePolicyId, setUpdatePolicyId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.policyManage);
  const parameters = parameterData.parameters.current;
  const { size, page } = parameterData.parameters.current;

  const [gridInfo, setGridInfo] = useState({
    api: policyManageApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('PolicyManageList', policyManageApi);

    if (gridInfo) {
      unstable_batchedUpdates(() => {
        responseGridInfo(gridInfo);
      });
    }
  };

  const responseGridInfo = (p_gridInfo) => {
    dispatch(setColumns({ columns: p_gridInfo.columns }));

    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });

    dispatch(
      setParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  const getPolicyManageList = async (param) => {
    const { totalElements, content } = await apiCall(policyManageApi.getPolicyManageList, param);

    setGridInfo((prev) => {
      return { ...prev, total: totalElements };
    });

    dispatch(setPolicyManageList({ policyManageList: content || [] }));
  };

  const onInsertButtonClick = () => {
    setProcessMode('insert');
    setModalOpen(true);
  };

  const onDeleteButtonClick = async () => {
    if (parameterData.addCheckList.length === 0) {
      openModal({ message: '삭제할 항목을 먼저 선택해주세요.' });
      return;
    }

    const result = await apiCall(
      policyManageApi.deletePolicyManageData,
      parameterData.addCheckList,
    );

    if (result) {
      dispatch(setResetCheckList({ addCheckList: [] }));

      openModal({
        message: result,
        onConfirm: async () => {
          await getPolicyManageList();
        },
      });
    }
  };

  const onCopyButtonClick = async () => {
    if (parameterData.addCheckList.length === 0) {
      openModal({ message: '복사할 항목을 먼저 선택해주세요.' });
    } else if (parameterData.addCheckList.length > 1) {
      openModal({ message: '복사할 항목 1개만 선택가능합니다.' });
    } else {
      setProcessMode('copy');
      setUpdatePolicyId(parameterData.addCheckList[0]);
      setModalOpen(true);
      dispatch(setResetCheckList({ addCheckList: [] }));
    }
  };

  const onUpdatePolicyButtonClick = () => {
    openModal({
      message: '수정된 정책을 전체 적용하시겠습니까?',
      onConfirm: () => {
        updateRevisedPolicyData();
      },
    });
  };

  const updateRevisedPolicyData = async () => {
    const result = await apiCall(policyManageApi.updateRevisedPolicyData);

    dispatch(setResetCheckList({ addCheckList: [] }));

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          getPolicyManageList(parameters);
        },
      });
    }
  };

  const onPolicyButtonClick = async () => {
    if (parameterData.addCheckList.length === 0) {
      openModal({ message: '정책 적용할 항목을 먼저 선택해주세요.' });
      return;
    }

    const result = await apiCall(policyManageApi.updatePolicyData, parameterData.addCheckList);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          getPolicyManageList(parameters);
          dispatch(setResetCheckList({ addCheckList: [] }));
        },
      });
    }
  };

  const onNameColumnClick = (updatePolicyId) => {
    setUpdatePolicyId(updatePolicyId);
    setProcessMode('update');
    setModalOpen(true);
  };
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getPolicyManageList(parameters);
  }, [size, page]);

  return (
    <>
      <GridItem spacing={2} container direction="column">
        <PolicyManageSearchForm />
        <PolicyManageActionButton
          onSearchButtonClick={getPolicyManageList}
          onInsertButtonClick={onInsertButtonClick}
          onDeleteButtonClick={onDeleteButtonClick}
          onCopyButtonClick={onCopyButtonClick}
          onUpdatePolicyButtonClick={onUpdatePolicyButtonClick}
          onPolicyButtonClick={onPolicyButtonClick}
        />
        <PolicyManageTable
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          getPolicyManageList={getPolicyManageList}
          onNameColumnClick={onNameColumnClick}
        />
      </GridItem>

      {modalOpen && (
        <PolicyManageModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          processMode={processMode}
          updatePolicyId={updatePolicyId}
          getPolicyManageList={getPolicyManageList}
        />
      )}
    </>
  );
}

PolicyManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyManage;
