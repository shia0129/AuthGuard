import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/blackListStatus';

function BlackListStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.blackListStatus);
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
        <LabelInput label="내용" name="value" value={parameters.value} onChange={handleChange} />
        <LabelInput
          type="select"
          label="유형"
          name="type"
          value={parameters.type}
          list={[
            { label: '도메인', value: 'site' },
            { label: 'URL', value: 'url' },
          ]}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="활성화 여부"
          name="enabled"
          value={parameters.enabled}
          list={[
            { label: '활성화', value: 1 },
            { label: '비활성화', value: 0 },
          ]}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default BlackListStatusSearchForm;
