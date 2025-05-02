import baseApi from '@api/common/baseApi';

const columnListApi = {
  ...baseApi,

  getColumnList: (parameters) => {
    return columnListApi.axios.get('/api/system/columnlist', {
      params: parameters,
    });
  },

  getTypeList: (parameters) => {
    return columnListApi.axios.get('/api/system/codes/all', { params: parameters });
  },

  insertColumnList: (parameters) => {
    return columnListApi.axios.post('/api/system/columnlist', parameters);
  },

  deleteColumnList: (parameters) => {
    return columnListApi.axios.delete('/api/system/columnlist', { data: parameters });
  },
};

export default columnListApi;
