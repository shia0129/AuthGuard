import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/portStatus';

function PortStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.portStatus);
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
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput label="객체명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          label="Port"
          name="startPort"
          onlyNumber
          value={parameters.startPort}
          onChange={handleChange}
        />
        <LabelInput label="설명" name="remark" value={parameters.remark} onChange={handleChange} />
      </GridItem>
    </SearchInput>
  );
}

export default PortStatusSearchForm;
