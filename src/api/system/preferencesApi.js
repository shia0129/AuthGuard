import baseApi from '@api/common/baseApi';

const preferencesApi = {
  ...baseApi,

  getPreferences: ({ configType, hasToken = true }) => {
    return preferencesApi.axios.get('/api/system/preferences', {
      params: {
        configType,
      },
      headers: {
        Authorization: '',
      },
      ...(!hasToken && { headers: { Authorization: '' } }),
    });
  },

  updatePreferences: (parameters) => {
    return preferencesApi.axios.put('/api/system/preferences', parameters);
  },
};

export default preferencesApi;
