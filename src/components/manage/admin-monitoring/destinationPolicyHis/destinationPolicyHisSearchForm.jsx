import { CloseOutlined, DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import Transitions from '@components/@extended/Transitions';
import GridItem from '@components/modules/grid/GridItem';
import CodeInput from '@components/modules/input/CodeInput';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import usePopup from '@modules/hooks/usePopup';
import { setParameters, setSearchOpenFlag } from '@modules/redux/reducers/destinationPolicyHis';
import { IconButton, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

function DestinationPolicyHisSearchForm() {
  const dispatch = useDispatch();
  const handleOpenWindow = usePopup();
  const parameterData = useSelector((state) => state.destinationPolicyHis);
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

  const resetUserValue = () => {
    dispatch(setParameters({ adminInfo: { seq: '', name: '' } }));
  };

  const handleOpenUserPopup = () => {
    handleOpenWindow({
      url: `${process.env.NEXT_PUBLIC_LOCATION_ORIGIN_URL}/manage/admin-monitoring/popup/adminList`,
      openName: 'UserListPopup',
      width: '1350',
      height: '600',
      dataSet: {
        setAdminInfo: ({ id, userName }) => {
          dispatch(setParameters({ adminInfo: { seq: id, name: userName } }));
        },
      },
    });
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '110px', minWidth: '110px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
        }}
      >
        <Stack direction="row" alignItems="center" colSpan={1.5}>
          <LabelInput
            type="dateTime"
            label="변경시간"
            name="requestStartDate"
            value={parameters.requestStartDate}
            onChange={handleDateChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="dateTime"
            name="requestEndDate"
            value={parameters.requestEndDate}
            onChange={handleDateChange}
          />
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <LabelInput
            label="작업자"
            InputProps={{ readOnly: true }}
            value={parameters.adminInfo.name}
          />
          <IconButton size="small" onClick={handleOpenUserPopup} className="IconBtn">
            <SearchOutlined />
          </IconButton>
          <IconButton
            size="small"
            onClick={resetUserValue}
            className="IconBtn"
            sx={{ marginRight: '10px !important' }}
          >
            <CloseOutlined />
          </IconButton>
        </Stack>
        <CodeInput
          codeType="POLICY_ACTION_STATUS"
          label="구분"
          name="controlFlag"
          value={parameters.controlFlag}
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
          divideColumn={4}
          spacing={2}
          sx={{
            pr: 5,
            pt: 2,
            '& .text': { maxWidth: '110px', minWidth: '110px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <CodeInput
            codeType="SYSTEM_GROUP_TYPE"
            label="시스템 그룹"
            name="systemGroupId"
            value={parameters.systemGroupId}
            onChange={handleChange}
          />
          <CodeInput
            codeType="SYSTEM_TYPE"
            label="시스템"
            name="systemId"
            value={parameters.systemId}
            onChange={handleChange}
          />

          <CodeInput
            codeType="SERVICE_METHOD"
            label="서비스 구분"
            name="svcMod"
            value={parameters.svcMod}
            onChange={handleChange}
          />

          <LabelInput
            label="목적지 IP"
            name="destIp"
            value={parameters.destIp}
            onChange={handleChange}
            maskOptions={{
              type: 'ipv4',
            }}
          />
          <LabelInput
            label="목적지 Port(From)"
            name="destPort"
            onlyNumber
            value={parameters.destPort}
            onChange={handleChange}
          />
          <CodeInput
            codeType="DESTINATION_HOST_TYPE"
            label="목적지 구분"
            name="destType"
            value={parameters.destType}
            onChange={handleChange}
          />

          <LabelInput
            label="포트 사용 설명"
            name="svcDesc"
            value={parameters.svcDesc}
            onChange={handleChange}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default DestinationPolicyHisSearchForm;
