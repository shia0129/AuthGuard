// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project import
import MainCard from '@components/mantis/MainCard';
import useConfig from '@modules/hooks/useConfig';
import { useEffect, useState ,useRef} from 'react';
import preferencesApi from '@api/system/preferencesApi';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';

const locales = [
  {
    id: 'ko',
    value: 'ko',
    title: '한국어',
    subTitle: 'Korean',
  },
  {
    id: 'en',
    value: 'en',
    title: 'English',
    subTitle: 'UK',
  },
];

const ThemeLocale = () => {
  const theme = useTheme();

  const { i18n, onChangeLocalization } = useConfig();

  // api 호출 함수, openModal 함수.
  const [apiCall] = useApi();

  const { instance } = AuthInstance();

  preferencesApi.axios = instance;

  // LOCALE Config Id
  const [configId, setConfigId] = useState(null);

  const handleLocaleChange = async (event) => {
    await apiCall(preferencesApi.updatePreferences, { configId, configValue: event.target.value });
    onChangeLocalization(event.target.value);
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // Locale 설정 값 조회
    const getLocaleConfig = async () => {
      const result = await apiCall(preferencesApi.getPreferences, {
        configType: 'LOCALE',
        hasToken: false,
      });
      if (result.status === 200) {
        const { configId, configValue } = result.data[0];
        onChangeLocalization(configValue);
        setConfigId(configId);
      }
    };
    getLocaleConfig();
  }, []);

  return (
    <RadioGroup
      row
      aria-label="payment-card"
      name="payment-card"
      value={i18n}
      onChange={handleLocaleChange}
    >
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        {locales.map((item, index) => (
          <Grid item key={index}>
            <FormControlLabel
              control={<Radio value={item.value} sx={{ display: 'none' }} />}
              sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
              label={
                <MainCard
                  content={false}
                  sx={{
                    bgcolor: i18n === item.value ? 'primary.lighter' : 'secondary.lighter',
                    p: 1,
                  }}
                  border={false}
                  {...(i18n === item.value && {
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
                      <Typography variant="h5" color="textPrimary">
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.subTitle}
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

export default ThemeLocale;
