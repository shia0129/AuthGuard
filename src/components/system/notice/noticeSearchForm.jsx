import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setParameters } from '@modules/redux/reducers/notice';
import AdminModal from '@components/modal/system/notice/adminModal';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack, IconButton } from '@mui/material';
import { CloseOutlined, SearchOutlined } from '@mui/icons-material';

function NoticeSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.notice);
  const parameters = parameterData.parameters.current;

  const [adminModalFlag, setAdminModalFlag] = useState(false);

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
          '& .text': { maxWidth: '100px', minWidth: '100px' },
          '.inputBox': { maxWidth: '150px', minWidth: '150px' },
        }}
      >
        <Stack direction="row" alignItems="center" colSpan={1.5}>
          <LabelInput
            type="date1"
            label="게시일"
            name="boardStartDate"
            sx={{ maxWidth: '150px', minWidth: '150px' }}
            value={parameters.boardStartDate}
            onChange={handleDateChange}
          />
          &nbsp;~&nbsp;
          <LabelInput
            type="date1"
            name="boardEndDate"
            sx={{ maxWidth: '150px', minWidth: '150px' }}
            value={parameters.boardEndDate}
            onChange={handleDateChange}
          />
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <LabelInput
            label="등록자명"
            name="userName"
            sx={{ minWidth: '140px !important', maxWidth: '140px !important' }}
          />
          <IconButton size="small" onClick={() => setAdminModalFlag(true)} className="IconBtn">
            <SearchOutlined />
          </IconButton>
          <IconButton size="small" className="IconBtn" sx={{ marginRight: '10px !important' }}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <LabelInput
          label="검색어"
          name="boardSearchWord"
          value={parameters.boardSearchWord}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="사용구분"
          value={parameters.boardUseYn}
          onChange={handleChange}
          name="boardUseYn"
          list={[
            { value: '0', label: '사용안함' },
            { value: '1', label: '사용' },
          ]}
        />
      </GridItem>

      {adminModalFlag && <AdminModal alertOpen={adminModalFlag} setModalOpen={setAdminModalFlag} />}
    </SearchInput>
  );
}

export default NoticeSearchForm;
