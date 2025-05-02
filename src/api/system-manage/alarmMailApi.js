import baseApi from '@api/common/baseApi';

const alarmMailApi = {
  ...baseApi,

  updateAlarmConfig: async (parameters) => {
    const { data } = await alarmMailApi.axios.put('/api/preferences/alarm-mail-config', {
      preferencesList: parameters,
    });

    if (!data.errorYn) {
      return data.data;
    }
  },
};

export default alarmMailApi;
