import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// ==============================|| DRAWER HEADER - STYLED ||============================== //

const DrawerHeaderStyled = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
  }),
);

DrawerHeaderStyled.propTypes = {
  theme: PropTypes.object,
  open: PropTypes.bool,
};

export default DrawerHeaderStyled;
