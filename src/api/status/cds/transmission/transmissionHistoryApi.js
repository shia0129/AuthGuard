import baseApi from '@api/common/baseApi';
import HsLib from '@modules/common/HsLib';

const transmissionHistoryApi = {
  ...baseApi,

  getTransmissionHistoryList: async (parameters) => {
    const result = await transmissionHistoryApi.axios.get(
      '/api/status-management/cds-transmission-history',
      {
        params: {
          ...parameters,
          workStart: HsLib.removeDateTimeFormat(parameters.workStart),
          workEnd: HsLib.removeDateTimeFormat(parameters.workEnd),
        },
      },
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },
  getTransmissionHistoryListExcel: async (parameters) => {
    return await transmissionHistoryApi.axios.get(
      '/api/status-management/cds-transmission-history/excel',
      {
        params: parameters,
        responseType: 'blob',
      },
    );
  },
};

export default transmissionHistoryApi;
