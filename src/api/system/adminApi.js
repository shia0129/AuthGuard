import baseApi from '@api/common/baseApi';

const userRoleListCache = {};
const adminApi = {
  ...baseApi,

  getAdminPermissionList: () => {
    return adminApi.axios.get('/api/system/permissions/all');
  },

  getAdminList: (parameters) => {
    return adminApi.axios.get('/api/system/admins', {
      params: parameters,
    });
  },

  getAdminAllList: (parameters) => {
    return adminApi.axios.get('/api/system/admins/all', {
      params: parameters,
    });
  },

  getAdminListDetail: ({id:id, hsssessionid:hsssessionid}) => {
    return adminApi.axios.get(`/api/system/admins/${id}`,
        {
          headers: {
            'hsssessionid': hsssessionid
          }
        }
    );
  },

  getUserRoleList: ({ userSeq, common }) => {
    const cached = userRoleListCache[`${userSeq}`];
    if (!cached) {
      userRoleListCache[`${userSeq}`] = adminApi.axios.get(
        `/api/system/admins/${userSeq}/role-list`,
        {
          headers: { 'X-Common': common },
        },
      );
      return userRoleListCache[`${userSeq}`];
    }
    return cached;
  },

  saveAdminList: (parameters) => {
    return adminApi.axios.post('/api/system/admins', parameters);
  },

  updateAdminList: (parameters) => {
    return adminApi.axios.put('/api/system/admins', parameters);
  },

  deleteAdminList: (parameters) => {
    return adminApi.axios.delete('/api/system/admins', { data: parameters });
  },

  updateUserPassword: ({ parameters,hsssessionid:hsssessionid}) => {
    return adminApi.axios.put('/api/system/admins/password',
      parameters,
        {
          headers: {
            'hsssessionid': hsssessionid
          }
        }
      );
  },
  updateUserfirstlogin: ({ parameters,hsssessionid:hsssessionid}) => {
    return adminApi.axios.put('/api/system/admins/firstlogin',
      parameters,
        {
          headers: {
            'hsssessionid': hsssessionid
          }
        }
      );
  },
};
export default adminApi;
