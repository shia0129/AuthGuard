// material-ui
import { Button, Link, CardMedia, Stack, Typography } from '@mui/material';

// project import
import MainCard from '@components/mantis/MainCard';
import AnimateButton from '@components/@extended/AnimateButton';
import useConfig from '@modules/hooks/useConfig';

const avatar = '/assets/images/users/avatar-group.png';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const darkMenuStyle = {
  bgcolor: '#141414',
  borderColor: '#141414',
};
const NavCard = () => {
  const { menuMode } = useConfig();

  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3, ...(menuMode === 'dark' && { ...darkMenuStyle }) }}>
      <Stack alignItems="center" spacing={2.5}>
        <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
        <Stack alignItems="center">
          <Typography variant="h5" sx={{ color: menuMode === 'dark' && '#8c8c8c' }}>
            Help?
          </Typography>
          <Typography variant="h6" color="secondary">
            Get to resolve query
          </Typography>
        </Stack>
        <AnimateButton>
          <Button
            variant="shadow"
            size="small"
            component={Link}
            href="https://codedthemes.support-hub.io/"
            target="_blank"
          >
            Support
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
};

export default NavCard;
