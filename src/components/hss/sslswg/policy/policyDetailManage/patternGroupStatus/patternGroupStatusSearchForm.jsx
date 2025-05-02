import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/pattern/patternGroupStatus';

function PatternGroupStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.patternGroupStatus);
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
        divideColumn={2}
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
          label="유형"
          name="type"
          value={parameters.type || ''}
          list={[
            { label: 'HEADER', value: 'regexpheader' },
            { label: 'PAYLOAD', value: 'regexppayload' },
            { label: 'URL', value: 'regexpurl' },
          ]}
          onChange={handleChange}
        />
        {/* <LabelInput
          type="select"
          label="처리 방식"
          name="action"
          value={parameters.action || ''}
          list={[
            { label: '차단', value: '0' },
            { label: '허용', value: '1' },
          ]}
          onChange={handleChange}
        /> */}
      </GridItem>
    </SearchInput>
  );
}

export default PatternGroupStatusSearchForm;
