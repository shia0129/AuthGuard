import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';

function PolicyFileUpload({ onChangeFileList }) {
  const [fileName, setFileName] = useState('');

  const handleChangeUploadFile = (event) => {
    const { files } = event.target;

    const fileList = Array.from(files);
    const fileName = fileList.map((file) => file.name).join(', ');

    onChangeFileList(fileList);
    setFileName(fileName);
    event.target.value = '';
  };

  const handleClickCancelButton = () => {
    onChangeFileList([]);
    setFileName('');
  };

  return (
    <>
      <GridItem item>
        <Typography fontWeight="fontWeightBold">업로드파일</Typography>
      </GridItem>
      <GridItem borderFlag container item divideColumn={1}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <LabelInput
            labelBackgroundFlag
            name="fileName"
            value={fileName}
            label="업로드파일"
            inputProps={{ readOnly: true }}
            labelSx={{ width: '300px' }}
            stacksx={{ width: '100%' }}
            sx={{ width: '100%' }}
          />
          <input
            accept=".xls, .xlsx"
            id="icon-button-file"
            multiple
            type="file"
            style={{ display: 'none' }}
            onChange={handleChangeUploadFile}
          />
          <label htmlFor="icon-button-file">
            <IconButton size="small" className="IconBtn" component="span">
              <SearchOutlined />
            </IconButton>
          </label>

          <IconButton
            sx={{ mr: `8px !important` }}
            size="small"
            className="IconBtn"
            onClick={handleClickCancelButton}
          >
            <CloseOutlined />
          </IconButton>
        </Stack>
      </GridItem>
    </>
  );
}

export default PolicyFileUpload;
