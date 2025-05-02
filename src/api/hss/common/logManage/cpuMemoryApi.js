import baseApi from '@api/common/baseApi';

const cpuMemoryApi = {
  ...baseApi,

  getCpuMemoryList: async (parameters) => {
    // const result = await cpuMemoryApi.axios.get(
    //   '/api/status-management/cpu-memory-history/cpu-memory',
    //   {
    //     params: parameters,
    //   },
    // );

    // if (!result.data.errorYn) {
    //   return result.data.data;
    // }
  },
};

export default cpuMemoryApi;
