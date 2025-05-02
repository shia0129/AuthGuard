import GridItem from '@components/modules/grid/GridItem';
import { Typography } from '@mui/material';

function LicenseUploadResult({ titleFlag }) {
  return (
    <>
      <GridItem item>
        <Typography fontWeight="fontWeightBold">파일 업로드 결과</Typography>
        {titleFlag ? <Typography>성공</Typography> : <Typography>대기 중</Typography>}
      </GridItem>
    </>
  );
}

export default LicenseUploadResult;
