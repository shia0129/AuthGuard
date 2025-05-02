import baseApi from '@api/common/baseApi';

const solutionApi = {
  ...baseApi,

  getSolutionList: (parameters) => {
    return solutionApi.axios.get('/api/system/systemenv', {
      params: parameters,
    });
  },

  getSolutionDetailList: (parameters) => {
    return solutionApi.axios.get(`/api/system/systemenv/${parameters}`);
  },

  insertSolutionList: (data) => {
    return solutionApi.axios.post('/api/system/systemenv', data);
  },

  updateSolutionList: (data) => {
    return solutionApi.axios.put('/api/system/systemenv', data);
  },

  deleteSolutionList: (parameters) => {
    return solutionApi.axios.delete('/api/system/systemenv', {
      data: parameters,
    });
  },

  // 엑셀 다운로드
  getSolutionExcelList: () => {
    return solutionApi.axios.get('/api/system/systemenv/excel', {
      responseType: 'blob',
    });
  },
};

export default solutionApi;
