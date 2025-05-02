import { styled } from '@mui/material/styles';
import MuiToggleButton from '@mui/material/ToggleButton';

const StyledMuiToggleButton = styled(({ ...props }) => (
  <MuiToggleButton {...props} sx={{ color: `${props.textcolor} !important`, fontSize: '0.75rem' }}>
    {props.children}
  </MuiToggleButton>
))(({ theme }) => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: theme.palette.grey[200],
    border: 'solid 1px !important',
  },
  border: `1px solid ${theme.palette.secondary.light}`,
  '&:first-of-type': {
    marginLeft: '0px !important',
  },
  marginLeft: '0px !important',
}));

export default StyledMuiToggleButton;
