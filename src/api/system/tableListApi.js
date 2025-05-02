import baseApi from '@api/common/baseApi';

const tableListApi = {
  ...baseApi,

  getTableList: (parameters) => {
    return tableListApi.axios.get('/api/system/tablelist', {
      params: parameters,
    });
  },

  saveTableList: (parameters) => {
    return tableListApi.axios.post('/api/system/tablelist', parameters);
  },

  deleteTableList: (parameters) => {
    return tableListApi.axios.delete('/api/system/tablelist', {
      data: parameters,
    });
  },

  duplicationTableList: (parameters) => {
    return tableListApi.axios.post('/api/system/tablelist/duplication', parameters);
  },
};

export default tableListApi;
