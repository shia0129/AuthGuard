import GridItem from '@components/modules/grid/GridItem';
import CodeInput from '@components/modules/input/CodeInput';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import { setParameters } from '@modules/redux/reducers/monitoringLog';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

function MonitoringLogSearchForm() {
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.monitoringLog);
  const parameters = parameterData.parameters.current;

  const handleChange = (event) => {
    dispatch(setParameters({ [event.target.name]: event.target.value }));
  };

  const handleDateChange = (_, value) => {
    const dateValue = value.date.format('YYYY-MM-DD HH:mm:ss');

    dispatch(setParameters({ [value.name]: dateValue }));
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={5}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '110px', minWidth: '110px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
        }}
      >
        <LabelInput
          label="등록자ID"
          name="registerId"
          value={parameters.registerId}
          onChange={handleChange}
        />
        <LabelInput
          label="등록자명"
          name="registerName"
          value={parameters.registerName}
          onChange={handleChange}
        />
        <Stack direction="row" alignItems="center" colSpan={2}>
          <LabelInput
            type="dateTime"
            label="등록일시"
            name="registerStartDate"
            value={parameters.registerStartDate}
            onChange={handleDateChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="dateTime"
            name="registerEndDate"
            value={parameters.registerEndDate}
            onChange={handleDateChange}
          />
        </Stack>
        <CodeInput
          codeType="AUDIT_WORK_TYPE"
          label="업무구분"
          name="workType"
          value={parameters.workType}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default MonitoringLogSearchForm;
