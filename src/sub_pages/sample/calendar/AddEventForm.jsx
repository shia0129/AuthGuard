// libraries
import { useState, useEffect,useRef } from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Button, FormControlLabel, Stack, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';

// components
import ColorPalette from './ColorPalette';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { PopupTransition } from '@components/@extended/Transitions';
import PopUp from '@components/modules/common/PopUp';

// functions
import { createEvent, deleteEvent, updateEvent } from '@modules/redux/reducers/calendar';
import { openSnackbar } from '@modules/redux/reducers/snackbar';
import moment from 'moment/moment';

// 이벤트 정보.
const getInitialValues = (event, range) => {
  const newEvent = {
    title: '',
    description: '',
    color: '#008ABB',
    textColor: '#fff',
    allDay: false,
    start: range ? new Date(range.start).toISOString() : new Date().toISOString(),
    end: range ? new Date(range.end).toISOString() : new Date().toISOString(),
  };

  if (event || range) {
    return _.merge({}, newEvent, event);
  }

  return newEvent;
};

function AddEventForm({ event, range, onCancel }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  // 비제어 컴포넌트 초기값.
  const methods = useForm({
    defaultValues: getInitialValues(event, range),
  });

  // allDay는 별도 구현 타입이 없으므로 제어 컴포넌트로 사용.
  const [switching, setSwitching] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 선택 날짜 범위가 존재하면, 해당 값 설정.
    if (range) {
      methods.setValue('start', new Date(range.start).toISOString());
      methods.setValue('end', new Date(range.end).toISOString());
    }
  }, [range]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    // 이벤트 수정 시 초기 값 설정.
    if (event) {
      for (const key in event) {
        if (key === 'allDay') setSwitching(event[`${key}`]);
        else methods.setValue(key, event[`${key}`]);
      }
    } else {
      // 이벤트 추가 시 초기 값 설정.
      setSwitching(false);
      methods.reset();
    }
  }, [event]);

  const { isModalOpen, events } = useSelector((state) => state.calendar);

  const isCreating = !event;

  // 배경색, 전체 속성 모두 필수.
  const backgroundColor = [
    { id: 'primary', value: theme.palette.primary.main, color: 'primary.main', name: 'color' },
    { id: 'error', value: theme.palette.error.main, color: 'error.main', name: 'color' },
    { id: 'success', value: theme.palette.success.main, color: 'success.main', name: 'color' },
    {
      id: 'secondary',
      value: theme.palette.secondary.main,
      color: 'secondary.main',
      name: 'color',
    },
    { id: 'warning', value: theme.palette.warning.main, color: 'warning.main', name: 'color' },
    {
      id: 'primary.lighter',
      value: theme.palette.primary.lighter,
      color: 'primary.lighter',
      name: 'color',
    },
    {
      id: 'error.lighter',
      value: theme.palette.error.lighter,
      color: 'error.lighter',
      name: 'color',
    },
    {
      id: 'secondary.lighter',
      value: theme.palette.secondary.lighter,
      color: 'secondary.lighter',
      name: 'color',
    },
    {
      id: 'warning.lighter',
      value: theme.palette.warning.lighter,
      color: 'warning.lighter',
      name: 'color',
    },
  ];

  // 글자색, 전체 속성 모두 필수.
  const textColor = [
    { id: 'white', value: '#fff', color: 'white' },
    { id: 'error.lighter', value: theme.palette.error.lighter, color: 'error.lighter' },
    { id: 'secondary.lighter', value: theme.palette.secondary.lighter, color: 'secondary.lighter' },
    { id: 'warning.lighter', value: theme.palette.warning.lighter, color: 'warning.lighter' },
    { id: 'primary.lighter', value: theme.palette.primary.lighter, color: 'primary.lighter' },
    { id: 'primary', value: theme.palette.primary.main, color: 'primary.main' },
    { id: 'error', value: theme.palette.error.main, color: 'error.main' },
    { id: 'success', value: theme.palette.success.main, color: 'success.main' },
    { id: 'secondary', value: theme.palette.secondary.main, color: 'secondary.main' },
    { id: 'warning', value: theme.palette.warning.main, color: 'warning.main' },
  ];

  // 이벤트 삭제 핸들러.
  const deleteHandler = () => {
    dispatch(deleteEvent({ eventId: event?.id }));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Event deleted successfully.',
        variant: 'alert',
        alert: {
          color: 'success',
        },
        close: false,
      }),
    );
  };

  // 이벤트 추가, 수정 핸들러
  const addNewEvent = (data) => {
    const newEvent = { ...data };

    if (moment.isMoment(newEvent.start)) newEvent.start = newEvent.start.toISOString();
    if (moment.isMoment(newEvent.end)) newEvent.end = newEvent.end.toISOString();

    // 임시로 id값은 최대값 +1로 설정.
    const id = String(
      (events.length === 0 ? 0 : Math.max(...events.map((column) => Number(column.id)))) + 1,
    );

    // 이벤트 수정 시
    if (event) {
      dispatch(
        updateEvent(events.map((item) => (item.id === event.id ? { ...item, ...newEvent } : item))),
      );
      dispatch(
        openSnackbar({
          open: true,
          message: 'Event updated successfully.',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
      // 이벤트 추가 시
    } else {
      dispatch(createEvent([...events, { id, ...newEvent }]));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Event added successfully.',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
      methods.reset();
    }
  };

  // allDay switch 변경 핸들러.
  const handleAllDaySwitch = (event) => {
    setSwitching(event.target.checked);
    // 비제어 값 업데이트 필요.
    methods.setValue('allDay', event.target.checked);
  };

  return (
    <PopUp
      maxWidth="sm"
      sx={{ '& .MuiDialog-paper': { p: 0 } }}
      title={event ? '일정수정' : '일정등록'}
      TransitionComponent={PopupTransition}
      alertOpen={isModalOpen}
      closeAlert={onCancel}
      callBack={methods.handleSubmit(addNewEvent)}
      cancelLabel="취소"
      confirmLabel="확인"
      actionComponent={
        !isCreating && (
          <Button color="secondary" variant="contained" onClick={deleteHandler}>
            삭제
          </Button>
        )
      }
    >
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
      <FormProvider {...methods}>
        <form autoComplete="off" onSubmit={methods.handleSubmit(addNewEvent)}>
          <GridItem
            container
            item
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { minWidth: '500px', maxWidth: '500px' },
              '& .colorBox': {
                marginRight: '0',
              },
            }}
          >
            <LabelInput required label="제목" name="title" labelBackgroundFlag />
            <LabelInput
              required
              requiredtype="textArea"
              rows={3}
              multiline
              label="내용"
              name="description"
              labelBackgroundFlag
            />
            <GridItem container borderFlag direction="row" alignItems="center">
              <LabelInput
                labelBackgroundFlag
                required
                type="dateTime"
                labelSx={{ p: 0, textAlign: 'left' }}
                label="일시"
                name="start"
              />
              <Stack sx={{ marginRight: '5px' }}>~</Stack>

              <LabelInput
                required
                type="dateTime"
                labelSx={{ p: 0, textAlign: 'left' }}
                direction="column"
                sx={{ width: '100%' }}
                name="end"
              />
              <FormControlLabel
                control={<Switch onChange={handleAllDaySwitch} checked={switching} />}
                sx={{ marginLeft: '15px' }}
                labelPlacement="start"
                label="종일"
              />
            </GridItem>
            <LabelInput
              labelBackgroundFlag
              type="radio"
              label="바탕 색상"
              name="color"
              list={backgroundColor}
            >
              <ColorPalette />
            </LabelInput>

            <LabelInput
              labelBackgroundFlag
              type="radio"
              label="글씨 색상"
              name="textColor"
              list={textColor}
            >
              <ColorPalette />
            </LabelInput>
          </GridItem>
        </form>
      </FormProvider>
      {/* </LocalizationProvider> */}
    </PopUp>
  );
}

AddEventForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default AddEventForm;
