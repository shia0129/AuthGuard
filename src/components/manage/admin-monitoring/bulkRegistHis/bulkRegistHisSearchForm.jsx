import GridItem from '@components/modules/grid/GridItem';
import CodeInput from '@components/modules/input/CodeInput';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import { setParameters } from '@modules/redux/reducers/bulkRegistHis';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

function BulkRegistSearchForm() {
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.bulkRegistHis);
  const parameters = parameterData.parameters.current;
  const comboList = parameterData.comboData;

  const handleChange = (event) => {
    dispatch(setParameters({ [event.target.name]: event.target.value }));
  };

  const handleDateChange = (_, value) => {
    const dateValue = value.date.format('YYYYMMDD');

    dispatch(setParameters({ [value.name]: dateValue }));
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '110px', minWidth: '110px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          '.CMM-li-inputArea-datePicker-textField': {
            maxWidth: '150px',
            minWidth: '150px',
            zIndex: 10,
          },
        }}
      >
        <Stack direction="row" alignItems="center">
          <LabelInput
            type="date1"
            label="요청시간"
            name="requestStartDate"
            value={parameters.requestStartDate}
            onChange={handleDateChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="date1"
            name="requestEndDate"
            value={parameters.requestEndDate}
            onChange={handleDateChange}
          />
        </Stack>

        <CodeInput
          label="작업구분"
          name="controlFlag"
          value={parameters.controlFlag}
          onChange={handleChange}
        />

        <CodeInput
          codeType=""
          label="진행구분"
          name="statusDivision"
          value={parameters.statusDivision}
          onChange={handleChange}
        />

        <LabelInput
          label="작업자명"
          name="workerName"
          value={parameters.workerName}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default BulkRegistSearchForm;
