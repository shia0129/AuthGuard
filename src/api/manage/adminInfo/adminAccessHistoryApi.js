import baseApi from '@api/common/baseApi';

const adminAccessHistoryApi = {
  ...baseApi,

  getAdminAccessHistoryList: async (parameters) => {
    const result = await adminAccessHistoryApi.axios.get('/api/preferences/admin-access-history', {
      params: parameters,
    });

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  getAdminAccessExcelList: (parameters) => {
    return adminAccessHistoryApi.axios.get('/api/preferences/admin-access-history/excel', {
      params: parameters,
      responseType: 'blob',
    });
  },
};

export default adminAccessHistoryApi;
