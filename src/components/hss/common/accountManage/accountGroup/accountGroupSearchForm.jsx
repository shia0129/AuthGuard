import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/common/accountGroup';

function AccountGroupSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.accountGroup);
  const parameters = parameterData.parameters.current;

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    dispatch(setParameters({ [name]: value }));
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
        <LabelInput label="설명" name="descr" value={parameters.descr} onChange={handleChange} />
      </GridItem>
    </SearchInput>
  );
}

export default AccountGroupSearchForm;
