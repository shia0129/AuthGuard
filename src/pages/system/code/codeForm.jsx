import { useState, useEffect,useRef } from 'react';
import { useRouter } from 'next/router';
import { AuthInstance } from '@modules/axios';
import { FormProvider, useForm } from 'react-hook-form';

//Project import
import Layout from '@components/layouts';
import codeApi from '@api/system/codeApi';
import MainCard from '@components/mantis/MainCard';
import useApi from '@modules/hooks/useApi';
import LabelInput from '@components/modules/input/LabelInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import ConfirmPop from '@components/modules/popover/ConfirmPop';
import { useIntl } from 'react-intl';

function CodeForm() {
  const intl = useIntl();

  const { instance, source } = AuthInstance();
  codeApi.axios = instance;

  const router = useRouter();

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  const { flag, id } = router.query;

  const methods = useForm({
    defaultValues: {
      codeType: '',
      codeValue: '',
      codeDesc: '',
      defaultYn: '',
      deleteYn: '',
    },
  });
  const [isUpdate, setIsUpdate] = useState(true);

  const [codeInfoList, setCodeInfoList] = useState([]);

  // PopOver 엘리먼트
  const [popTarget, setPopTarget] = useState(null);

  const getCodeTypeList = async () => {
    const resultCodeType = await apiCall(codeApi.getCodeTypeList);

    if (resultCodeType.status === 200) {
      const codeArr = [];
      resultCodeType.data.map((data) => {
        const { codeType, codeTypeName } = data;
        codeArr.push({ value: codeType, label: codeTypeName });
      });
      setCodeInfoList(codeArr);
    }
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
    getCodeTypeList();

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
    if (flag === 'update') {
      const getCodeDetails = async () => {
        const result = await apiCall(codeApi.getCodeDetails, id);

        if (result.status === 200) {
          for (const key in result.data) {
            methods.setValue(key, result.data[`${key}`]);
          }
        }
      };
      getCodeDetails();
      setIsUpdate(true);
    }
  }, [flag, id]);

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
        onConfirm: () => router.push('/system/code/codeList'),
      });
    }

    setIsUpdate(false);
  };

  const updateCode = async (data) => {
    const result = await apiCall(codeApi.updateCode, data);

    if (result.status === 200) {
      let message;
      if (result.data === 1) message = '코드정보가 수정되었습니다.';
      else message = '코드정보 수정에 실패하였습니다.';
      openModal({
        message,
        onConfirm: () => router.push('/system/code/codeList'),
      });
    }
  };

  return (
    <MainCard border={false}>
      <FormProvider {...methods}>
        <form
          id="codeForm"
          onSubmit={methods.handleSubmit(flag === 'insert' ? insertCode : updateCode)}
        >
          <GridItem sx={{ width: '700px' }}>
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
            <GridItem item directionHorizon="end" sx={{ mt: 1 }}>
              <ButtonSet
                options={[
                  {
                    label: intl.formatMessage({ id: 'btn-save' }),
                    callBack: (event) => setPopTarget(event.currentTarget),
                    // role: flag,
                    color: 'primary',
                  },
                  {
                    label: intl.formatMessage({ id: 'btn-cancel' }),
                    callBack: () => router.push('/system/code/codeList'),
                  },
                ]}
              />
            </GridItem>
          </GridItem>
          <ConfirmPop name="codeForm" anchorEl={popTarget} anchorChange={setPopTarget} />
        </form>
      </FormProvider>
    </MainCard>
  );
}

CodeForm.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default CodeForm;
