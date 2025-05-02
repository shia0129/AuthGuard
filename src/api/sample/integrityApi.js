import baseApi from '@api/common/baseApi';

const integrityApi = {
  ...baseApi,

  getIntegrityLogList: (parameters) => {
    return integrityApi.axios.get('/api/sample/integrity/logs', {
      params: parameters,
    });
  },

  createHash: (parameters) => {
    return integrityApi.axios.get('/api/sample/integrity/hash-create', {
      params: parameters,
    });
  },

  checkHash: (parameters) => {
    return integrityApi.axios.get('/api/sample/integrity/hash-check', {
      params: parameters,
    });
  },
};

export default integrityApi;
