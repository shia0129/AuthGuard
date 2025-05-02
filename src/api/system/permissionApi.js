import baseApi from '@api/common/baseApi';

const permissionApi = {
  ...baseApi,

  getPermissionList: (parameters) => {
    return permissionApi.axios.get('/api/system/permissions', {
      params: parameters,
    });
  },

  getPermissionRankList: () => {
    return permissionApi.axios.get('/api/system/permissions/ranks');
  },

  getPermissionDetails: (parameters) => {
    return permissionApi.axios.get(`/api/system/permissions/${parameters}`);
  },

  insertPermission: (parameters) => {
    return permissionApi.axios.post('/api/system/permissions', parameters);
  },

  updatePermission: (parameters) => {
    return permissionApi.axios.put('/api/system/permissions', parameters);
  },

  deletePermission: (parameters) => {
    return permissionApi.axios.delete('/api/system/permissions', {
      data: parameters,
    });
  },

  updateUserPermission: (parameters) => {
    return permissionApi.axios.put('/api/system/permissions/admins', parameters);
  },
};

export default permissionApi;
