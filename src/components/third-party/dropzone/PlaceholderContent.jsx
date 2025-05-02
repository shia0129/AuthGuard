// material-ui
import { Typography, Stack, CardMedia } from '@mui/material';

// assets
const UploadCover = '/assets/images/upload/upload.svg';

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

export default function PlaceholderContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      <CardMedia component="img" image={UploadCover} sx={{ width: 65 }} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <Typography variant="h5">첨부파일 Drag & Drop</Typography>

        <Typography color="secondary">업로드 파일을 클릭하여 선택하거나 Drag & Drop.</Typography>
      </Stack>
    </Stack>
  );
}
