import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslva/policyGroupStatus';
import { useState } from 'react';

function PolicyGroupStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.vaPolicyGroupStatus);
  const parameters = parameterData.parameters.current;
  const segmentNameList = parameterData.segmentNameList;

  const [selectedSegmentName, setSelectedSegmentName] = useState(parameters.segmentName);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'segmentName':
        setSelectedSegmentName(value);
        break;
      default:
        break;
    }

    dispatch(setParameters({ [name]: value }));
  };

  return (
    <SearchInput>
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
        <LabelInput label="그룹명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          type="select"
          label="세그먼트명"
          name="segmentName"
          value={selectedSegmentName}
          list={segmentNameList}
          onChange={handleChange}
        />
        <LabelInput
          label="정책명"
          name="detailName"
          value={parameters.detailName}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default PolicyGroupStatusSearchForm;
