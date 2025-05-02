import baseApi from '@api/common/baseApi';
import HsLib from '@modules/common/HsLib';

const monitoringLogApi = {
  ...baseApi,

  getMonitoringLogList: async (parameters) => {
    const result = await monitoringLogApi.axios.get('/api/preferences/monitoring-log', {
      params: {
        ...parameters,
        registerStartDate: HsLib.removeDateTimeFormat(parameters.registerStartDate),
        registerEndDate: HsLib.removeDateTimeFormat(parameters.registerEndDate),
      },
    });

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  getMonitoringLogExcelList: (parameters) => {
    return monitoringLogApi.axios.get('/api/preferences/monitoring-log/excel', {
      params: parameters,
      responseType: 'blob',
    });
  },
};

export default monitoringLogApi;
