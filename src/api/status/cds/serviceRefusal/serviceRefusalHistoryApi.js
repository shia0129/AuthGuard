import baseApi from '@api/common/baseApi';
import HsLib from '@modules/common/HsLib';

const serviceRefusalHistoryApi = {
  ...baseApi,

  getServiceRefusalHistoryList: async (parameters) => {
    const result = await serviceRefusalHistoryApi.axios.get(
      '/api/status-management/service-refusal-history',
      {
        params: {
          ...parameters,
          workStartTime: HsLib.removeDateTimeFormat(parameters.workStartTime),
          workEndTime: HsLib.removeDateTimeFormat(parameters.workEndTime),
        },
      },
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },
  getServiceRefusalHistoryListExcel: async (parameters) => {
    return await serviceRefusalHistoryApi.axios.get(
      '/api/status-management/service-refusal-history/excel',
      {
        params: parameters,
        responseType: 'blob',
      },
    );
  },
};

export default serviceRefusalHistoryApi;
