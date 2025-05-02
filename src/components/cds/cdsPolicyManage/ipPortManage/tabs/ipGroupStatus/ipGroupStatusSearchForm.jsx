import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import CodeInput from '@components/modules/input/CodeInput';
import { setParameters } from '@modules/redux/reducers/ipGroupStatus';

function IpGroupStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.ipGroupStatus);
  const parameters = parameterData.parameters.current;

  const handleChange = (event) => {
    dispatch(setParameters({ [event.target.name]: event.target.value }));
  };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={3}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '150px', minWidth: '150px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
        }}
      >
        <CodeInput
          codeType="LOCATION"
          label="위치"
          name="location"
          value={parameters.location}
          onChange={handleChange}
        />
        <LabelInput label="객체명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput label="설명" name="remark" value={parameters.remark} onChange={handleChange} />
      </GridItem>
    </SearchInput>
  );
}

export default IpGroupStatusSearchForm;
