import baseApi from '@api/common/baseApi';

const policyManageApi = {
  ...baseApi,

  getPolicyManageList: async (parameters) => {
    const result = await policyManageApi.axios.get('/api/cds/policy-manage', {
      params: parameters,
    });

    if (result.data.errorYn) {
      return;
    }

    return result.data.data;
  },

  getPolicyManageDetails: async (id) => {
    const result = await policyManageApi.axios.get(`/api/cds/policy-manage/${id}`);

    if (result.data.errorYn) {
      return;
    }

    return result.data.data;
  },

  getOptionList: async (codeType) => {
    const result = await policyManageApi.axios.get(`/api/system/codes/type/${codeType}`);

    if (result.data.errorYn) {
      return;
    }

    return result.data.data;
  },

  insertPolicyManageData: async (data) => {
    try {
      const result = await policyManageApi.axios.post('/api/cds/policy-manage', data);

      if (!result.data.errorYn) {
        return '정책 관리 정보가 등록 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return {
          errorMessage: error.response.data.error.errorMessage,
          errorYn: error.response.data.errorYn,
        };
      }
      return '정책 관리 정보 등록이 실패되었습니다.';
    }
  },

  updatePolicyManageData: async (data) => {
    try {
      const result = await policyManageApi.axios.put('/api/cds/policy-manage', data);

      if (!result.data.errorYn) {
        return '정책 관리 정보가 수정 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return {
          errorMessage: error.response.data.error.errorMessage,
          errorYn: error.response.data.errorYn,
        };
      }
      return '정책 관리 정보 수정이 실패되었습니다.';
    }
  },

  updateEnabledData: async (data) => {
    try {
      const result = await policyManageApi.axios.patch(`/api/cds/policy-manage/enabled/${data}`);

      if (!result.data.errorYn) {
        return '활성화여부 정보가 수정 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return '활성화여부 정보 수정이 실패되었습니다.';
    }
  },

  updatePolicyData: async (data) => {
    try {
      const result = await policyManageApi.axios.patch(`/api/cds/policy-manage/sync`, {
        syncIds: data,
      });

      if (!result.data.errorYn) {
        return `등록 ${result.data.data.createdPolicyCount}건 수정 ${result.data.data.updatedPolicyCount}건 삭제 ${result.data.data.deletedPolicyCount}건이 처리되었습니다.`;
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return '변경된 정책이 없습니다.';
    }
  },

  updateRevisedPolicyData: async () => {
    try {
      const result = await policyManageApi.axios.put('/api/cds/policy-manage/sync');

      if (!result.data.errorYn) {
        return `등록 ${result.data.data.createdPolicyCount}건 수정 ${result.data.data.updatedPolicyCount}건 삭제 ${result.data.data.deletedPolicyCount}건이 처리되었습니다.`;
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return error.response.data.error.errorMessage;
      }
      return '변경된 정책이 없습니다.';
    }
  },

  deletePolicyManageData: async (parameters) => {
    try {
      const result = await policyManageApi.axios.delete('/api/cds/policy-manage', {
        data: parameters,
      });

      if (!result.data.errorYn) {
        return '정책 관리 정보가 삭제 되었습니다.';
      }
    } catch (error) {
      if (error.response && error.response.data.errorYn) {
        return {
          errorMessage: error.response.data.error.errorMessage,
          errorYn: error.response.data.errorYn,
        };
      }
      return '정책 관리 정보 삭제가 실패되었습니다.';
    }
  },
};

export default policyManageApi;
