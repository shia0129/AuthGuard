import PropTypes from 'prop-types';
import { createContext ,useRef} from 'react';

// project import
import preferencesApi from '@api/system/preferencesApi';
import { DefaultInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import useLocalStorage from '@modules/hooks/useLocalStorage';
import { useEffect } from 'react';
import defaultConfig from 'src/config';

// initial state
const initialState = {
  ...defaultConfig,
  onChangeContainer: () => {},
  onChangeLocalization: () => {},
  onChangeMode: () => {},
  onChangeMenuMode: () => {},
  onCahngeTableMode: () => {},
  onChangePresetColor: () => {},
  onChangeDirection: () => {},
  onChangeMiniDrawer: () => {},
  onChangeFontFamily: () => {},
  onChangeFullSizeFlag: () => {},
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

function ConfigProvider({ children }) {
  const [config, setConfig] = useLocalStorage('hsck-web-config', initialState);

  const onChangeContainer = () => {
    setConfig({
      ...config,
      container: !config.container,
    });
  };

  const onChangeLocalization = (lang) => {
    setConfig({
      ...config,
      i18n: lang,
    });
  };

  const onChangeMode = (mode) => {
    setConfig({
      ...config,
      mode,
    });
  };

  const onChangeMenuMode = (menuMode) => {
    setConfig({
      ...config,
      menuMode: menuMode,
    });
  };

  const onCahngeTableMode = (tableMode) => {
    setConfig({
      ...config,
      tableMode: tableMode,
    });
  };

  const onChangePresetColor = (theme) => {
    setConfig({
      ...config,
      presetColor: theme,
    });
  };

  const onChangeDirection = (direction) => {
    setConfig({
      ...config,
      themeDirection: direction,
    });
  };

  const onChangeMiniDrawer = (miniDrawer) => {
    setConfig({
      ...config,
      miniDrawer,
    });
  };

  const onChangeFontFamily = (fontFamily) => {
    setConfig({
      ...config,
      fontFamily,
    });
  };

  const onChangeFullSizeFlag = (fullSizeFlag) => {
    setConfig({
      ...config,
      fullSizeFlag,
    });
  };

  preferencesApi.axios = DefaultInstance();
  const [apiCall] = useApi();
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const getLocaleConfig = async () => {
      const result = await apiCall(preferencesApi.getPreferences, {
        configType: 'LOCALE',
        hasToken: false,
      });
      if (result.status === 200) {
        const { configValue } = result.data[0];
        setConfig({
          ...config,
          i18n: configValue,
        });
      }
    };

    getLocaleConfig();
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeDirection,
        onChangeMiniDrawer,
        onChangeFontFamily,
        onChangeFullSizeFlag,
        onChangeMenuMode,
        onCahngeTableMode,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = {
  children: PropTypes.node,
};

export { ConfigProvider, ConfigContext };
