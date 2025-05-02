import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import {
  setParameters,
  setSearchOpenFlag,
} from '@modules/redux/reducers/hss/common/interfaceModule';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

function InterfaceSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.interfaceModule);
  const parameters = parameterData.parameters.current;
  const typeList = parameterData.interfaceTypeList;
  const interfaceNameList = parameterData.interfaceNameList;

  const searchOpenFlag = parameterData.searchOpenFlag;
  const handleClickSearchOpen = () => {
    dispatch(setSearchOpenFlag(!searchOpenFlag));
  };

  const [selectedInterface, setSelectedInterface] = useState(parameters.name);
  const [selectedType, setSelectedType] = useState(parameters.type);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'name':
        setSelectedInterface(value);
        break;
      case 'type':
        setSelectedType(value);
        break;
      default:
        break;
    }

    dispatch(setParameters({ [name]: value }));
  };

  return (
    <SearchInput>
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
          type="select"
          label="인터페이스명"
          name="name"
          value={selectedInterface}
          list={interfaceNameList}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="타입"
          name="type"
          value={selectedType}
          list={typeList}
          onChange={handleChange}
        />
        <LabelInput label="IP 주소" name="ip" value={parameters.ip} onChange={handleChange} />
        <LabelInput
          label="서브넷 마스크"
          name="subnet"
          value={parameters.subnet}
          onChange={handleChange}
        />
      </GridItem>
      <IconButton
        aria-label="delete"
        size="small"
        sx={{
          position: 'absolute',
          right: 10,
          top: '15px',
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
        onClick={handleClickSearchOpen}
      >
        {searchOpenFlag ? <UpOutlined fontSize="small" /> : <DownOutlined fontSize="small" />}
      </IconButton>
      <Transitions type="collapse" in={searchOpenFlag}>
        <GridItem
          container
          divideColumn={4}
          spacing={2}
          sx={{
            pr: 5,
            pt: 2,
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '180px', minWidth: '180px' },
          }}
        >
          <LabelInput
            label="게이트웨이"
            name="gateway"
            value={parameters.gateway}
            onChange={handleChange}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default InterfaceSearchForm;
