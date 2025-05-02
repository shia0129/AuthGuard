import baseApi from '@api/common/baseApi';

const messageFilterHistoryApi = {
  ...baseApi,

  getMessageFilterHistoryList: async (parameters) => {
    const result = await messageFilterHistoryApi.axios.get(
      '/api/status-management/message-filter-detection-history',
      {
        params: parameters,
      },
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },
  getMessageFilterHistoryListExcel: async (parameters) => {
    return await messageFilterHistoryApi.axios.get(
      '/api/status-management/message-filter-detection-history/excel',
      {
        params: parameters,
        responseType: 'blob',
      },
    );
  },
};

export default messageFilterHistoryApi;
