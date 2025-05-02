// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project import
import MainCard from '@components/mantis/MainCard';
import useConfig from '@modules/hooks/useConfig';

// ==============================|| CUSTOMIZATION - FONT FAMILY ||============================== //

const ThemeFont = () => {
  const theme = useTheme();

  const { fontFamily, onChangeFontFamily } = useConfig();

  const handleFontChange = (event) => {
    onChangeFontFamily(event.target.value);
  };

  const fonts = [
    {
      id: '굴림',
      value: `'굴림', sans-serif`,
      label: '굴림',
    },
    {
      id: 'ms-gothic',
      value: `'MS Gothic', sans-serif`,
      label: 'MS Gothic',
    },
    {
      id: 'lucida-console',
      value: `'Lucida Console', sans-serif`,
      label: 'Lucida Console',
    },
    {
      id: 'arial-black',
      value: `'Arial Black', sans-serif`,
      label: 'Arial Black',
    },
    {
      id: 'comic-sans-ms',
      value: `'Comic Sans MS', sans-serif`,
      label: 'Comic Sans MS',
    },
    {
      id: 'inter',
      value: `'Inter', 'sans-serif'`,
      label: 'Inter',
    },
    // {
    //   id: 'roboto',
    //   value: `'Roboto', 'sans-serif'`,
    //   label: 'Roboto',
    // },
    // {
    //   id: 'poppins',
    //   value: `'Poppins', sans-serif`,
    //   label: 'Poppins',
    // },
    {
      id: 'public-sans',
      value: `'Public Sans', sans-serif`,
      label: 'Public Sans',
    },
    // {
    //   id: 'jua',
    //   value: `'Jua', sans-serif`,
    //   label: 'Jua',
    // },
    // {
    //   id: 'nanum-myeongjo',
    //   value: `'NanumMyeongjoEco', sans-serif`,
    //   label: '나눔명조',
    // },
    // {
    //   id: 'nanum-square',
    //   value: `'NanumSquareRound', sans-serif`,
    //   label: '나눔스퀘어',
    // },
  ];

  return (
    <RadioGroup
      row
      aria-label="payment-card"
      name="payment-card"
      value={fontFamily}
      onChange={handleFontChange}
    >
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        {fonts.map((item, index) => (
          <Grid item key={index}>
            <FormControlLabel
              control={<Radio value={item.value} sx={{ display: 'none' }} />}
              sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
              label={
                <MainCard
                  content={false}
                  sx={{
                    bgcolor: fontFamily === item.value ? 'primary.lighter' : 'secondary.lighter',
                    p: 1,
                  }}
                  border={false}
                  {...(fontFamily === item.value && {
                    boxShadow: true,
                    shadow: theme.customShadows.primary,
                  })}
                >
                  <Box
                    sx={{
                      minWidth: 60,
                      bgcolor: 'background.paper',
                      p: 1,
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5" color="textPrimary" sx={{ fontFamily: item.value }}>
                        Aa
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.label}
                      </Typography>
                    </Stack>
                  </Box>
                </MainCard>
              }
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

export default ThemeFont;
