import GridItem from '@components/modules/grid/GridItem';
import CodeInput from '@components/modules/input/CodeInput';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import { setParameters } from '@modules/redux/reducers/diskHis';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

function DiskHistorySearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.diskHis);
  const parameters = parameterData.parameters.current;

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
        divideColumn={4.5}
        spacing={2}
        sx={{
          pr: 20,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '170px', minWidth: '170px' },
        }}
      >
        <CodeInput
          codeType="SYSTEM_GROUP_TYPE"
          label="시스템그룹"
          name="sysgrpId"
          value={parameters.sysgrpId}
          onChange={handleChange}
        />

        <CodeInput
          codeType="SYSTEM_TYPE"
          label="시스템"
          name="systemId"
          value={parameters.systemId}
          onChange={handleChange}
        />

        <Stack colSpan={1.5} direction="row" alignItems="center">
          <LabelInput
            type="date1"
            label="점검 일시"
            name="startDate"
            sx={{ maxWidth: '140px', minWidth: '140px' }}
            value={parameters.startDate}
            onChange={handleDateChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="date1"
            name="endDate"
            sx={{ maxWidth: '140px', minWidth: '140px' }}
            value={parameters.endDate}
            onChange={handleDateChange}
          />
        </Stack>
      </GridItem>
    </SearchInput>
  );
}

export default DiskHistorySearchForm;
