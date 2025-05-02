import { useEffect, useState, useRef, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack } from '@mui/material';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import srcIpStatusApi from '@api/hss/sslswg/policy/policyDetailManage/srcIpStatusApi';
import Loader from '@components/mantis/Loader';
import { Typography, Box } from '@mui/material';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function SrcIpStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getSrcIpStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  srcIpStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBlockEnabled, setIsBlockEnabled] = useState(false);
  const [isRangeEnabled, setIsRangeEnabled] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      inputType: 'single',
      startIp: '',
      endIp: '',
      ipLength: '',
      action: '0',
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
    if (flag === 'update') {
      setIsDisabled(true);
    }

    return () => {
      source.cancel();
    };
  }, []);

  const fetcher = useCallback(() => {
    return apiCall(srcIpStatusApi.getSrcIpStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;

        if (value === null) {
          methods.setValue(key, '');
        } else {
          if (key === 'value') {
            if (value.includes('-')) {
              const parts = value.split('-');
              if (parts.length === 2) {
                methods.setValue('startIp', parts[0]);
                methods.setValue('endIp', parts[1]);
                methods.setValue('inputType', 'range');
              }
            } else if (value.includes('/')) {
              const parts = value.split('/');
              if (parts.length === 2) {
                methods.setValue('startIp', parts[0]);
                methods.setValue('ipLength', parts[1]);
                methods.setValue('inputType', 'cidr');
              }
            } else {
              methods.setValue('startIp', value);
              methods.setValue('inputType', 'single');
            }
          } else if (key === 'action') {
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

    const { name, startIp, endIp, ipLength, action } = data;

    const getIp = () => {
      if (isRangeEnabled) {
        return `${startIp}-${endIp}`;
      }
      if (isBlockEnabled) {
        return `${startIp}/${ipLength}`;
      }
      return startIp;
    };

    const newData = {
      name: name,
      action: action,
      value: getIp(),
    };

    if (flag === 'update') {
      // result = await apiCall(srcIpStatusApi.updateSrcIpStatusData, newData);
    } else {
      result = await apiCall(srcIpStatusApi.insertSrcIpStatusData, newData);
    }

    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getSrcIpStatusList();
        },
      });
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    const inputType = methods.getValues('inputType');
    setIsRangeEnabled(inputType === 'range');
    setIsBlockEnabled(inputType === 'cidr');
  }, [methods.watch('inputType')]);

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`출발지IP ${flag === 'insert' ? '작성' : '확인'}`}
      confirmLabel="저장"
      {...(flag === 'update' && { cancelLabel: '확인' })}
      disableConfirm={isDisabled}
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="srcIpStatusModal">
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
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="입력 타입"
                name="inputType"
                list={[
                  { label: '단일', value: 'single', disabled: isDisabled },
                  { label: '범위', value: 'range', disabled: isDisabled },
                  { label: 'CIDR', value: 'cidr', disabled: isDisabled },
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
              <Stack direction="row" alignItems="center" colSpan={2}>
                <LabelInput
                  required
                  label="IP"
                  name="startIp"
                  // maskOptions={{ type: 'ipv4' }}
                  disabled={isDisabled}
                  labelBackgroundFlag
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="endIp"
                  disabled={!isRangeEnabled || isDisabled}
                  // maskOptions={{ type: 'ipv4' }}
                />
              </Stack>
              <LabelInput
                label="IP대역"
                name="ipLength"
                onlyNumber
                minValue={24}
                maxValue={32}
                disabled={!isBlockEnabled || isDisabled}
                colSpan={2}
                labelBackgroundFlag
              />
              <Box colSpan={2} sx={{ p: 2, backgroundColor: '#FAFAFA' }}>
                <Typography variant="body2" fontWeight="bold">
                  [입력 타입] 정책을 적용할 IP 범위를 선택하세요.
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  단일:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - 특정 IP 주소 한 개에 대해 정책을 적용합니다.
                  <br />
                  - 입력한 단일 IP에 대해 차단 또는 허용 정책을 설정할 수 있습니다.
                  <br />
                  예) 192.168.1.100
                  <br />
                </Typography>

                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  범위:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - 연속된 IP 주소 범위에 대해 정책을 적용합니다.
                  <br />
                  - 시작 IP와 끝 IP를 입력하여 해당 범위에 속하는 모든 IP에 정책을 적용할 수
                  있습니다.
                  <br />
                  예) 192.168.1.10 - 192.168.1.50 → 192.168.1.10부터 192.168.1.50까지 모든 IP 적용
                  <br />
                  203.0.113.1 - 203.0.113.255 → 특정 공인 IP 대역 적용
                  <br />
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  CIDR:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - IP 주소 블록 전체에 대해 정책을 적용합니다. <br />
                  - CIDR 표기법을 사용하여 특정 네트워크 대역을 차단하거나 허용할 수 있습니다.
                  <br />
                  예) 192.168.1.0/24 → 192.168.1.1 ~ 192.168.1.255 포함
                  <br />
                  203.0.113.0/26 → 203.0.113.0 ~ 203.0.113.63 포함
                  {/* <br /> */}
                  {/* 10.0.0.0/8 → 10.0.0.0 ~ 10.255.255.255 포함 */}
                </Typography>
              </Box>
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default SrcIpStatusModal;
