import baseApi from '@api/common/baseApi';

// 정책 그룹 상태 목록 조회 (재시도 로직 포함)
async function getPolicyGroupStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await policyGroupStatusApi.axios.post(
      '/api/sslva/policy-manage/policy-group',
      {
        run_type: 'get',
        ...parameters,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getPolicyGroupStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 정책 그룹 상태 상세 조회 (재시도 로직 포함)
async function getPolicyGroupStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await policyGroupStatusApi.axios.post(
      '/api/sslva/policy-manage/policy-group',
      {
        run_type: 'get',
        id: parameters,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getPolicyGroupStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 정책 그룹 상태 등록 (재시도 로직 포함)
async function insertPolicyGroupStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await policyGroupStatusApi.axios.post(
      '/api/sslva/policy-manage/policy-group',
      {
        run_type: 'add',
        ...data,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return `정책 그룹 정보가 등록 되었습니다.\n세그먼트를 재시작하시기 바랍니다.`;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertPolicyGroupStatusDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      const errorMessage = error.response.data.error.errorMessage;
      let finalErrorMessage = '';
      if (typeof errorMessage === 'object') {
        finalErrorMessage = Object.values(errorMessage).flat().shift();
      } else {
        finalErrorMessage = errorMessage;
      }
      return finalErrorMessage;
    }
    return '정책 그룹 정보 등록이 실패되었습니다.';
  }
}

// 정책 그룹 상태 수정 (재시도 로직 포함)
async function updatePolicyGroupStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await policyGroupStatusApi.axios.post(
      '/api/sslva/policy-manage/policy-group',
      {
        run_type: 'put',
        ...data,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return `정책 그룹 정보가 수정 되었습니다.\n세그먼트를 재시작하시기 바랍니다.`;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updatePolicyGroupStatusDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      const errorMessage = error.response.data.error.errorMessage;
      let finalErrorMessage = '';
      if (typeof errorMessage === 'object') {
        finalErrorMessage = Object.values(errorMessage).flat().shift();
      } else {
        finalErrorMessage = errorMessage;
      }
      return finalErrorMessage;
    }
    return '정책 그룹 정보 수정이 실패되었습니다.';
  }
}

// 정책 그룹 상태 삭제 (재시도 로직 포함)
async function deletePolicyGroupStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await policyGroupStatusApi.axios.post(
      '/api/sslva/policy-manage/policy-group',
      {
        run_type: 'del',
        data: parameters,
        signal,
      }
    );
    if (!result.data.errorYn && result.data.data.count > 0) {
      return `정책 그룹 정보가 삭제 되었습니다.\n세그먼트를 재시작하시기 바랍니다.`;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deletePolicyGroupStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '정책 그룹 정보 삭제가 실패되었습니다.';
  }
}

const policyGroupStatusApi = {
  ...baseApi,
  getPolicyGroupStatusList: getPolicyGroupStatusListInternal,
  getPolicyGroupStatusDetails: getPolicyGroupStatusDetailsInternal,
  insertPolicyGroupStatusData: insertPolicyGroupStatusDataInternal,
  updatePolicyGroupStatusData: updatePolicyGroupStatusDataInternal,
  deletePolicyGroupStatusData: deletePolicyGroupStatusDataInternal,
};

export default policyGroupStatusApi;
