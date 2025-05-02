import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import { Stack, IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { setParameters } from '@modules/redux/reducers/transBlock';

function BlockSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.transBlock);
  const parameters = parameterData.parameters.current;
  const comboList = parameterData.comboData;

  const [searchOpenFlag, setSearchOpenFlag] = useState(false);

  const handleClickSearchOpen = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };

  const handleChange = (event) => {
    dispatch(setParameters({ [event.target.name]: event.target.value }));
  };

  const handleDateChange = (_, value) => {
    const dateValue = value.date.format('YYYYMMDDHHmmss');

    dispatch(setParameters({ [value.name]: dateValue }));
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '150px', minWidth: '150px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
        }}
      >
        <LabelInput
          type="select"
          label="시스템그룹"
          name="sysgrpId"
          value={parameters.sysgrpId}
          onChange={handleChange}
          list={comboList.SYSTEM_GROUP_TYPE}
        />
        <LabelInput
          type="select"
          label="시스템"
          name="systemId"
          value={parameters.systemId}
          onChange={handleChange}
          list={comboList.SYSTEM_TYPE}
        />
        <Stack direction="row" alignItems="center" colSpan={2} spacing={2}>
          <LabelInput
            type="dateTime"
            label="차단시간"
            name="svcStartTime"
            value={parameters.svcStartTime}
            onChange={handleDateChange}
          />
          &nbsp;&nbsp;&nbsp;~
          <LabelInput
            type="dateTime"
            name="svcEndTime"
            value={parameters.svcEndTime}
            onChange={handleDateChange}
          />
        </Stack>
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
            pt: 2,
            pr: 5,
            '& .text': { maxWidth: '150px', minWidth: '150px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <LabelInput
            type="select"
            label="방향"
            name="boundType"
            value={parameters.boundType}
            onChange={handleChange}
            list={comboList.BOUND_TYPE}
          />
          <LabelInput
            label="출발지 IP"
            name="srcIp"
            value={parameters.srcIp}
            onChange={handleChange}
          />
          <LabelInput
            label="출발지 Port"
            name="srcPort"
            value={parameters.srcPort}
            onChange={handleChange}
          />

          <LabelInput
            label="목적지 IP"
            name="dstIp"
            value={parameters.dstIp}
            onChange={handleChange}
          />
          <LabelInput
            label="목적지 Port"
            name="dstPort"
            value={parameters.dstPort}
            onChange={handleChange}
          />
          <LabelInput
            type="select"
            label="프로토콜 타입"
            name="ipProto"
            value={parameters.ipProto}
            onChange={handleChange}
            list={comboList.PROTOCOL_TYPE}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default BlockSearchForm;
