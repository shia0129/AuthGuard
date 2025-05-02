import baseApi from '@api/common/baseApi';

const diskApi = {
  ...baseApi,

  getDiskList: async (parameters) => {
    // const result = await diskApi.axios.get(
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

export default diskApi;
