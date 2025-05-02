import baseApi from '@api/common/baseApi';

const groupApi = {
  ...baseApi,

  getGroupList: (parameters) => {
    return groupApi.axios.get('/api/system/groups', { params: parameters });
  },
  getGroupTreeList: (parameters) => {
    return groupApi.axios.get('/api/system/groups/tree', { params: parameters });
  },
  getGroupDetails: (parameters) => {
    return groupApi.axios.get(`/api/system/groups/${parameters}`);
  },
  insertGroup: (parameters) => {
    return groupApi.axios.post('/api/system/groups', parameters);
  },
  updateGroup: (parameters) => {
    return groupApi.axios.put('/api/system/groups', parameters);
  },
  deleteGroup: (parameters) => {
    return groupApi.axios.delete('/api/system/groups', {
      data: parameters,
    });
  },
};

export default groupApi;
