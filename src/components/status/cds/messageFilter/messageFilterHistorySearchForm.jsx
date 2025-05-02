import { DownOutlined, UpOutlined } from '@ant-design/icons';
import Transitions from '@components/@extended/Transitions';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import { setParameters, setSearchOpenFlag } from '@modules/redux/reducers/messageFilterHis';
import { IconButton, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

function MessageFilterHistorySearchForm() {
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.messageFilterHis);
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
    const dateValue = value.date.format('YYYYMMDD');

    dispatch(setParameters({ [value.name]: dateValue }));
  };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '110px', minWidth: '110px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          '.CMM-li-inputArea-datePicker-textField': { maxWidth: '150px', minWidth: '150px' },
        }}
      >
        <LabelInput
          label="정책 명"
          name="policyName"
          value={parameters.policyName}
          onChange={handleChange}
        />
        <LabelInput
          label="시스템 ID"
          name="systemId"
          value={parameters.systemId}
          onChange={handleChange}
        />
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
      </GridItem>
      <IconButton
        aria-label="delete"
        size="small"
        sx={{
          position: 'absolute',
          right: 10,
          top: '30px',
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
          divideColumn={4}
          spacing={2}
          sx={{
            pr: 5,
            pt: 2,
            '& .text': { maxWidth: '110px', minWidth: '110px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <LabelInput
            label="목적지 IP"
            name="destIp"
            value={parameters.destIp}
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
          <Stack direction="row" alignItems="center" colSpan={2}>
            <LabelInput
              type="date1"
              label="작업 시간"
              name="startDate"
              value={parameters.startDate}
              onChange={handleDateChange}
            />
            &nbsp;~&nbsp;
            <LabelInput
              type="date1"
              name="endDate"
              value={parameters.endDate}
              onChange={handleDateChange}
            />
          </Stack>
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default MessageFilterHistorySearchForm;
