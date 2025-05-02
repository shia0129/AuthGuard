import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import protocolStatusApi from '@api/hss/sslva/policy/protocolStatusApi';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function ProtocolStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getProtocolStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  protocolStatusApi.axios = instance;

  const protocolTypeList = useSelector((state) => state.protocolStatus.protocolTypeList) ?? [];

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      protocolTypeId: '',
      port: '',
    },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    if (flag === 'update') {
      setIsDisabled(true);
    }

    return () => {
      source.cancel();
    };
  }, []);

  const fetcher = useCallback(() => {
    return apiCall(protocolStatusApi.getProtocolStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;

        if (value === null) {
          methods.setValue(key, '');
        } else {
          methods.setValue(key, value);
        }
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

    setIsSaving(true);
    if (flag === 'update') {
      // result = await apiCall(protocolStatusApi.updateProtocolStatusData, data);
    } else {
      result = await apiCall(protocolStatusApi.insertProtocolStatusData, data);
    }
    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getProtocolStatusList();
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
      title={`프로토콜 ${flag === 'insert' ? '작성' : '확인'}`}
      confirmLabel="저장"
      disableConfirm={isDisabled}
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="protocolStatusModal">
            <GridItem
              direction="row"
              divideColumn={3}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': {
                  maxWidth: '150px',
                  minWidth: '150px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              <LabelInput
                required
                label="객체명"
                name="name"
                disabled={isDisabled}
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="프로토콜"
                name="protocolTypeId"
                list={protocolTypeList}
                disabled={isDisabled}
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="포트"
                name="port"
                onlyNumber
                minValue={0}
                maxValue={65535}
                disabled={isDisabled}
                labelBackgroundFlag
              />
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default ProtocolStatusModal;
