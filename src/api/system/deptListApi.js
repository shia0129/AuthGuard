import baseApi from '@api/common/baseApi';

const deptListApi = {
  ...baseApi,

  // 부서 트리 조회
  getDeptTree: () => {
    return deptListApi.axios.get(`/api/transfer/deptmanage/deptlist/getTree`);
  },

  // 모든 부서 list 조회
  getDeptList: (parameters) => {
    return deptListApi.axios.get('/api/transfer/deptmanage/deptlist', {
      params: parameters,
    });
  },

  // 모든 부서 list 조회
  selectDeptUserList: (parameters) => {
    return deptListApi.axios.get('/api/transfer/deptmanage/deptUser', {
      params: parameters,
    });
  },

  // 특정 부서 조회
  getDeptListDetail: (id) => {
    return deptListApi.axios.get(`/api/transfer/deptmanage/deptlist/${id}`);
  },

  // 부서별 겸직자 조회
  getCurrentList: (id) => {
    return deptListApi.axios.get(`/api/transfer/deptmanage/currentList/${id}`);
  },

  // 정책 list 조회
  getPolicyList: () => {
    return deptListApi.axios.get('/api/transfer/policy/getList');
  },

  saveDeptList: (parameters) => {
    return deptListApi.axios.post('/api/transfer/deptmanage/insert', parameters);
  },

  updateDeptList: (parameters) => {
    return deptListApi.axios.post('/api/transfer/deptmanage/update', parameters);
  },

  updateDeptListPolicy: (parameters) => {
    return deptListApi.axios.post('/api/transfer/deptmanage/update/policy', parameters);
  },

  deleteDeptList: (parameters) => {
    return deptListApi.axios.delete('/api/system/tablelist', {
      data: parameters,
    });
  },

  duplicationDeptList: (parameters) => {
    return deptListApi.axios.post('/api/system/tablelist/duplication', parameters);
  },
};

export default deptListApi;
