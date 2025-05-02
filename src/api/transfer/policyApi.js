import baseApi from '@api/common/baseApi';

const policyApi = {
  ...baseApi,

  // 정책 list 조회
  getPolicyList: (parameters) => {
    return policyApi.axios.get('/api/transfer/policy/getList', {
      params: parameters,
    });
  },

  // 사용중인 파일확장자 조회
  getExtensionList: (parameters) => {
    return policyApi.axios.get(`/api/transfer/policy/extension`, {
      params: parameters,
    });
  },

  // 특정 정책 사용하는 부서 정보 update
  updateDeptList: (parameters) => {
    return policyApi.axios.put('/api/transfer/policy/updateDeptList', parameters);
  },

  // 특정 정책 사용하는 사용자 정보 update
  updateUserList: (parameters) => {
    return policyApi.axios.put('/api/transfer/policy/updateUserList', parameters);
  },

  // 신규 정책 insert
  insertPolicy : (parameters) => {
    return policyApi.axios.post('/api/transfer/policy/insert', parameters);
  },

  // 정책 정보 update
  updatePolicy : (parameters) => {
    return policyApi.axios.put('/api/transfer/policy/update', parameters);
  },

  // 정책 삭제
  deletePolicyList : (parameters) => {
    return policyApi.axios.delete('/api/transfer/policy/deletePolicyList', {
      data: parameters,
    });
  },

  // 파일확장자 관련 update
  updateFileFilter:(parameters) => {
    return policyApi.axios.put('/api/transfer/policy/updateFileFilter', parameters);
  },

};

export default policyApi;
