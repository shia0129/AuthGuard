import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslvpn/user';
import { useState } from 'react';

function UserSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.user);
  const parameters = parameterData.parameters.current;
  const zoneNameList = parameterData.zoneNameList;

  const [selectedZoneName, setSelectedZoneName] = useState(parameters.zoneName);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'zoneName':
        setSelectedZoneName(value);
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
        <LabelInput
          label="그룹명"
          name="groupName"
          value={parameters.groupName}
          onChange={handleChange}
        />
        <LabelInput
          label="설명"
          name="zoneDescr"
          value={parameters.zoneDescr}
          onChange={handleChange}
        />
        <LabelInput
          label="계정명"
          name="accountName"
          value={parameters.accountName}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="ZONE"
          name="zoneName"
          value={selectedZoneName}
          list={zoneNameList}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default UserSearchForm;
