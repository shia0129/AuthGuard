import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/time/timeStatus';
// import { Stack } from '@mui/material';

function TimeStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.timeStatus);
  const parameters = parameterData.parameters.current;

  const handleChange = (event, validValue = null) => {
    let value = validValue === null ? event.target.value : validValue;
    if (event instanceof PointerEvent) {
      value = event.target.value;
    }

    dispatch(setParameters({ [event.target.name]: value }));
  };

  // const handleDaysChange = (event) => {
  //   const { value, checked } = event.target;
  //   const day = value.toString();

  //   const currentDays = Array.isArray(parameters.days) ? parameters.days : [];

  //   let newDays;
  //   if (checked) {
  //     newDays = [...currentDays, day].sort();
  //   } else {
  //     newDays = currentDays.filter((d) => d !== day);
  //   }

  //   dispatch(setParameters({ days: newDays }));

  //   console.log('Updated days:', newDays);
  // };

  // const handleTimeChange = (_, value) => {
  //   const timeValue = value.date.format('HH:mm');
  //   dispatch(setParameters({ [value.name]: timeValue }));
  // };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={1}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput label="정책명" name="name" value={parameters.name} onChange={handleChange} />

        {/* <LabelInput
          type="checkbox"
          label="적용 요일"
          name="days"
          list={[
            { value: '0', label: '월' },
            { value: '1', label: '화' },
            { value: '2', label: '수' },
            { value: '3', label: '목' },
            { value: '4', label: '금' },
            { value: '5', label: '토' },
            { value: '6', label: '일' },
          ]}
          onChange={handleDaysChange}
        />
        <Stack direction="row" alignItems="center">
          <LabelInput
            type="time1"
            label="접속 시간"
            name="startTime"
            value={parameters.startTime}
            views={['hours', 'minutes']}
            inputFormat="HH:mm"
            onChange={handleTimeChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="time1"
            name="endTime"
            value={parameters.endTime}
            views={['hours', 'minutes']}
            inputFormat="HH:mm"
            onChange={handleTimeChange}
          />
        </Stack> */}
      </GridItem>
    </SearchInput>
  );
}

export default TimeStatusSearchForm;
