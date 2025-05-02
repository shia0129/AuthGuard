import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import RejectionFiles from '@components/third-party/dropzone/RejectionFiles';
import PlaceholderContent from '@components/third-party/dropzone/PlaceholderContent';
import FilesBoardPreview from '@components/third-party/dropzone/FilesBoardPreview';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import fileApi from '@api/file/fileApi';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ==============================|| UPLOAD - MULTIPLE FILE ||============================== //
const MultiFileUpload = ({
  error,
  showList = false,
  fileList,
  setFileList,
  sx,
  onUpload,
  setDeleteFileList,
  download,
}) => {
  const { instance, source } = AuthInstance();

  fileApi.axios = instance;

  // API 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: true,
    maxSize: 1000000,
    onDrop: async (acceptedFiles) => {
      const filesName = acceptedFiles.map((file) => file.name);
      const result = await apiCall(fileApi.checkFilesExtension, filesName);

      if (result.status === 200) {
        const notAllowFiles = result.data;

        if (notAllowFiles.length) {
          openModal({
            message: `${notAllowFiles.join(', ')} 파일은 허용되지 않은 확장자입니다.`,
          });
        }

        setFileList(() => [
          ...fileList,
          ...acceptedFiles
            .filter((file) => !notAllowFiles.includes(file.name))
            .map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
            ),
        ]);
      }
    },
  });
  const onRemoveAll = () => {
    let deleteList = [];

    fileList.map((file) => {
      if (file.id !== undefined) {
        deleteList.push(file.id);
      }
    });

    setFileList([]);
    setDeleteFileList && setDeleteFileList(deleteList);
  };

  const onRemove = (file) => {
    const filteredItems = fileList && fileList.filter((_file) => _file !== file);

    setFileList(filteredItems);
    if (setDeleteFileList && file.id !== undefined) {
      setDeleteFileList((prev) => [...prev, file.id]);
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {download ? (
        ''
      ) : (
        <DropzoneWrapper
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter',
            }),
          }}
        >
          <input {...getInputProps()} />
          <PlaceholderContent />
        </DropzoneWrapper>
      )}

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {fileList && fileList.length > 0 && (
        <FilesBoardPreview
          files={fileList}
          showList={showList}
          onRemove={download ? () => {} : onRemove}
        />
      )}

      {fileList && fileList.length > 0 && !download && (
        <Stack direction="row">
          <Button color="secondary" size="small" variant="contained" onClick={onRemoveAll}>
            전체 삭제
          </Button>
        </Stack>
      )}
    </Box>
  );
};

MultiFileUpload.propTypes = {
  error: PropTypes.bool,
  showList: PropTypes.bool,
  files: PropTypes.array,
  setFieldValue: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
};

export default MultiFileUpload;
