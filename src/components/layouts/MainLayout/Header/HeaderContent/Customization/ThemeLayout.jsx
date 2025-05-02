import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  CardMedia,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

// project import
import MainCard from '@components/mantis/MainCard';
import useConfig from '@modules/hooks/useConfig';
import { openDrawer } from '@modules/redux/reducers/menu';

// assets
const defaultLayout = '/assets/images/customization/default.svg';
const miniMenu = '/assets/images/customization/mini-menu.svg';

// ==============================|| CUSTOMIZATION - LAYOUT ||============================== //

const ThemeLayout = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { miniDrawer, onChangeDirection, onChangeMiniDrawer } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);

  let initialTheme = 'default';
  if (miniDrawer === true) initialTheme = 'mini';

  const [value, setValue] = useState(initialTheme);
  const handleRadioChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue === 'default') {
      onChangeDirection('ltr');
      if (!drawerOpen) {
        dispatch(openDrawer({ drawerOpen: true }));
      }
    }
    if (newValue === 'mini') {
      onChangeMiniDrawer(true);
      if (drawerOpen) {
        dispatch(openDrawer({ drawerOpen: false }));
      }
    }
  };

  return (
    <RadioGroup
      row
      aria-label="payment-card"
      name="payment-card"
      value={value}
      onChange={handleRadioChange}
    >
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        <Grid item>
          <FormControlLabel
            value="default"
            control={<Radio value="default" sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{
                  bgcolor: value === 'default' ? 'primary.lighter' : 'secondary.lighter',
                  p: 1,
                }}
                border={false}
                {...(value === 'default' && {
                  boxShadow: true,
                  shadow: theme.customShadows.primary,
                })}
              >
                <Stack spacing={1.25} alignItems="center">
                  <CardMedia
                    component="img"
                    src={defaultLayout}
                    alt="Vertical"
                    sx={{ borderRadius: 1, width: 64, height: 64 }}
                  />
                  <Typography variant="caption">Default</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            value="mini"
            control={<Radio value="mini" sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{ bgcolor: value === 'mini' ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
                border={false}
                {...(value === 'mini' && { boxShadow: true, shadow: theme.customShadows.primary })}
              >
                <Stack spacing={1.25} alignItems="center">
                  <CardMedia
                    component="img"
                    src={miniMenu}
                    alt="Vertical"
                    sx={{ borderRadius: 1, width: 64, height: 64 }}
                  />
                  <Typography variant="caption">Mini Drawer</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
      </Grid>
    </RadioGroup>
  );
};

export default ThemeLayout;
