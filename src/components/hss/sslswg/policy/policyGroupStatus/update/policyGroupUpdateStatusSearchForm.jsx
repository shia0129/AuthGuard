import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/policyGroupUpdateStatus';

function PolicyGroupUpdateStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.swgPolicyGroupUpdateStatus);
  const parameters = parameterData.parameters.current;

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
          '& .text': { maxWidth: '180px', minWidth: '180px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
        }}
      >
        <LabelInput label="정책명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          type="select"
          label="타입"
          name="type"
          list={[
            { label: '사이트', value: 'site' },
            { label: '패턴', value: 'pattern' },
            { label: '출발지IP', value: 'srcip' },
          ]}
          value={parameters.type || ''}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="정책 유형"
          name="level"
          value={parameters.level || ''}
          list={[
            { label: '개별', value: '1' },
            { label: '그룹', value: '2' },
          ]}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default PolicyGroupUpdateStatusSearchForm;
