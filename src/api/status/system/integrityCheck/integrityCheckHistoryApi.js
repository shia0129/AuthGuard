import baseApi from '@api/common/baseApi';

const integrityCheckHistoryApi = {
  ...baseApi,

  getIntegrityCheckHistoryList: async (parameters) => {
    const result = await integrityCheckHistoryApi.axios.get(
      '/api/status-management/integrity-check-history',
      { params: parameters },
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  getIntegrityCheckExcelList: (parameters) => {
    return integrityCheckHistoryApi.axios.get(
      '/api/status-management/integrity-check-history/excel',
      {
        params: parameters,
        responseType: 'blob',
      },
    );
  },
};

export default integrityCheckHistoryApi;
