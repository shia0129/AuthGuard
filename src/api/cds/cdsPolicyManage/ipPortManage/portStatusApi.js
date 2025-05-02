import baseApi from '@api/common/baseApi';

const portStatusApi = {
  ...baseApi,

  getPortStatusList: async (parameters) => {
    const result = await portStatusApi.axios.get('/api/cds/policy-manage/port-status', {
      params: parameters,
    });

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  getPortStatusDetails: async (parameters) => {
    const result = await portStatusApi.axios.get(
      `/api/cds/policy-manage/port-status/${parameters}`,
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  getPortObjectType: async () => {
    const result = await portStatusApi.axios.get('/api/cds/policy-manage/port-status/port');

    if (result.data.errorYn) {
      return;
    }

    return result.data.data;
  },

  insertPortStatusData: async (data) => {
    try {
      const result = await portStatusApi.axios.post('/api/cds/policy-manage/port-status', data);

      if (!result.data.errorYn) {
        return 'Port 현황 정보가 등록 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'Port 현황 정보 등록이 실패되었습니다.';
    }
  },

  updatePortStatusData: async (data) => {
    try {
      const result = await portStatusApi.axios.put('/api/cds/policy-manage/port-status', data);

      if (!result.data.errorYn) {
        return 'Port 현황 정보가 수정 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'Port 현황 정보 수정이 실패되었습니다.';
    }
  },

  deletePortStatusData: async (parameters) => {
    try {
      const result = await portStatusApi.axios.delete('/api/cds/policy-manage/port-status', {
        data: parameters,
      });

      if (!result.data.errorYn && result.data.data.count > 0) {
        return 'Port 현황 정보가 삭제 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'Port 현황 정보 삭제가 실패되었습니다.';
    }
  },
};

export default portStatusApi;
