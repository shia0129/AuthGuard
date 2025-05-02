import { useDispatch, useSelector } from 'react-redux';
import { setParameters, setSearchOpenFlag } from '@modules/redux/reducers/serviceRefusalHistory';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import { IconButton, Stack } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import CodeInput from '@components/modules/input/CodeInput';

function ServiceRefusalSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.serviceRefusalHistory);
  const parameters = parameterData.parameters.current;
  const searchOpenFlag = parameterData.searchOpenFlag;

  const handleClickSearchOpen = () => {
    dispatch(setSearchOpenFlag(!searchOpenFlag));
  };

  const handleChange = (event, validValue = null) => {
    let value = validValue === null ? event.target.value : validValue;
    if (event instanceof PointerEvent) {
      value = event.target.value;
    }

    dispatch(setParameters({ [event.target.name]: value }));
  };

  const handleDateChange = (_, value) => {
    const dateValue = value.date.format('YYYY-MM-DD HH:mm:ss');

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
        <CodeInput
          codeType="SYSTEM_GROUP_TYPE"
          label="시스템그룹"
          name="sysgrpId"
          value={parameters.sysgrpId}
          onChange={handleChange}
        />

        <CodeInput
          codeType="SYSTEM_TYPE"
          label="시스템"
          name="systemId"
          value={parameters.systemId}
          onChange={handleChange}
        />

        <Stack direction="row" alignItems="center" colSpan={2} spacing={2}>
          <LabelInput
            type="dateTime"
            label="작업시간"
            name="workStartTime"
            value={parameters.workStartTime}
            onChange={handleDateChange}
          />
          &nbsp;&nbsp;&nbsp;~
          <LabelInput
            type="dateTime"
            name="workEndTime"
            value={parameters.workEndTime}
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
            label="출발지 IP"
            name="srcIp"
            value={parameters.srcIp}
            onChange={handleChange}
            maskOptions={{ type: 'ipv4' }}
          />
          <LabelInput
            label="출발지 Port"
            name="srcPort"
            onlyNumber
            value={parameters.srcPort}
            onChange={handleChange}
          />
          <LabelInput
            label="목적지 IP"
            name="destIp"
            value={parameters.destIp}
            onlyNumber
            onChange={handleChange}
            maskOptions={{ type: 'ipv4' }}
          />
          <LabelInput
            label="목적지 Port"
            name="destPort"
            onlyNumber
            value={parameters.destPort}
            onChange={handleChange}
          />
          <CodeInput
            codeType="PROTOCOL_TYPE"
            label="프로토콜"
            name="protocol"
            value={parameters.protocol}
            onChange={handleChange}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default ServiceRefusalSearchForm;
