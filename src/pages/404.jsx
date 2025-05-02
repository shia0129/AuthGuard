// next
import Image from 'next/image';
import NextLink from 'next/link';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import Layout from '@components/layouts';
import Page from '@components/mantis/Page';
import { useSession } from 'next-auth/react';
// assets
const error404 = '/assets/images/maintenance/Error404.png';

// ==============================|| ERROR 404 - MAIN ||============================== //
// test
const myLoader = ({ src }) => {
  return src; // 정적 경로 그대로 반환
};
function Error404() {
  const { data: session } = useSession();

  const firstPage = session?.user.firstPage || '';

  return (
    <Page title="404">
      <Grid
        container
        spacing={10}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', pt: 1.5, pb: 1, overflow: 'hidden' }}
      >
        <Grid item xs={12}>
          <Stack direction="row">
            <Grid
              item
              sx={{
                position: 'relative',
                width: { xs: 250, sm: 590 },
                height: { xs: 130, sm: 300 },
              }}
            >
              <Image
                loader={myLoader}
                unoptimized
                src={error404}
                alt="mantis"
                layout="fill"
                priority
              />
            </Grid>
            <Grid item sx={{ position: 'relative' }} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h1">Page Not Found</Typography>
            <Typography color="textSecondary" align="center">
              페이지가 존재하지 않습니다.
            </Typography>
            <NextLink href={firstPage} passHref>
              <Button variant="contained">첫 페이지로</Button>
            </NextLink>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
}

Error404.getLayout = function getLayout(page) {
  return <Layout variant="blank">{page}</Layout>;
};

export default Error404;
