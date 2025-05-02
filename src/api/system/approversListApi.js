import baseApi from '@api/common/baseApi';

const approversListApi = {
  ...baseApi,

  // 사용자 목록 조회
  getApproversList: (parameters) => {
    return approversListApi.axios.get('/api/transfer/approval/approvers', {
      params: parameters,
    })
  },

  // 결재자 등록
  saveApproversList: (parameters) => {
    return approversListApi.axios.post('/api/transfer/approval/approvers', parameters);
  },

  // 결재자 삭제
  deleteApproversList: (parameters) => {
    return approversListApi.axios.delete('/api/transfer/approval/approvers', {
      data: parameters,
    });
  },

};

export default approversListApi;
