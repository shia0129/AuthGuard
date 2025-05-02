import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/pattern/patternGroupUpdateStatus';

function PatternGroupUpdateStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.patternGroupUpdateStatus);
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
          '& .text': { maxWidth: '180px', minWidth: '180px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
        }}
      >
        <LabelInput label="정책명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput label="내용" name="value" value={parameters.value} onChange={handleChange} />
      </GridItem>
    </SearchInput>
  );
}

export default PatternGroupUpdateStatusSearchForm;
