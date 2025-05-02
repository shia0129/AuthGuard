import baseApi from '@api/common/baseApi';

const policyStatusApi = {
  ...baseApi,

  getPolicyStatusList: async (parameters) => {
    const result = await policyStatusApi.axios.get('/api/cds/policy-status', {
      params: parameters,
    });

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  getPolicyStatusExcelList: (parameters) => {
    return policyStatusApi.axios.get('/api/cds/policy-status/excel', {
      params: parameters,
      responseType: 'blob',
    });
  },
};

export default policyStatusApi;
