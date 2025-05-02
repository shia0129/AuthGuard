import { useEffect, useState, useRef, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import timeStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeStatusApi';
import moment from 'moment';
import Loader from '@components/mantis/Loader';
import { Typography, Box } from '@mui/material';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function TimeStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getTimeStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  timeStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      startTime: '0000',
      endTime: '0000',
      days: [],
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

  const convertDaysToArray = (daysString) => {
    const daysArray = new Array(7).fill('');
    daysString.split('').forEach((char) => {
      daysArray[parseInt(char, 10)] = char;
    });
    return daysArray;
  };

  const convertDaysToString = (daysArray) => {
    return daysArray
      .filter((item) => typeof item === 'string' && item.trim() !== '') // 빈 문자열 제거
      .join(''); // 남은 요소를 이어붙이기
  };

  const fetcher = useCallback(() => {
    return apiCall(timeStatusApi.getTimeStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;

        if (value === null) {
          methods.setValue(key, '');
        } else {
          if (
            key === 'startTimeHour' ||
            key === 'startTimeMin' ||
            key === 'endTimeHour' ||
            key === 'endTimeMin'
          ) {
            continue; // startTime, endTime은 따로 처리하므로 개별 키 설정 X
          }

          if (key === 'days') {
            const restoredDays = convertDaysToArray(value);
            methods.setValue(key, restoredDays);
          } else {
            methods.setValue(key, value);
          }
        }

        if (result.startTimeHour && result.startTimeMin) {
          methods.setValue(
            'startTime',
            moment(`${result.startTimeHour}:${result.startTimeMin}`, 'HH:mm'),
          );
        } else {
          methods.setValue('startTime', null);
        }

        if (result.endTimeHour && result.endTimeMin) {
          methods.setValue(
            'endTime',
            moment(`${result.endTimeHour}:${result.endTimeMin}`, 'HH:mm'),
          );
        } else {
          methods.setValue('endTime', null);
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

    const startTimeType = typeof data.startTime;
    const endTimeType = typeof data.endTime;

    if (startTimeType !== 'string') {
      const startMoment = moment(data.startTime);
      if (startMoment.isValid()) {
        data.startTimeHour = startMoment.format('HH');
        data.startTimeMin = startMoment.format('mm');
      }
    }

    if (endTimeType !== 'string') {
      const endMoment = moment(data.endTime);
      if (endMoment.isValid()) {
        data.endTimeHour = endMoment.format('HH');
        data.endTimeMin = endMoment.format('mm');
      }
    }

    data.days = convertDaysToString(data.days);

    const newData = {
      name: data.name,
      startTimeHour: data.startTimeHour ?? '00',
      startTimeMin: data.startTimeMin ?? '00',
      endTimeHour: data.endTimeHour ?? '00',
      endTimeMin: data.endTimeMin ?? '00',
      days: data.days,
    };

    if (flag === 'update') {
      // result = await apiCall(timeStatusApi.updateTimeStatusData, data);
    } else {
      result = await apiCall(timeStatusApi.insertTimeStatusData, newData);
    }

    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getTimeStatusList();
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
      title={`스케줄 ${flag === 'insert' ? '작성' : '확인'}`}
      confirmLabel="저장"
      {...(flag === 'update' && { cancelLabel: '확인' })}
      disableConfirm={isDisabled}
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="timeStatusModal">
            <GridItem
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
                '.inputBox': {
                  maxWidth: '400px',
                  minWidth: '400px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '400px !important',
                  minWidth: '400px !important',
                },
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
                type="checkbox"
                label="적용 요일"
                name="days"
                colSpan={2}
                list={[
                  { value: '0', label: '월', disabled: isDisabled },
                  { value: '1', label: '화', disabled: isDisabled },
                  { value: '2', label: '수', disabled: isDisabled },
                  { value: '3', label: '목', disabled: isDisabled },
                  { value: '4', label: '금', disabled: isDisabled },
                  { value: '5', label: '토', disabled: isDisabled },
                  { value: '6', label: '일', disabled: isDisabled },
                ]}
                disabled={isDisabled}
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="시작 시간"
                name="startTime"
                labelBackgroundFlag
                type="time1"
                views={['hours', 'minutes']}
                inputFormat="HH:mm"
                disabled={isDisabled}
              />
              <LabelInput
                required
                label="종료 시간"
                name="endTime"
                labelBackgroundFlag
                type="time1"
                views={['hours', 'minutes']}
                inputFormat="HH:mm"
                disabled={isDisabled}
              />
              <Box colSpan={2} sx={{ p: 2, backgroundColor: '#FAFAFA' }}>
                <Typography variant="body2" fontWeight="bold">
                  적용할 요일과 시간을 설정하세요.
                </Typography>

                {/* 적용 요일 설명 */}
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  [적용 요일]
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - 스케줄을 적용할 요일을 선택하세요.
                  <br />- 최소 <strong>1개 이상의 요일</strong>을 선택해야 합니다.
                  <br />
                  예) 월, 화, 수 → 월요일~수요일 동안 적용
                  <br />
                  금, 토 → 금요일과 토요일만 적용
                </Typography>

                {/* 시작 시간 & 종료 시간 설명 */}
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  시작 시간 & 종료 시간:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - 스케줄이 <strong>적용될 시간 범위</strong>를 설정하세요.
                  <br />
                  - 시작 시간은 종료 시간보다 앞서야 합니다.
                  <br />
                  예) <code>08:00 ~ 18:00</code> → 오전 8시부터 오후 6시까지 적용
                  <br />
                  <code>22:00 ~ 06:00</code> → 오후 10시부터 다음날 오전 6시까지 적용 (야간 적용
                  가능)
                </Typography>
                {/* <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: 'red' }}>
                ⚠️ 주의 사항:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, color: 'red' }}>
                - 스케줄이 하루를 넘어갈 경우 (`22:00 ~ 06:00`) 시스템에서 자동으로 처리됩니다.
                <br />- 적용 요일과 시간이 겹치는 정책이 있을 경우, 우선순위를 확인하세요.
              </Typography> */}
              </Box>
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default TimeStatusModal;
