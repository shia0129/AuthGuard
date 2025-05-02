import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import interfaceApi from '@api/hss/common/networkManage/interfaceApi';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function InterfaceModal(props) {
  const { alertOpen, setModalOpen, modalParams, getInterfaceList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();
  const isUnmounted = useRef(false);

  interfaceApi.axios = instance;

  const parameterData = useSelector((state) => state.interfaceModule);
  const typeList = parameterData.interfaceTypeList;
  const interfaceMemberList = parameterData.interfaceMemberList;
  const pageDataList = parameterData.pageDataList;

  const [apiCall, openModal] = useApi();
  const [isTextDisabled, setIsTextDisabled] = useState(false);
  const [isMemberDisabled, setIsMemberDisabled] = useState(false);
  const [isTypeDisabled, setIsTypeDisabled] = useState(false);
  const [isNameDisabled, setIsNameDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      type: '',
      member: '',
      ip: '',
      subnet: '',
      gateway: '',
    },
  });
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (flag === 'update') {
      const memberValue = methods.getValues().member;
      if (memberValue !== '') {
        setIsTextDisabled(memberValue !== 'MNGT');
      }

      const typeValue = methods.getValues().type;
      if (typeValue === 'bridge') {
        setIsTypeDisabled(true);
        setIsMemberDisabled(true);
      } else if (typeValue === 'ethernet') {
        setIsTypeDisabled(true);
      }

      setIsNameDisabled(true);
    }
  }, [methods.watch()]);

  const fetcher = useCallback(() => {
    return apiCall(interfaceApi.getInterfaceDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[key] ?? '';
        methods.setValue(key, value);
      }
    },
    [methods],
  );

  const isInitLoading = useInitialFormDataLoad({
    enabled: flag === 'update',
    fetcher,
    onLoaded,
  });

  const saveButtonClick = async (data) => {
    if (isInitLoading) {
      return;
    }

    let result = '';

    setIsLoading(true);

    if (data.type === 'ethernet' && data.member !== 'MNGT') {
      data.ip = '';
      data.subnet = '';
      data.gateway = '';
    }

    let mngt_check = 0;
    if (data.member.indexOf(',MNGT') !== -1) {
      for (let i = 0; i < pageDataList.length; i++) {
        if (pageDataList[i]['member'] === data.member) {
          mngt_check = 1;
        }
      }
    }

    if (mngt_check === 1) {
      result = '동일한 브릿지 인터페이스에서는 한개의 MNGT 인터페이스만 선택이 가능합니다.';
    } else {
      try {
        if (flag === 'update') {
          result = await apiCall(interfaceApi.updateInterfaceData, data);
        } else {
          result = await apiCall(interfaceApi.insertInterfaceData, data);
        }
      } catch (error) {
        console.error('인터페이스 저장 중 오류:', error);
      }
    }

    setIsLoading(false);

    if (!isUnmounted.current && result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getInterfaceList();
        },
      });
    }
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`인터페이스 ${flag === 'insert' ? '추가' : '수정'}`}
      confirmLabel="저장"
    >
      {isLoading && <Loader isGuard msg="인터페이스 설정 중입니다." />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="interfaceModal">
            <GridItem
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
                '.inputBox': {
                  maxWidth: '400px',
                  minWidth: '400px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              <LabelInput
                required
                label="인터페이스명"
                name="name"
                labelBackgroundFlag
                disabledefault
                disabled={isNameDisabled}
              />
              <LabelInput
                type="select"
                label="타입"
                name="type"
                labelBackgroundFlag
                list={typeList}
                disabledefault
                disabled={isTypeDisabled}
              />
              <LabelInput
                type="select"
                label="소속 인터페이스"
                name="member"
                labelBackgroundFlag
                list={interfaceMemberList}
                disabledefault
                disabled={isMemberDisabled}
              />
              <LabelInput label="IP 주소" name="ip" labelBackgroundFlag disabled={isTextDisabled} />
              <LabelInput
                label="서브넷 마스크"
                name="subnet"
                labelBackgroundFlag
                disabled={isTextDisabled}
              />
              <LabelInput
                label="게이트웨이"
                name="gateway"
                labelBackgroundFlag
                disabled={isTextDisabled}
              />
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default InterfaceModal;
