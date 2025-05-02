// libraries
import { useState, useEffect,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { unstable_batchedUpdates } from 'react-dom';
import { Typography } from '@mui/material';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
// functions
import { AuthInstance } from '@modules/axios';
import codeApi from '@api/system/codeApi';
import { isNull } from 'lodash';
function BatchModificationModal({ alertOpen, setModalOpen, modalParams, getCodeList }) {
  // 파라미터
  const { flag, id } = modalParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      objectName: '',
      portNumber: '',
      portNumber2: '',
      description: '',
    },
  });
  // 수정팝업여부 상태값
  const [isUpdate, setIsUpdate] = useState(true);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 초기화
    init();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, []);
  // 초기화
  const init = () => {
    // 변경모드 세팅
    // if (flag === 'update') {
    getDetails();
    // }
  };
  // 선택된 상세값 출력
  const getDetails = async () => {
    // const result = await apiCall(codeApi.getDetails, id);
    // if (result.status === 200) {
    //   for (const key in result.data) {
    //     methods.setValue(key, result.data[`${key}`]);
    //   }
    // }
    const detailData_01 = {
      presentIP: '',
      presentPort: '',
      modifyIP: '',
      modifyPort: '',
    };

    for (const key in detailData_01) {
      if (!isNull(detailData_01[`${key}`])) {
        methods.setValue(key, detailData_01[`${key}`]);
      }
    }
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      setIsUpdate(true);
    });
  };

  // 신규 데이터 저장
  const insertData = async (data) => {
    // const result = await apiCall(codeApi.insertData, { ...data });
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 등록되었습니다.';
    //   else message = '코드정보 등록에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getCodeList();
    //     },
    //   });
    // }
    // setIsUpdate(false);
  };
  // 변경 데이터 저장
  const updateData = async (data) => {
    // const result = await apiCall(codeApi.updateData, data);
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 수정되었습니다.';
    //   else message = '코드정보 수정에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getCodeList();
    //     },
    //   });
    // }
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="sm"
        fullWidth
        callBack={methods.handleSubmit(flag === 'insert' ? insertData : updateData)}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title="목적지 IP, Port 일괄수정"
      >
        <FormProvider {...methods}>
          <form id="policyModal">
            <GridItem
              container
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
              }}
            >
              <LabelInput
                required
                label="현재 IP"
                name="presentIP"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="현재 Port"
                name="presentPort"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="수정 IP"
                name="modifyIP"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="수정 Port"
                name="modifyPort"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
            </GridItem>
            <GridItem
              item
              directionHorizon="end"
              sx={{
                mt: '7px',
              }}
            >
              <Typography variant="h5" sx={{ marginLeft: '8px', color: 'red' }}>
                *Port 미입력시 Port는 수정되지 않습니다.
              </Typography>
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('목적지 IP, Port 일괄수정 화면로딩... ')} */}
    </>
  );
}

BatchModificationModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BatchModificationModal;
