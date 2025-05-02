// libraries
import { useState, useEffect,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { unstable_batchedUpdates } from 'react-dom';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
// functions
import { AuthInstance } from '@modules/axios';
import codeApi from '@api/system/codeApi';
import { isNull } from 'lodash';
function PortModal({ alertOpen, setModalOpen, modalParams, getCodeList }) {
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
    if (flag === 'update') {
      getDetails();
    }
  };
  // 선택된 상세값 출력
  const getDetails = async () => {
    // const result = await apiCall(codeApi.getDetails, id);
    // if (result.status === 200) {
    //   for (const key in result.data) {
    //     methods.setValue(key, result.data[`${key}`]);
    //   }
    // }
    let detailData_01 = {};
    if (id === 'device[801]') {
      detailData_01 = {
        objectName: 'device[801]',
        portNumber: '801',
        portNumber2: '801',
        description: '-',
      };
    } else if (id === 'https[443]') {
      detailData_01 = {
        objectName: 'https[443]',
        portNumber: '443',
        portNumber2: '443',
        description: 'http protocol over TLS/SSL',
      };
    } else if (id === 'http-alt[8080]') {
      detailData_01 = {
        objectName: 'http-alt[8080]',
        portNumber: '8080',
        portNumber2: '8080',
        description: 'HTTP Alternate (see port 80)',
      };
    } else if (id === 'postgresql[5432]') {
      detailData_01 = {
        objectName: 'postgresql[5432]',
        portNumber: '5432',
        portNumber2: '5432',
        description: 'PostgreSQL Database',
      };
    } else {
      detailData_01 = {
        objectName: 'ms-wbt-server[3389]',
        portNumber: '3389',
        portNumber2: '3389',
        description: 'MS WBT Server',
      };
    }

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
        title="포트 객체 상세"
        // title={`스트리밍 정책 ${flag === 'insert' ? '작성' : '수정'}`}
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
                label="객체명"
                name="objectName"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="설명"
                name="description"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="포트(From)"
                name="portNumber"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="포트(To)"
                name="portNumber2"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('포트객체상세 화면로딩... ')} */}
    </>
  );
}

PortModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PortModal;
