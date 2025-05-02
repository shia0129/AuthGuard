import { DownOutlined, UpOutlined } from '@ant-design/icons';
import Transitions from '@components/@extended/Transitions';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import { setParameters } from '@modules/redux/reducers/adminBlock';
import { IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AdminBlockSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.adminBlock);
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
          '.inputBox': { maxWidth: '190px', minWidth: '190px' },
          '.CMM-li-inputArea-datePicker-textField': { maxWidth: '190px', minWidth: '190px' },
        }}
      >
        <LabelInput
          label="관리자 ID"
          name="blockUserId"
          value={parameters.blockUserId}
          onChange={handleChange}
        />
        <LabelInput
          label="관리자명"
          name="blockUserName"
          value={parameters.blockUserName}
          onChange={handleChange}
        />
        <Stack colSpan={1.8} direction="row" alignItems="center">
          <LabelInput
            type="date1"
            label="차단 시간"
            name="blockStartTime"
            value={parameters.blockStartTime}
            onChange={handleDateChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="date1"
            name="blockEndTime"
            value={parameters.blockEndTime}
            onChange={handleDateChange}
          />
        </Stack>
        <LabelInput
          type="select"
          label="차단유형"
          name="blockType"
          value={parameters.blockType}
          onChange={handleChange}
          list={comboList?.BLOCK_TYPE || []}
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
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '190px', minWidth: '190px' },
          }}
        >
          <LabelInput
            type="select"
            label="해제 유형"
            name="releaseType"
            value={parameters.releaseType}
            onChange={handleChange}
            list={comboList?.RELASE_TYPE || []}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default AdminBlockSearchForm;
