import baseApi from '@api/common/baseApi';

const diskHistoryApi = {
  ...baseApi,
  getDiskStatHistoryList: async (parameters) => {
    const result = await diskHistoryApi.axios.get(
      '/api/status-management/cpu-memory-history/disk',
      {
        params: parameters,
      },
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },
};

export default diskHistoryApi;
