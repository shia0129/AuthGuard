import { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import policyGroupStatusApi from '@api/hss/sslswg/policy/policyGroupStatusApi';
import Loader from '@components/mantis/Loader';
import { useSelector } from 'react-redux';
import timeGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeGroupStatusApi';
import timeStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeStatusApi';
import { Typography, Box } from '@mui/material';

function PolicyGroupStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getPolicyGroupStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();
  const parameterData = useSelector((state) => state.swgPolicyGroupStatus);
  const { segmentNameList, timeNameList } = parameterData;

  policyGroupStatusApi.axios = instance;
  timeGroupStatusApi.axios = instance;
  timeStatusApi.axios = instance;
  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      segmentName: '',
      timeId: '',
      isBlackList: '',
      action: '0',
      description: '',
    },
  });
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    if (flag === 'update') {
      getPolicyGroupStatusDetail();
      setIsDisabled(true);
    }

    return () => {
      source.cancel();
    };
  }, []);

  const getPolicyGroupStatusDetail = async () => {
    const result = await apiCall(policyGroupStatusApi.getPolicyGroupStatusDetails, id);

    for (const key in result) {
      const value = result[`${key}`] ?? null;

      if (value === null) {
        methods.setValue(key, '');
      } else {
        methods.setValue(key, value);
      }
    }
  };

  const saveButtonClick = async (data) => {
    let result = '';
    setIsLoading(true);
    const { name, segmentName, timeId, isBlackList, action, description } = data;

    const convertToBinary = (field) => (field && field.includes('1') ? '1' : '0');

    console.log(timeId);

    const newData = {
      name: name,
      segmentName: segmentName,
      timeId: timeId,
      isBlackList: isBanned ? convertToBinary(isBlackList) : '0',
      action: action,
      description: description,
    };

    if (flag === 'update') {
      // result = await apiCall(policyGroupStatusApi.updatePolicyGroupStatusData, newData);
    } else {
      result = await apiCall(policyGroupStatusApi.insertPolicyGroupStatusData, newData);
    }
    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getPolicyGroupStatusList();
        },
      });
    }
  };
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (methods.getValues('action') === '0') {
      setIsBanned(true);
    } else {
      setIsBanned(false);
    }
  }, [methods.watch('action')]);

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`정책 그룹 ${flag === 'insert' ? '작성' : '확인'}`}
      confirmLabel="저장"
      {...(flag === 'update' && { cancelLabel: '확인' })}
      disableConfirm={isDisabled}
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="policyGroupStatusModal">
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
              label="그룹명"
              maxLength={255}
              name="name"
              disabled={isDisabled}
              sx={{
                '.inputBox': { width: '800px' },
              }}
              colSpan={2}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="SSL VA<br/>[세그먼트]"
              name="segmentName"
              list={segmentNameList}
              labelBackgroundFlag
              labelSx={{ textAlign: 'right' }}
            />
            <LabelInput
              required
              type="radio"
              label="처리 방식"
              name="action"
              list={[
                { label: '차단', value: '0' },
                // { label: '허용', value: '1' },
              ]}
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="스케줄 정책"
              name="timeId"
              list={timeNameList}
              labelBackgroundFlag
            />
            <LabelInput
              type="checkbox"
              label="블랙리스트 정책"
              name="isBlackList"
              list={[{ label: '적용', value: '1', disabled: !isBanned }]}
              labelBackgroundFlag
            />
            <LabelInput
              label="설명"
              name="description"
              maxLength={1024}
              disabled={isDisabled}
              sx={{
                '.inputBox': { width: '800px' },
              }}
              labelBackgroundFlag
              colSpan={2}
            />
            <Box colSpan={2} sx={{ p: 2, backgroundColor: '#FAFAFA' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                [블랙리스트 정책]
              </Typography>
              <Typography variant="body2">
                - 블랙리스트 정책은 1개의 그룹만 적용할 수 있습니다.
              </Typography>
            </Box>
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default PolicyGroupStatusModal;
