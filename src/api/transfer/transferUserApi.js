import baseApi from '@api/common/baseApi';

const transferUserApi = {
  ...baseApi,

  getTransferUserList: (parameters) => {
    return transferUserApi.axios.get('/api/transfer/users', {
      params: parameters,
    });
  },

  getTransferUser: (userSeq) => {
    return transferUserApi.axios.get(`/api/transfer/users/${userSeq}`);
  },

  getApproverList: (parameters) => {
    return transferUserApi.axios.get('/api/transfer/users/approver', {
      params: parameters,
    });
  },

  // getAdminList: (parameters) => {
  //   return transferUserApi.axios.get('/api/system/admins', {
  //     params: parameters,
  //   });
  // },

  // getAdminListDetail: (id) => {
  //   return transferUserApi.axios.get(`/api/system/admins/${id}`);
  // },

  // saveAdminList: (parameters) => {
  //   return transferUserApi.axios.post('/api/system/admins', parameters);
  // },

  insertTransferUser: (parameters) => {
    return transferUserApi.axios.post('/api/transfer/users/insert', parameters);
  },

  updateTransferUser: (parameters) => {
    return transferUserApi.axios.post('/api/transfer/users/update/userInfo', parameters);
  },

  updateTransferUserPolicy: (parameters) => {
    return transferUserApi.axios.post('/api/transfer/users/update/userPolicy', parameters);
  },

  updateTransferUserPassword: (parameters) => {
    return transferUserApi.axios.put('/api/transfer/users/password', parameters);
  },

  deleteTransferUserList: (parameters) => {
    return transferUserApi.axios.delete('/api/transfer/users', { data: parameters });
  },
};

export default transferUserApi;
