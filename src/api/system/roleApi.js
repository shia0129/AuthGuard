import baseApi from '@api/common/baseApi';

const roleApi = {
  ...baseApi,

  getRoleList: (parameters) => {
    return roleApi.axios.get('/api/system/roles', {
      params: parameters,
    });
  },
  getRoleDetails: (parameters) => {
    return roleApi.axios.get(`/api/system/roles/${parameters}`);
  },
  deleteRole: (parameters) => {
    return roleApi.axios.delete('/api/system/roles', {
      data: parameters,
    });
  },
  insertRole: (parameters) => {
    return roleApi.axios.post('/api/system/roles', parameters);
  },
  updateRole: (parameters) => {
    return roleApi.axios.put('/api/system/roles', parameters);
  },
};

export default roleApi;
