import baseApi from '@api/common/baseApi';

// 계정 그룹 목록 조회 (재시도 로직 포함)
async function getAccountGroupListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accountGroupApi.axios.post('/api/account-group', {
      run_type: 'get',
      ...parameters,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getAccountGroupListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 계정 그룹 상세 조회 (재시도 로직 포함)
async function getAccountGroupDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accountGroupApi.axios.post('/api/account-group', {
      run_type: 'get',
      id: parameters,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getAccountGroupDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 계정 그룹 컬럼 목록 조회 (재시도 로직 포함)
async function getAccountGroupColumnListInternal(parameter, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accountGroupApi.axios.post('/api/account-group', {
      run_type: 'get',
      column: parameter,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getAccountGroupColumnListInternal(parameter, retryCount - 1);
    }
    throw error;
  }
}

// 계정 그룹 등록 (재시도 로직 포함)
async function insertAccountGroupDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await accountGroupApi.axios.post('/api/account-group', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '계정 그룹 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertAccountGroupDataInternal(data, retryCount - 1);
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
    return '계정 그룹 정보 등록이 실패되었습니다.';
  }
}

// 계정 그룹 수정 (재시도 로직 포함)
async function updateAccountGroupDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await accountGroupApi.axios.post('/api/account-group', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '계정 그룹 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateAccountGroupDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '계정 그룹 정보 수정이 실패되었습니다.';
  }
}

// 계정 그룹 삭제 (재시도 로직 포함)
async function deleteAccountGroupDataInternal(parameters, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await accountGroupApi.axios.post('/api/account-group', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '계정 그룹 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteAccountGroupDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '계정 그룹 정보 삭제가 실패되었습니다.';
  }
}

const accountGroupApi = {
  ...baseApi,
  getAccountGroupList: getAccountGroupListInternal,
  getAccountGroupDetails: getAccountGroupDetailsInternal,
  getAccountGroupColumnList: getAccountGroupColumnListInternal,
  insertAccountGroupData: insertAccountGroupDataInternal,
  updateAccountGroupData: updateAccountGroupDataInternal,
  deleteAccountGroupData: deleteAccountGroupDataInternal,
};

export default accountGroupApi;
