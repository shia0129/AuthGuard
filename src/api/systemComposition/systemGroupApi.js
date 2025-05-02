import baseApi from '@api/common/baseApi';

const systemGroupApi = {
  ...baseApi,

  getSystemGroupList: (parameters) => {
    return systemGroupApi.axios.get('/api/system/systemgroup', {
      params: parameters,
    });
  },

  saveSystemGroupList: (parameters) => {
    return systemGroupApi.axios.post('/api/system/systemgroup', parameters);
  },

  duplicationSystemGroupList: (parameters) => {
    return systemGroupApi.axios.post('/api/system/systemgroup/duplication', parameters);
  },

  deleteSystemGroupList: (parameters) => {
    return systemGroupApi.axios.delete('/api/system/systemgroup', {
      data: parameters,
    });
  },

  // 시스템 그룹 구성
  getSystemGroupSeqList: () => {
    return systemGroupApi.axios.get('/api/system/systemgroup/combo');
  },

  getSystemInfoList: (parameters) => {
    return systemGroupApi.axios.get('/api/system/systeminfo', {
      params: parameters,
    });
  },

  saveSystemInfoList: (parameters) => {
    return systemGroupApi.axios.post('/api/system/systeminfo', parameters);
  },

  deleteSystemInfoList: (parameters) => {
    return systemGroupApi.axios.delete('/api/system/systeminfo', {
      data: parameters,
    });
  },

  duplicationSystemInfoList: (parameters) => {
    return systemGroupApi.axios.post('/api/system/systeminfo/duplication', parameters);
  },
};

export default systemGroupApi;
