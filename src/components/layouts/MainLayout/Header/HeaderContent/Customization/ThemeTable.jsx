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
const horizontalLayout = '/assets/images/customization/hor.svg';
const verticalLayout = '/assets/images/customization/ver.svg';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const ThemeTable = () => {
  const theme = useTheme();

  const { tableMode, onCahngeTableMode } = useConfig();

  const handleModeChange = (event) => {
    onCahngeTableMode(event.target.value);
  };

  return (
    <RadioGroup
      row
      aria-label="payment-card"
      name="payment-card"
      value={tableMode}
      onChange={handleModeChange}
    >
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        <Grid item>
          <FormControlLabel
            control={<Radio value="vertical" sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{
                  bgcolor: tableMode === 'vertical' ? 'primary.lighter' : 'secondary.lighter',
                  p: 1,
                }}
                border={false}
                {...(tableMode === 'vertical' && {
                  boxShadow: true,
                  shadow: theme.customShadows.primary,
                })}
              >
                <Stack spacing={1.25} alignItems="center">
                  <CardMedia
                    component="img"
                    src={verticalLayout}
                    alt="Vertical"
                    sx={{ borderRadius: 1, width: 36, height: 36, objectFit: 'contain' }}
                  />
                  <Typography variant="caption">Vertical</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Radio value="horizontal" sx={{ display: 'none' }} />}
            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
            label={
              <MainCard
                content={false}
                sx={{
                  bgcolor: tableMode === 'horizontal' ? 'primary.lighter' : 'secondary.lighter',
                  p: 1,
                }}
                border={false}
                {...(tableMode === 'horizontal' && {
                  boxShadow: true,
                  shadow: theme.customShadows.primary,
                })}
              >
                <Stack spacing={1.25} alignItems="center">
                  <CardMedia
                    component="img"
                    src={horizontalLayout}
                    alt="Horizontal"
                    sx={{ borderRadius: 1, width: 36, height: 36, objectFit: 'contain' }}
                  />
                  <Typography variant="caption">Horizontal</Typography>
                </Stack>
              </MainCard>
            }
          />
        </Grid>
      </Grid>
    </RadioGroup>
  );
};

export default ThemeTable;
