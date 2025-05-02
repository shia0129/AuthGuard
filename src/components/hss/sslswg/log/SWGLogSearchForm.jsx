import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import SearchInput from '@components/modules/input/SearchInput';
import LabelInput from '@components/modules/input/LabelInput';

import { setParameters } from '@modules/redux/reducers/hss/common/log';

function SWGLogSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.log);
  const parameters = parameterData.parameters.current;
  const segmentNameList = parameterData.segmentNameList;

  const handleChange = (event, validValue = null) => {
    let value = validValue === null ? event.target.value : validValue;
    if (event instanceof PointerEvent) {
      value = event.target.value;
    }

    dispatch(setParameters({ [event.target.name]: value }));
  };

  const handleDateChange = (_, value) => {
    let dateValue = '';
    if (value.date !== null) {
      dateValue = value.date.format('YYYY-MM-DD');
    }

    dispatch(setParameters({ [value.name]: dateValue }));
  };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={3}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput
          type="select"
          label="SSL VA<br/>[세그먼트]"
          name="segmentName"
          list={segmentNameList}
          value={parameters.segmentName}
          onChange={handleChange}
        />
        <LabelInput
          type="dateTime"
          label="검색 일시"
          name="searchDate"
          inputFormat="YYYY-MM-DD"
          views={['year', 'month', 'day']}
          value={parameters.searchDate}
          onChange={handleDateChange}
        />
        <LabelInput
          label="검색 문자열"
          name="searchString"
          value={parameters.searchString}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default SWGLogSearchForm;
