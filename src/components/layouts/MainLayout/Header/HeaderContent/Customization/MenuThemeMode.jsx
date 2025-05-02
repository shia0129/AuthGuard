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

// assets
const defaultLayout = '/assets/images/customization/default.svg';
const lDarkLayout = '/assets/images/customization/Ldark.svg';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const MenuThemeMode = () => {
  const theme = useTheme();

  const { menuMode, onChangeMenuMode } = useConfig();

  const handleModeChange = (event) => {
    onChangeMenuMode(event.target.value);
  };

  return (
    <RadioGroup
      row
      aria-label="payment-card"
      name="payment-card"
      value={menuMode}
      onChange={handleModeChange}
    >
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        <Grid item>
          <FormControlLabel
            control={<Radio value="light" sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{
                  bgcolor: menuMode === 'light' ? 'primary.lighter' : 'secondary.lighter',
                  p: 1,
                }}
                border={false}
                {...(menuMode === 'light' && {
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
                  <Typography variant="caption">Light</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Radio value="dark" sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{
                  bgcolor: menuMode === 'dark' ? 'primary.lighter' : 'secondary.lighter',
                  p: 1,
                }}
                border={false}
                {...(menuMode === 'dark' && {
                  boxShadow: true,
                  shadow: theme.customShadows.primary,
                })}
              >
                <Stack spacing={1.25} alignItems="center">
                  <CardMedia
                    component="img"
                    src={lDarkLayout}
                    alt="Vertical"
                    sx={{ borderRadius: 1, width: 64, height: 64 }}
                  />
                  <Typography variant="caption">Dark</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Radio value="gray" sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{
                  bgcolor: menuMode === 'gray' ? 'primary.lighter' : 'secondary.lighter',
                  p: 1,
                }}
                border={false}
                {...(menuMode === 'gray' && {
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
                  <Typography variant="caption">Gray</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
      </Grid>
    </RadioGroup>
  );
};

export default MenuThemeMode;
