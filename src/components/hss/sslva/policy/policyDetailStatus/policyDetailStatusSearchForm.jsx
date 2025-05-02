import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslva/policyDetailStatus';

function PolicyDetailStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.policyDetailStatus);
  const parameters = parameterData.parameters.current;
  const protocolTypeList = parameterData.protocolTypeList;

  const handleChange = (event, validValue = null) => {
    let value = validValue === null ? event.target.value : validValue;
    if (event instanceof PointerEvent) {
      value = event.target.value;
    }

    dispatch(setParameters({ [event.target.name]: value }));
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
        <LabelInput label="정책명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          type="select"
          label="정책 모드"
          name="proxyType"
          list={[
            { label: 'Forward', value: '0' },
            { label: 'Reverse', value: '1' },
          ]}
          value={parameters.proxyType}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="프로토콜"
          name="protocolTypeId"
          list={protocolTypeList}
          value={parameters.protocolTypeId}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default PolicyDetailStatusSearchForm;
