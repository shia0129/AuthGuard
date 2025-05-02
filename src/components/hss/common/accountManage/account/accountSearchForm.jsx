import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/common/account';
import { useState } from 'react';

function AccountSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.account);
  const parameters = parameterData.parameters.current;
  const loginTypeList = parameterData.loginTypeList;

  const [selectedLoginType, setSelectedLoginType] = useState(parameters.loginType);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'loginType':
        setSelectedLoginType(value);
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
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput label="계정명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          label="그룹명"
          name="groupName"
          value={parameters.groupName}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="인증방식"
          name="loginType"
          value={selectedLoginType}
          list={loginTypeList}
          onChange={handleChange}
        />
        <LabelInput label="설명" name="descr" value={parameters.descr} onChange={handleChange} />
      </GridItem>
    </SearchInput>
  );
}

export default AccountSearchForm;
