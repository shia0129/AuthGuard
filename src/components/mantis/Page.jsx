import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// next
import Head from 'next/head';

// material-ui
import { Box } from '@mui/material';

// ==============================|| Page - SET TITLE & META TAGS ||============================== //

const Page = forwardRef(({ children, title = '', meta, main = false, ...other }, ref) => {
  const htmlTitle = title.length !== 0 ? `${title} | ` : '';

  return (
    <>
      <Head>
        <title>{`${htmlTitle}AuthGuard`}</title>
        {meta}
      </Head>
      <Box
        ref={ref}
        sx={{
          ...other.sx,
          ...(main && {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }),
        }}
        {...other}
      >
        {children}
      </Box>
    </>
  );
});

Page.displayName = 'Page';

Page.propTypes = {
  title: PropTypes.string,
  meta: PropTypes.node,
  children: PropTypes.node,
};

export default Page;
