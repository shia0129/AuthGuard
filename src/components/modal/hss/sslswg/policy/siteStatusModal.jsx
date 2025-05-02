import { useEffect, useState, useRef, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import siteStatusApi from '@api/hss/sslswg/policy/policyDetailManage/siteStatusApi';
import Loader from '@components/mantis/Loader';
import { Typography, Box } from '@mui/material';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function SiteStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getSiteStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  siteStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      action: '0',
      type: 'site',
      value: '',
    },
  });

  const type = methods.watch('type');
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
    return apiCall(siteStatusApi.getSiteStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;
        if (value === null) {
          methods.setValue(key, '');
        } else {
          if (key === 'action') {
            methods.setValue(key, String(value));
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

    let result = '';

    setIsSaving(true);

    const { name, action, type, value } = data;

    const newData = {
      name: name,
      action: action,
      type: type,
      value: value,
    };

    if (flag === 'update') {
      // result = await apiCall(siteStatusApi.updateSiteStatusData, newData);
    } else {
      result = await apiCall(siteStatusApi.insertSiteStatusData, newData);
    }

    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getSiteStatusList();
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
      title={`사이트 정책 ${flag === 'insert' ? '작성' : '확인'}`}
      confirmLabel="저장"
      {...(flag === 'update' && { cancelLabel: '확인' })}
      disableConfirm={isDisabled}
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="siteStatusModal">
            <GridItem
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': { width: '310px' },
              }}
            >
              <LabelInput
                required
                label="정책명"
                name="name"
                maxLength={255}
                colSpan={2}
                disabled={isDisabled}
                sx={{
                  '.inputBox': { width: '800px' },
                }}
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="유형"
                name="type"
                list={[
                  { label: '도메인', value: 'site', disabled: isDisabled },
                  { label: 'URL', value: 'url', disabled: isDisabled },
                ]}
              />
              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="처리 방식"
                name="action"
                list={[
                  { label: '차단', value: '0', disabled: isDisabled },
                  // { label: '허용', value: '1', disabled: isDisabled },
                ]}
              />
              <LabelInput
                required
                label="내용"
                name="value"
                maxLength={1024}
                disabled={isDisabled}
                colSpan={2}
                sx={{
                  '.inputBox': { width: '800px' },
                }}
                onlySite={type === 'site'}
                onlyUrl={type === 'url'}
                labelBackgroundFlag
              />
              <Box colSpan={2} sx={{ p: 2, backgroundColor: '#FAFAFA' }}>
                <Typography variant="body2" fontWeight="bold">
                  [유형] 정책을 적용할 대상의 범위를 선택하세요.
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  도메인:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - 특정 도메인에 대해 정책을 적용합니다.
                  <br />
                  - 입력한 도메인의 모든 서브도메인에도 적용됩니다.
                  <br />
                  예) <code>hanssak.co.kr</code>을 입력하면 <code>www.hanssak.co.kr</code>,{' '}
                  <code>sub.hanssak.co.kr</code>도 포함됩니다.
                </Typography>
                <Typography variant="body2" sx={{ ml: 2, color: 'red' }}>
                  - 도메인만 입력하세요. (예: <code>hanssak.co.kr</code>)<br />
                  - `http://`, `https://`는 입력하지 마세요.
                  <br />
                  - 특정 경로(예: `/login`)는 입력할 수 없습니다.
                  <br />- IP 주소(예: `192.168.1.1`)는 사용하지 마세요.
                </Typography>

                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  URL:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - 특정 URL에 대해 정책을 적용합니다.
                  <br />
                  - 입력한 URL이 정확히 일치하는 경우에만 차단됩니다.
                  <br />
                  예) <code>https://hanssak.co.kr/login</code>을 입력하면 <code>hanssak.co.kr</code>
                  의 로그인 페이지에만 적용됩니다.
                </Typography>
                <Typography variant="body2" sx={{ ml: 2, color: 'red' }}>
                  - URL을 입력하세요. (예: <code>hanssak.co.kr/login</code>)<br />
                  - `http://`, `https://`는 입력하지 마세요.
                  <br />- IP 주소(예: `192.168.1.1`)는 사용하지 마세요.
                </Typography>
              </Box>
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default SiteStatusModal;
