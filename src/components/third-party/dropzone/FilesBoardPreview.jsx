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
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { useState } from 'react';

// ==============================|| MULTI UPLOAD - PREVIEW ||============================== //

export default function FilesBoardPreview({ showList = false, files, onRemove }) {
  const { instance, source } = AuthInstance();

  fileApi.axios = instance;

  const theme = useTheme();
  const hasFile = files.length > 0;

  // api 호출 함수, openModal 함수.
  const [apiCall] = useApi();

  // pdf 미리보기
  const [blobData, setBlobData] = useState('');
  const [popupFlag, setPopupFlag] = useState(false);
  const [blobFileNmae, setBlobFileName] = useState('');

  // 파일 다운로드
  const handleClick = async (fileKey, fileId) => {
    const result = await apiCall(fileApi.getBoardFile, fileId);

    if (result.status === 200) {
      let name = decodeURI(result.headers['content-disposition'].split('filename=')[1]).replace(
        /\+/g,
        ' ',
      ); // 파일 이름 추출.

      name = name.substring(1, name.length - 1);

      const contentType = result.headers['content-type'];

      const blob = new Blob([result.data], { type: contentType + ';charset=utf-8' }); // 파일 정보로 blob 객체 생성.
      const blobResultData = window.URL.createObjectURL(blob);

      setBlobData(blobResultData);
      setPopupFlag(true);
      setBlobFileName(name);

      FileSaver.saveAs(result.data, name); // 브라우저 파일 다운로드
    }
  };

  return (
    <List
      disablePadding
      sx={{
        ...(hasFile && { my: 1, '& li': {} }),
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
              {!type?.includes('image') && (
                <FileFilled style={{ width: '100%', fontSize: '1.5rem' }} />
              )}

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
              my: 0.2,
              mr: 0.5,
              px: 1,
              py: 0.3,
              borderRadius: 0.75,
              width: 'fit-content',
              display: 'inline-flex',
              border: (theme) => `solid 1px ${theme.palette.divider}`,
              '&:hover': {
                bgcolor: theme.palette.divider,
              },
            }}
          >
            <FileFilled style={{ fontSize: '1.15rem', marginRight: 4 }} />

            <ListItemText
              primary={typeof file === 'string' ? file : name}
              showsisecondary={typeof file === 'string' ? '' : size}
              primaryTypographyProps={{ variant: 'subtitle2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
              style={{ cursor: file.id !== undefined && 'pointer' }}
              onClick={() => {
                if (file.id !== undefined) {
                  handleClick(file.key, file.id);
                }
              }}
            />

            {onRemove.length ? (
              <>
                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                </IconButton>
                {popupFlag && blobFileNmae === file.name && (
                  <DocViewer documents={[{ uri: blobData }]} pluginRenderers={DocViewerRenderers} />
                )}
              </>
            ) : null}
          </ListItem>
        );
      })}
    </List>
  );
}

FilesBoardPreview.propTypes = {
  showList: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
};
