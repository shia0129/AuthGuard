import baseApi from '@api/common/baseApi';

const portInfoManageApi = {
  ...baseApi,

  getPortInfoList: () => {
    return portInfoManageApi.axios.get('/api/system/serviceport');
  },

  // 콤보데이터 조회
  getSystemGroupSeqList: () => {
    return portInfoManageApi.axios.get('/api/system/systeminfo/combo');
  },

  savePortInfoList: (data) => {
    return portInfoManageApi.axios.post('/api/system/serviceport', data);
  },
};

export default portInfoManageApi;
