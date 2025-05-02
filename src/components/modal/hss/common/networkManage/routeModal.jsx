import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import routeApi from '@api/hss/common/networkManage/routeApi';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function RouteModal(props) {
  const { alertOpen, setModalOpen, modalParams, getRouteList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  routeApi.axios = instance;

  const parameterData = useSelector((state) => state.route);
  // const interfaceNameList = parameterData.interfaceNameList;
  const typeList = parameterData.typeList;

  const [apiCall, openModal] = useApi();

  const [isTargetDisabled, setIsTargetDisabled] = useState(false);
  const [isSubnetDisabled, setIsSubnetDisabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      target: '',
      netmask: '',
      gateway: '',
      // dev: '',
      type: 'net',
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

  const fetcher = useCallback(() => {
    return apiCall(routeApi.getRouteDetails, id);
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

  const saveButtonClick = async (formData) => {
    if (isInitLoading) {
      return;
    }

    let result = '';

    setIsLoading(true);

    // 공통 필드
    const baseData = {
      name: formData.name,
      // dev: formData.dev,
      type: formData.type,
      gateway: formData.gateway,
    };

    let data = {};

    switch (formData.type) {
      case 'net':
        data = {
          ...baseData,
          target: formData.target,
          netmask: formData.netmask,
        };
        break;
      case 'host':
        data = {
          ...baseData,
          target: formData.target,
        };
        break;
      case 'default':
        data = {
          ...baseData,
        };
        break;
    }

    try {
      if (flag === 'update') {
        result = await apiCall(routeApi.updateRouteData, data);
      } else {
        result = await apiCall(routeApi.insertRouteData, data);
      }
    } catch (error) {
      console.error('라우팅 저장 중 오류:', error);
    }

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getRouteList();
        },
      });
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0003.current) {
        useEffect_0003.current = true;
        return;
      }
    }

    const subscription = methods.watch((value, { name }) => {
      if (name === 'type') {
        switch (value.type) {
          case 'net':
            setIsTargetDisabled(false);
            setIsSubnetDisabled(false);
            break;
          case 'host':
            setIsTargetDisabled(false);
            setIsSubnetDisabled(true);
            break;
          case 'default':
            setIsTargetDisabled(true);
            setIsSubnetDisabled(true);
            break;
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`라우팅 ${flag === 'insert' ? '추가' : '수정'}`}
      confirmLabel="저장"
    >
      {isLoading && <Loader isGuard msg="라우팅 설정 중입니다." />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="RouteModal">
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
                label="이름"
                name="name"
                labelBackgroundFlag
                disabledefault
                disabled={flag === 'update'}
              />
              {/* <LabelInput
                required
                type="select"
                label="인터페이스명"
                name="dev"
                labelBackgroundFlag
                list={interfaceNameList}
                disabledefault
              /> */}
              <LabelInput
                required
                type="select"
                label="타입"
                name="type"
                labelBackgroundFlag
                list={typeList.map((item) => ({
                  ...item,
                  // disabled: isDefaultChecked && item.value === 'host',
                }))}
                disabledefault
              />
              <LabelInput
                required={!isTargetDisabled}
                label="목적지"
                name="target"
                placeholder={isTargetDisabled ? '' : '10.10.0.0'}
                labelBackgroundFlag
                disabled={isTargetDisabled}
                disabledefault
              />
              <LabelInput
                required={!isSubnetDisabled}
                label="넷마스크"
                name="netmask"
                placeholder={isSubnetDisabled ? '' : '255.255.255.0'}
                labelBackgroundFlag
                disabled={isSubnetDisabled}
                disabledefault
              />
              <LabelInput
                required
                label="게이트웨이"
                name="gateway"
                placeholder="192.168.1.1"
                labelBackgroundFlag
                disabledefault
              />
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default RouteModal;
