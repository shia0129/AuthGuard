import baseApi from '@api/common/baseApi';

const transBlockHistoryApi = {
  ...baseApi,

  getTransBlockHistoryList: async (parameters) => {
    const result = await transBlockHistoryApi.axios.get(
      '/api/status-management/cds-block-history',
      {
        params: parameters,
      },
    );

    if (result.data.errorYn === false) {
      return result.data.data;
    }
  },
};

export default transBlockHistoryApi;
