import baseApi from '@api/common/baseApi';

const cpuMemoryHistoryApi = {
  ...baseApi,

  getCpuMemHistoryList: async (parameters) => {
    const result = await cpuMemoryHistoryApi.axios.get(
      '/api/status-management/cpu-memory-history/cpu-memory',
      {
        params: parameters,
      },
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },
};

export default cpuMemoryHistoryApi;
