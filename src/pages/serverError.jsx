// next
import Image from 'next/image';
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project import
import Page from '@components/mantis/Page';
import Layout from '@components/layouts';
import { useSession } from 'next-auth/react';

// assets
const error500 = '/assets/images/maintenance/Error500.png';

// ==============================|| ERROR 500 - MAIN ||============================== //
const myLoader = ({ src }) => {
  return src; // 정적 경로 그대로 반환
};
function Error500() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: session } = useSession();

  const firstPage = session?.user.firstPage || '';

  return (
    <Page title="500">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <Box sx={{ width: { xs: 350, sm: 396 } }}>
            <Image
              loader={myLoader}
              unoptimized
              src={error500}
              alt="mantis"
              layout="fixed"
              width={matchDownSM ? 350 : 396}
              height={matchDownSM ? 325 : 370}
              priority
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center">
            <Typography align="center" variant={matchDownSM ? 'h2' : 'h1'}>
              Internal Server Error
            </Typography>
            <Typography color="textSecondary" variant="body1" align="center">
              500 서버에러, 잠시 후 다시 시도해주시기 바랍니다.
            </Typography>
            <NextLink href={firstPage} passHref>
              <Button variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
                첫 페이지로
              </Button>
            </NextLink>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
}

Error500.getLayout = function getLayout(page) {
  return <Layout variant="blank">{page}</Layout>;
};

export default Error500;
