import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import MultipleSelect from '@components/modules/select/multipleSelect';
import { Stack } from '@mui/material';
import CodeInput from '@components/modules/input/CodeInput';

function Details(props) {
  const { handleChange, processMode, optionData, onOptionChange, optionInitValue } = props;
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
          maxWidth: '150px',
          minWidth: '150px',
        },

        '.CMM-li-inputArea-formControl': {
          maxWidth: '200px !important',
          minWidth: '200px !important',
        },
      }}
    >
      <CodeInput
        required
        codeType="LOG_RECORD_TYPE"
        label="로그기록"
        name="logStatus"
        disabledefault
        onHandleChange={handleChange}
        labelBackgroundFlag
      />
      <LabelInput required label="제한시간(Sec)" name="trafficTimeout" labelBackgroundFlag />
      <LabelInput required label="측정시간(Sec)" name="trafficMeasureTime" labelBackgroundFlag />
      <CodeInput
        required
        codeType="MONITORING_YN"
        label="모니터링"
        name="monitorStatus"
        disabledefault
        onHandleChange={handleChange}
        labelBackgroundFlag
      />
      <LabelInput required label="허용량(Byte)" name="trafficLimit" labelBackgroundFlag />
      <LabelInput required label="세션종료(Sec)" name="trafficIdleTimeout" labelBackgroundFlag />
      <Stack colSpan={processMode === 'update' ? 2 : 3} direction="row" alignItems="center">
        <LabelInput
          required
          label="적용주기(매일)"
          name="jobStartTime"
          labelBackgroundFlag
          type="time1"
          views={['hours', 'minutes']}
          inputFormat="HH:m"
        />
        &nbsp;~&nbsp;
        <LabelInput
          required
          name="jobEndTime"
          type="time1"
          views={['hours', 'minutes']}
          inputFormat="HH:m"
        />
      </Stack>
      {processMode === 'update' && (
        <CodeInput
          required
          codeType="RX_TX_CHECK_TYPE"
          label="악성코드 검사"
          name="rxTxCheckType"
          disabledefault
          onHandleChange={handleChange}
          labelBackgroundFlag
        />
      )}
      <Stack colSpan={3}>
        <MultipleSelect
          label="옵션"
          name="svcOpt"
          dataList={optionData}
          onValueChange={onOptionChange}
          initValue={optionInitValue}
        />
      </Stack>
      <Stack colSpan={3}>
        <LabelInput
          label="필터"
          name="svcFilter"
          labelBackgroundFlag
          sx={{ width: '100% !important', maxWidth: 'none !important' }}
        />
      </Stack>
    </GridItem>
  );
}
export default Details;
