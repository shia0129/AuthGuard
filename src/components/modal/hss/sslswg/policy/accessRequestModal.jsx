import { useEffect, useState, useRef, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import accessRequestStatusApi from '@api/hss/sslswg/policy/accessRequestStatusApi';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function AccessRequestStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  accessRequestStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);

  const methods = useForm({
    defaultValues: {
      inUsed: '',
      name: '',
      ip: '',
      value: '',
      url: '',
      normalizedUrl: '',
      host: '',
      registerDate: '',
      accessDate: '',
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

  const formatUnixToDatetime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const mapStatus = (status) => {
    switch (Number(status)) {
      case 0:
        return '대기';
      case 1:
        return '허용';
      case 2:
        return '반려';
      default:
        return '-';
    }
  };

  const fetcher = useCallback(() => {
    return apiCall(accessRequestStatusApi.getAccessRequestStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;
        if (value === null) {
          methods.setValue(key, '');
        } else {
          if (key === 'inUsed') {
            methods.setValue(key, mapStatus(value));
          } else if (key === 'registerDate' || key === 'accessDate') {
            methods.setValue(key, formatUnixToDatetime(value));
          } else {
            methods.setValue(key, value);
          }
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
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title="접근 요청 상세"
      {...{ cancelLabel: '확인' }}
      disableConfirm={isDisabled}
    >
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="accessRequestStatusModal">
            <GridItem
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': { width: '600px' },
              }}
            >
              <LabelInput label="상태" name="inUsed" disabled labelBackgroundFlag />
              <LabelInput label="요청자" name="name" disabled labelBackgroundFlag />
              <LabelInput label="요청자 IP" name="ip" disabled labelBackgroundFlag />
              <LabelInput label="요청 사유" name="value" disabled labelBackgroundFlag />
              <LabelInput label="URL" name="url" disabled labelBackgroundFlag />
              <LabelInput label="정규화 URL" name="normalizedUrl" disabled labelBackgroundFlag />
              <LabelInput label="도메인" name="host" disabled labelBackgroundFlag />
              <LabelInput label="요청일" name="registerDate" disabled labelBackgroundFlag />
              <LabelInput label="승인일" name="accessDate" disabled labelBackgroundFlag />
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default AccessRequestStatusModal;
