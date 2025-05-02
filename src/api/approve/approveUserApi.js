import baseApi from '@api/common/baseApi';

const approveUserApi = {
  ...baseApi,

  getApproveLineList: (parameters) => {
    return approveUserApi.axios.get('/api/transfer/approve', {
      params: parameters,
    });
  },

  getUserApproverList: (userSeq) => {
    return approveUserApi.axios.get(`/api/transfer/approve/${userSeq}`, {});
  },

  getUserApprover: (id) => {
    return approveUserApi.axios.get(`/api/transfer/approve/one/${id}`, {});
  },

  // getAdminList: (parameters) => {
  //   return transferUserApi.axios.get('/api/system/admins', {
  //     params: parameters,
  //   });
  // },

  insertApproverList: (parameters) => {
    return approveUserApi.axios.post('/api/transfer/approve', parameters);
  },

  deleteApproverList: (parameters) => {
    return approveUserApi.axios.delete('/api/transfer/approve', { data: parameters });
  },
};

export default approveUserApi;
