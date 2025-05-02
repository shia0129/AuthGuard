import baseApi from '@api/common/baseApi';

const codeApi = {
  ...baseApi,

  getCodeList: (parameters) => {
    return codeApi.axios.get('/api/system/codes', {
      params: parameters,
    });
  },
  getCodeTypeList: () => {
    return codeApi.axios.get('/api/system/codes/codeTypes/all');
  },

  getCodeDetails: (parameters) => {
    return codeApi.axios.get(`/api/system/codes/${parameters}`);
  },

  insertCode: (parameters) => {
    return codeApi.axios.post('/api/system/codes', parameters);
  },

  updateCode: (parameters) => {
    return codeApi.axios.put('/api/system/codes', parameters);
  },

  deleteCode: (parameters) => {
    return codeApi.axios.delete('/api/system/codes', {
      data: parameters,
    });
  },

  getComboList: async (codeType) => {
    // const result = await baseApi.getComboInfo(codeType);
    const result = await codeApi.axios.get(
      '/api/system/codes/all?codeType=' + codeType + '&deleteYn=N',
    );
    if (result.status === 200) {
      return result.data.resultData;
    }
  },

  getTotalCodeList: async () => {
    const { status, data } = await codeApi.axios.get('/api/system/codes/all?deleteYn=N');

    if (status === 200) {
      return data.resultData;
    }
  },
};

export default codeApi;
