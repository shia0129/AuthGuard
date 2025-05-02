import baseApi from '@api/common/baseApi';

const concurrentApproverApi = {
  ...baseApi,

  getConcurrentApproverList: (parameters) => {
    return concurrentApproverApi.axios.get('/api/transfer/deptmanage/currentList', {
      params: parameters,
    });
  },

  getOneConcurrentApproverList: (deptSeq, parameters) => {
    return concurrentApproverApi.axios.get(`/api/transfer/deptmanage/currentList/${deptSeq}`, {
      params: parameters,
    });
  },

  getOneConcurrentApprover: (id) => {
    return concurrentApproverApi.axios.get(`/api/transfer/deptmanage/currentList/one/${id}`, {});
  },
  // getAdminList: (parameters) => {
  //   return transferUserApi.axios.get('/api/system/admins', {
  //     params: parameters,
  //   });
  // },

  saveConcurrentApproverList: (parameters) => {
    return concurrentApproverApi.axios.post('/api/transfer/deptmanage/currentList', parameters);
  },

  // updateAdminList: (parameters) => {
  //   return transferUserApi.axios.put('/api/system/admins', parameters);
  // },

  deleteConcurrentApproverList: (parameters) => {
    return concurrentApproverApi.axios.delete('/api/transfer/deptmanage/currentList', {
      data: parameters,
    });
  },
};

export default concurrentApproverApi;
