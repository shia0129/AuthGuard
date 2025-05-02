import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslvpn/zone';
import { useState } from 'react';

function ZoneSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.zone);
  const parameters = parameterData.parameters.current;

  const [selectedEnabledType, setSelectedEnabledType] = useState(parameters.enabled);

  const handleChange = (event = null) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'enabled':
        setSelectedEnabledType(value);
        break;
      default:
        break;
    }

    dispatch(setParameters({ [name]: value }));
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
        <LabelInput label="ZONE" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          label="설명"
          name="description"
          value={parameters.description}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="상태"
          name="enabled"
          value={selectedEnabledType || ''}
          list={[
            { label: 'START', value: '1' },
            { label: 'STOP', value: '0' },
          ]}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default ZoneSearchForm;
