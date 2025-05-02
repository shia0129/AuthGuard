import PropTypes from 'prop-types';

// material-ui
import { CardMedia, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import IconButton from '@components/@extended/IconButton';

// utils
import getDropzoneData from '@modules/utils/getDropzoneData';

// assets
import { CloseCircleFilled, FileFilled } from '@ant-design/icons';
import fileApi from '@api/file/fileApi';
import { AuthInstance } from '@modules/axios';
import FileSaver from 'file-saver';
import useApi from '@modules/hooks/useApi';

// ==============================|| MULTI UPLOAD - PREVIEW ||============================== //

export default function FilesPreview({ showList = false, files, onRemove }) {
  fileApi.axios = AuthInstance().instance;

  const theme = useTheme();
  const hasFile = files.length > 0;

  // api 호출 함수, openModal 함수.
  const [apiCall] = useApi();

  // 파일 다운로드
  const handleClick = async (fileId) => {
    const result = await apiCall(fileApi.getFile, fileId);

    if (result.status === 200) {
      let name = decodeURI(result.headers['content-disposition'].split('filename=')[1]).replace(
        /\+/g,
        ' ',
      ); // 파일 이름 추출.
      name = name.substring(1, name.length - 1);
      const contentType = result.headers['content-type']; // 파일 cotent-type

      const blob = new Blob([result.data], { type: contentType + ';charset=utf-8' }); // 파일 정보로 blob 객체 생성.
      FileSaver.saveAs(blob, name); // 브라우저 파일 다운로드
    }
  };

  return (
    <List
      disablePadding
      sx={{
        ...(hasFile && { my: 1 }),
        display: 'inline-flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '10px',
      }}
    >
      {files.map((file, index) => {
        const { key, name, size, preview, type } = getDropzoneData(file, index);
        if (showList) {
          return (
            <ListItem
              key={key}
              sx={{
                p: 0,
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                position: 'relative',
                display: 'inline-flex',
                verticalAlign: 'text-top',
                border: `solid 1px ${theme.palette.divider}`,
              }}
            >
              {type?.includes('image') && (
                <CardMedia component="img" src={preview} style={{ width: '100%' }} />
              )}
              {!type?.includes('image') && <FileFilled style={{ fontSize: '1.5rem' }} />}

              {onRemove && (
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => onRemove(file)}
                  sx={{
                    top: -10,
                    right: -10,
                    position: 'absolute',
                  }}
                >
                  <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                </IconButton>
              )}
            </ListItem>
          );
        }

        return (
          <ListItem
            key={key}
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: 0.75,
              border: (theme) => `solid 1px ${theme.palette.divider}`,
              width: 'auto',
            }}
          >
            <FileFilled style={{ fontSize: '1.15rem', marginRight: 10 }} />

            <ListItemText
              className="uploadName"
              primary={typeof file === 'string' ? file : name}
              secondary={typeof file === 'string' ? '' : size}
              primaryTypographyProps={{ variant: 'subtitle2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
              style={{ cursor: file.id !== undefined && 'pointer' }}
              onClick={() => {
                if (file.id !== undefined) {
                  handleClick(file.id);
                }
              }}
            />

            {onRemove && (
              <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
              </IconButton>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}

FilesPreview.propTypes = {
  showList: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
};
