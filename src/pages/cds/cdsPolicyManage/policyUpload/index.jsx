import _ from 'lodash';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import useApi from '@modules/hooks/useApi';
import policyUploadApi from '@api/cds/cdsPolicyManage/policyUpload/policyUploadApi';
import { AuthInstance } from '@modules/axios';
import { useEffect, useState,useRef } from 'react';
import PolicyFileUpload from '@components/cds/policyUpload/policyFileUpload';
import PolicyUploadActionButton from '@components/cds/policyUpload/policyUploadActionButton';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadFileList, setVerifyResponseData } from '@modules/redux/reducers/policyUpload';
import PolicyUploadResult from '@components/cds/policyUpload/policyUploadResult';
import { unstable_batchedUpdates } from 'react-dom';

function PolicyUpload() {
  const [apiCall, openModal] = useApi();
  const { instance } = AuthInstance();

  policyUploadApi.axios = instance;

  const dispatch = useDispatch();

  const { verifyResponseData } = useSelector((state) => state.policyUpload);
  const [fileList, setFileList] = useState([]);

  const [isVerify, setIsVerify] = useState(true);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 기존 상태 정보 초기화.
    dispatch(setUploadFileList([]));
    dispatch(setVerifyResponseData({}));
  }, []);

  const handleClickVerifyButton = async () => {
    if (_.isEmpty(fileList)) {
      openModal({
        message: '검증하기 위한 파일을 선택해주세요.',
      });
      return;
    }
    const { policies } = await apiCall(policyUploadApi.getPolicyFileVerify, fileList);

    const policyTableData = policies.map((policy) => ({
      no: policy.no,
      uploadProcessStatus: policy.uploadProcessStatus,
      statusMessage: policy.statusMessage,
      ...policy.policy,
    }));

    unstable_batchedUpdates(() => {
      setIsVerify(true);
      dispatch(setVerifyResponseData(policies));
      dispatch(setUploadFileList(policyTableData));
    });
  };

  const handleClickUploadButton = async () => {
    if (_.isEmpty(verifyResponseData)) {
      openModal({
        message: '파일 검증 데이터가 존재하지 않습니다.',
      });
      return;
    }

    const { policies } = await apiCall(policyUploadApi.insertPolicyFile, verifyResponseData);

    const policyTableData = policies.map((policy) => ({
      no: policy.no,
      uploadProcessStatus: policy.uploadProcessStatus,
      statusMessage: policy.statusMessage,
      ...policy.policy,
    }));

    unstable_batchedUpdates(() => {
      setIsVerify(false);
      dispatch(setUploadFileList(policyTableData));
    });
  };

  return (
    <GridItem container direction="column" spacing={1} sx={{ mt: 5 }}>
      <PolicyFileUpload onChangeFileList={setFileList} />
      <PolicyUploadActionButton
        onVerifyButtonClick={handleClickVerifyButton}
        onUploadButtonClick={handleClickUploadButton}
      />
      <PolicyUploadResult titleFlag={isVerify} />
    </GridItem>
  );
}

PolicyUpload.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyUpload;
