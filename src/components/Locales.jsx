import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

// third-party
import { IntlProvider } from 'react-intl';

// project import
import useConfig from '@modules/hooks/useConfig';

// load locales files
const loadLocaleData = (locale) => {
  switch (locale) {
    case 'en':
      return import('@modules/utils/locales/merge-en');
    default:
      return import('@modules/utils/locales/merge-ko');
  }
};

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }) => {
  const { i18n } = useConfig();
  const [messages, setMessages] = useState();
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    loadLocaleData(i18n).then((d) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <>
      {messages && (
        <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
};

Locales.propTypes = {
  children: PropTypes.node,
};

export default Locales;
