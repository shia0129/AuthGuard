import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import SearchInput from '@components/modules/input/SearchInput';
import LabelInput from '@components/modules/input/LabelInput';

import { setParameters } from '@modules/redux/reducers/hss/common/log';

function SYSTEMLogSearchForm() {
    const dispatch = useDispatch();

    const parameterData = useSelector((state) => state.log);
    const parameters = parameterData.parameters.current;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        dispatch(setParameters({ [name]: value }));
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

export default SYSTEMLogSearchForm;