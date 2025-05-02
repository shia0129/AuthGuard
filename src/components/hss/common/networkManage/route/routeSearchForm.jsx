import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import { setParameters, setSearchOpenFlag } from '@modules/redux/reducers/hss/common/route';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

function RouteSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.route);
  const parameters = parameterData.parameters.current;

  const typeList = parameterData.typeList;
  // const interfaceNameList = parameterData.interfaceNameList;

  const searchOpenFlag = parameterData.searchOpenFlag;
  const handleClickSearchOpen = () => {
    dispatch(setSearchOpenFlag(!searchOpenFlag));
  };

  // const [selectedRoute, setSelectedRoute] = useState(parameters.name);
  const [selectedType, setSelectedType] = useState(parameters.type);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'name':
        // setSelectedRoute(value);
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
        <LabelInput label="이름" name="name" value={parameters.name} onChange={handleChange} />
        {/* <LabelInput
          type="select"
          label="인터페이스명"
          name="dev"
          value={selectedRoute}
          list={interfaceNameList}
          onChange={handleChange}
        /> */}
        <LabelInput
          type="select"
          label="타입"
          name="type"
          value={selectedType}
          list={typeList}
          onChange={handleChange}
        />
        <LabelInput
          label="목적지"
          name="target"
          value={parameters.target}
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
            label="넷마스크"
            name="netmask"
            value={parameters.netmask}
            onChange={handleChange}
          />
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

export default RouteSearchForm;
