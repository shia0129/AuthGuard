import baseApi from '@api/common/baseApi';

const adminBlockHistoryApi = {
  ...baseApi,

  getAdminBlockHistoryList: async (parameters) => {
    const result = await adminBlockHistoryApi.axios.get('/api/preferences/admin-block-release', {
      params: parameters,
    });

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },
  getAdminBlockExcelList: (parameters) => {
    return adminBlockHistoryApi.axios.get('/api/preferences/admin-block-release/excel', {
      params: parameters,
      responseType: 'blob',
    });
  },
  getPasswordFailHistoryList: () => {},
};

export default adminBlockHistoryApi;
