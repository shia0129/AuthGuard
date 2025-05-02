import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import CodeInput from '@components/modules/input/CodeInput';
import { setParameters } from '@modules/redux/reducers/ipStatus';
import { IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

function IpStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.ipStatus);
  const parameters = parameterData.parameters.current;

  const [searchOpenFlag, setSearchOpenFlag] = useState(false);

  const handleClickSearchOpen = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };

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
        <CodeInput
          codeType="LOCATION"
          label="위치"
          name="location"
          value={parameters.location}
          onChange={handleChange}
        />
        <LabelInput label="객체명" name="name" value={parameters.name} onChange={handleChange} />
        <CodeInput
          codeType="DIVISION"
          label="구분"
          name="hostType"
          value={parameters.hostType}
          onChange={handleChange}
        />
        <LabelInput
          label="IP 대역"
          name="ipLength"
          placeholder="1~32"
          inputProps={{ maxLength: 2 }}
          maxValue={32}
          minValue={1}
          onlyNumber
          value={parameters.ipLength}
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
            label="IP"
            name="ipAddress"
            inputProps={{ maxLength: 15 }}
            value={parameters.ipAddress}
            onChange={handleChange}
          />
          <LabelInput
            label="설명"
            name="remark"
            value={parameters.remark}
            onChange={handleChange}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default IpStatusSearchForm;
