// libraries
import { useState, useEffect,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import codeApi from '@api/system/codeApi';

function CodeModal({ alertOpen, setModalOpen, modalParams, getCodeList }) {
  // 파라미터
  const { flag, id } = modalParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      codeType: '',
      codeValue: '',
      codeDesc: '',
      defaultYn: '',
      deleteYn: '',
    },
  });
  // 수정팝업여부 상태값
  const [isUpdate, setIsUpdate] = useState(true);
  // 코드구분 상태값
  const [codeInfoList, setCodeInfoList] = useState([]);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 코드구분 출력
    getCodeTypeList();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, []);
  // 코드구분 출력
  const getCodeTypeList = async () => {
    const resultCodeType = await apiCall(codeApi.getCodeTypeList);

    if (resultCodeType.status === 200) {
      const codeArr = [];
      resultCodeType.data.map((data) => {
        const { codeType, codeTypeName } = data;
        codeArr.push({ value: codeType, label: codeTypeName });
      });
      setCodeInfoList(codeArr);
      // 변경모드 세팅
      if (flag === 'update') {
        await getCodeDetails();
        setIsUpdate(true);
      }
    }
  };
  // 선택된 코드 상세값 출력
  const getCodeDetails = async () => {
    const result = await apiCall(codeApi.getCodeDetails, id);

    if (result.status === 200) {
      for (const key in result.data) {
        methods.setValue(key, result.data[`${key}`]);
      }
    }
  };
  // Side effect Hook
  useEffect(() => {}, [flag, id]);
  // 신규 데이터 저장
  const insertCode = async (data) => {
    // indexkey 문제로 인해 encryptList 주석
    // const result = await apiCall(codeApi.insertCode, { ...data, encryptList: 'all' });
    const result = await apiCall(codeApi.insertCode, { ...data });

    if (result.status === 200) {
      let message;
      if (result.data === 1) message = '코드정보가 등록되었습니다.';
      else message = '코드정보 등록에 실패하였습니다.';
      openModal({
        message,
        onConfirm: () => {
          setModalOpen(false);
          getCodeList();
        },
      });
    }

    setIsUpdate(false);
  };
  // 변경 데이터 저장
  const updateCode = async (data) => {
    const result = await apiCall(codeApi.updateCode, data);

    if (result.status === 200) {
      let message;
      if (result.data === 1) message = '코드정보가 수정되었습니다.';
      else message = '코드정보 수정에 실패하였습니다.';
      openModal({
        message,
        onConfirm: () => {
          setModalOpen(false);
          getCodeList();
        },
      });
    }
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="sm"
        fullWidth
        callBack={methods.handleSubmit(flag === 'insert' ? insertCode : updateCode)}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title={`코드 ${flag === 'insert' ? '작성' : '수정'}`}
      >
        <FormProvider {...methods}>
          <form id="codeModal">
            <GridItem
              container
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
                '.inputBox': {
                  maxWidth: '310px',
                  minWidth: '310px',
                },
              }}
            >
              <LabelInput
                required
                type="select"
                label={intl.formatMessage({ id: 'code-type' })}
                name="codeType"
                disabled={!isUpdate}
                list={codeInfoList}
                labelBackgroundFlag
              />

              <LabelInput
                required
                maxLength={32}
                typingCheck
                label={intl.formatMessage({ id: 'code-value' })}
                name="codeValue"
                disabled={!isUpdate}
                placeholder="코드 값"
                labelBackgroundFlag
              />

              <LabelInput
                required
                maxLength={32}
                typingCheck
                label={intl.formatMessage({ id: 'code-desc' })}
                name="codeDesc"
                disabled={!isUpdate}
                placeholder="코드 설명"
                labelBackgroundFlag
              />

              <LabelInput
                required
                type="select"
                label={intl.formatMessage({ id: 'code-default-yn' })}
                name="defaultYn"
                disabled={!isUpdate}
                list={[
                  { value: 'Y', label: '예' },
                  { value: 'N', label: '아니오' },
                ]}
                labelBackgroundFlag
              />

              <LabelInput
                required
                type="select"
                label={intl.formatMessage({ id: 'code-delete-yn' })}
                name="deleteYn"
                disabled={!isUpdate}
                list={[
                  { value: 'Y', label: '예' },
                  { value: 'N', label: '아니오' },
                ]}
                labelBackgroundFlag
              />
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('코드추가/수정 화면로딩... ')} */}
    </>
  );
}

CodeModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default CodeModal;
