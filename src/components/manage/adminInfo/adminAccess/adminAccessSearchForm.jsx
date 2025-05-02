import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters, setSearchOpenFlag } from '@modules/redux/reducers/adminAccess';
import { IconButton, Stack } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import Transitions from '@components/@extended/Transitions';
import CodeInput from '@components/modules/input/CodeInput';

function AdminAccessSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.adminAccess);
  const parameters = parameterData.parameters.current;

  const searchOpenFlag = parameterData.searchOpenFlag;

  const handleClickSearchOpen = () => {
    dispatch(setSearchOpenFlag(!searchOpenFlag));
  };

  const handleChange = (event) => {
    dispatch(setParameters({ [event.target.name]: event.target.value }));
  };

  const handleDateChange = (_, value) => {
    const dateValue = value.date.format('YYYYMMDD');

    dispatch(setParameters({ [value.name]: dateValue }));
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={5}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '170px', minWidth: '170px' },
        }}
      >
        <CodeInput
          codeType="ACC_RESULT"
          label="접속 결과"
          name="accessResult"
          value={parameters.accessResult}
          onChange={handleChange}
        />

        <CodeInput
          codeType="ACC_STATUS"
          label="접속 상태"
          name="accessStatus"
          value={parameters.accessStatus}
          onChange={handleChange}
        />

        <CodeInput
          codeType="FAIL_CODE"
          label="접속 실패 유형"
          name="failCode"
          value={parameters.failCode}
          onChange={handleChange}
        />

        <Stack direction="row" alignItems="center">
          <LabelInput
            type="date1"
            label="접속 시간"
            name="startDate"
            sx={{ maxWidth: '150px', minWidth: '150px' }}
            value={parameters.startDate}
            onChange={handleDateChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="date1"
            name="endDate"
            sx={{ maxWidth: '150px', minWidth: '150px' }}
            value={parameters.endDate}
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
          divideColumn={5}
          spacing={2}
          sx={{
            pr: 5,
            pt: 2,
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '170px', minWidth: '170px' },
          }}
        >
          <LabelInput
            label="관리자 ID"
            name="adminId"
            value={parameters.destinationIP}
            onChange={handleChange}
          />
          <LabelInput
            label="관리자명"
            name="adminName"
            value={parameters.destinationPortFrom}
            onChange={handleChange}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default AdminAccessSearchForm;
