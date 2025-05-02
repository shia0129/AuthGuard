import baseApi from '@api/common/baseApi';

const ipGroupStatusApi = {
  ...baseApi,

  getIpGroupStatusList: async (parameters) => {
    const result = await ipGroupStatusApi.axios.get('/api/cds/policy-manage/ip-group-status', {
      params: parameters,
    });

    if (result.data.errorYn) {
      return;
    }

    const dataList = result.data.data.content;

    const updateDataList = {
      ...result.data.data,
      content: dataList.map((item) => ({
        ...item,
        ipObjectList: item.ipObjectList.length > 0 ? item.ipObjectList.map((ip) => ip.name) : [],
      })),
    };

    return updateDataList;
  },

  getIpObjectType: async (parameters) => {
    const result = await ipGroupStatusApi.axios.get(
      `/api/cds/policy-manage/ip-status/ip?location=${parameters}`,
    );

    if (result.data.errorYn) {
      return;
    }

    const dataList = result.data.data;
    const updateDataList = [...dataList];
    const idOnly = dataList.map((item) => item.id);

    return { updateDataList, idOnly };
  },

  getIpGroupStatusDetails: async (parameters) => {
    const result = await ipGroupStatusApi.axios.get(
      `/api/cds/policy-manage/ip-group-status/${parameters}`,
    );

    if (result.data.errorYn) {
      return;
    }

    const originalData = result.data.data;

    const idOnly = originalData.ipObjectList.map((item) => item.id);
    originalData.ipObjectList = idOnly;

    return originalData;
  },

  insertIpGroupStatusData: async (data) => {
    try {
      const result = await ipGroupStatusApi.axios.post(
        '/api/cds/policy-manage/ip-group-status',
        data,
      );
      if (!result.data.errorYn) {
        return 'IP 그룹 현황 정보가 등록 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'IP 그룹 현황 정보 등록이 실패되었습니다.';
    }
  },

  updateIpGroupStatusData: async (data) => {
    try {
      const result = await ipGroupStatusApi.axios.put(
        '/api/cds/policy-manage/ip-group-status',
        data,
      );

      if (!result.data.errorYn) {
        return 'IP 그룹 현황 정보가 수정 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'IP 그룹 현황 정보 수정이 실패되었습니다.';
    }
  },

  deleteIpGroupStatusData: async (parameters) => {
    try {
      const result = await ipGroupStatusApi.axios.delete('/api/cds/policy-manage/ip-group-status', {
        data: parameters,
      });

      if (!result.data.errorYn && result.data.data.count > 0) {
        return 'IP 그룹 현황 정보가 삭제 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return 'IP 그룹 현황 정보 삭제가 실패되었습니다.';
    }
  },
};

export default ipGroupStatusApi;
