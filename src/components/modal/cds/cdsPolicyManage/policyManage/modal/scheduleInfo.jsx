import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack } from '@mui/material';

function ScheduleInfo({ applicationCycle, handleChange }) {
  const scheduleWrap = {
    height: '100%',
    pl: '10px',
  };

  const timeStyle = {
    maxWidth: '110px',
    minWidth: '110px',
  };

  const dateStyle = {
    maxWidth: '150px',
    minWidth: '150px',
  };

  return (
    <GridItem
      container
      direction="row"
      divideColumn={3}
      borderFlag
      sx={{
        mt: '7px',
        '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
        '.inputBox': {
          minWidth: '100%',
          maxWidth: '100%',
        },
      }}
    >
      <LabelInput
        required
        type="select"
        label="적용주기"
        name="applicationCycle"
        list={[
          { value: '1', label: '매일' },
          { value: '2', label: '기간 설정' },
        ]}
        onHandleChange={handleChange}
        labelBackgroundFlag
      />
      {applicationCycle === '1' ? (
        <Stack colSpan={2} direction="row" alignItems="center" sx={scheduleWrap}>
          <LabelInput
            name="startDate"
            type="time1"
            views={['hours']}
            inputFormat="HH"
            sx={timeStyle}
          />
          시 &nbsp;~&nbsp;
          <LabelInput
            name="endDate"
            type="time1"
            views={['hours']}
            inputFormat="HH"
            sx={timeStyle}
          />{' '}
          시
        </Stack>
      ) : applicationCycle === '2' ? (
        <Stack colSpan={2} direction="row" alignItems="center" sx={scheduleWrap}>
          <LabelInput type="date1" name="startTime" sx={dateStyle} />
          <LabelInput
            name="startDate"
            type="time1"
            views={['hours']}
            inputFormat="HH"
            sx={timeStyle}
          />
          시 &nbsp;~&nbsp;
          <LabelInput type="date1" name="endTime" sx={dateStyle} />
          <LabelInput
            name="endDate"
            type="time1"
            views={['hours']}
            inputFormat="HH"
            sx={timeStyle}
          />{' '}
          시
        </Stack>
      ) : (
        <Stack colSpan={2} direction="row" alignItems="center" sx={scheduleWrap} />
      )}
    </GridItem>
  );
}

export default ScheduleInfo;
