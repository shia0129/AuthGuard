import baseApi from '@api/common/baseApi';

const ipStatusApi = {
  ...baseApi,

  getIpStatusList: async (parameters) => {
    const result = await ipStatusApi.axios.get('/api/cds/policy-manage/ip-status', {
      params: parameters,
    });

    if (result.data.errorYn) {
      return;
    }

    return result.data.data;
  },

  getIpStatusDetails: async (parameters) => {
    const result = await ipStatusApi.axios.get(`/api/cds/policy-manage/ip-status/${parameters}`);

    if (result.data.errorYn) {
      return;
    }

    return result.data.data;
  },

  getIpAndGroupList: async (parameters) => {
    const result = await ipStatusApi.axios.get(
      `/api/cds/policy-manage/ip-status/ip-and-group?location=${parameters}`,
    );

    if (result.data.errorYn) {
      return;
    }

    return result.data.data;
  },

  insertIpStatusData: async (data) => {
    try {
      const result = await ipStatusApi.axios.post('/api/cds/policy-manage/ip-status', data);

      if (!result.data.errorYn) {
        return 'IP현황 정보가 등록 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'IP현황 정보 등록이 실패되었습니다.';
    }
  },

  updateIpStatusData: async (data) => {
    try {
      const result = await ipStatusApi.axios.put('/api/cds/policy-manage/ip-status', data);

      if (!result.data.errorYn) {
        return 'IP현황 정보가 수정 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'IP현황 정보 수정이 실패되었습니다.';
    }
  },

  deleteIpStatusData: async (parameters) => {
    try {
      const result = await ipStatusApi.axios.delete('/api/cds/policy-manage/ip-status', {
        data: parameters,
      });

      if (!result.data.errorYn && result.data.data.count > 0) {
        return 'IP현황 정보가 삭제 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'IP현황 정보 삭제가 실패되었습니다.';
    }
  },
};

export default ipStatusApi;
