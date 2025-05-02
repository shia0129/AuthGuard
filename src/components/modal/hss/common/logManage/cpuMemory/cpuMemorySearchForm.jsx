import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack } from '@mui/material';
import { setParameters } from '@modules/redux/reducers/hss/common/cpuMemory';

function CpuMemorySearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.cpuMemory);
  const parameters = parameterData.parameters.current;

  const zoneNameList = parameterData.zoneNameList;
  const [selectedZoneName, setSelectedZoneName] = useState(parameters.zoneName);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'zoneName':
        setSelectedZoneName(value);
        break;
      default:
        break;
    }

    dispatch(setParameters({ [name]: value }));
  };

  const handleDateChange = (_, value) => {
    const dateValue = value.date.format('YYYYMMDD');

    dispatch(setParameters({ [value.name]: dateValue }));
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={2.5}
        spacing={2}
        sx={{
          pr: 20,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '170px', minWidth: '170px' },
        }}
      >
        <LabelInput
          type="select"
          label="시스템"
          name="zoneName"
          value={selectedZoneName}
          list={zoneNameList}
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

export default CpuMemorySearchForm;
