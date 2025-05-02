import baseApi from '@api/common/baseApi';

// 사용자 목록 조회 (재시도 로직 포함)
async function getUserListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await userApi.axios.post('/api/sslvpn/user', {
      run_type: 'get',
      ...parameters,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getUserListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 사용자 상세 조회 (재시도 로직 포함)
async function getUserDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await userApi.axios.post('/api/sslvpn/user', {
      run_type: 'get',
      id: parameters,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getUserDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 사용자 등록 (재시도 로직 포함)
async function insertUserDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await userApi.axios.post('/api/sslvpn/user', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '사용자 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertUserDataInternal(data, retryCount - 1);
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
    return '사용자 정보 등록이 실패되었습니다.';
  }
}

// 사용자 수정 (재시도 로직 포함)
async function updateUserDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await userApi.axios.post('/api/sslvpn/user', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '사용자 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateUserDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '사용자 정보 수정이 실패되었습니다.';
  }
}

// 사용자 삭제 (재시도 로직 포함)
async function deleteUserDataInternal(parameters, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await userApi.axios.post('/api/sslvpn/user', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '사용자 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteUserDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '사용자 정보 삭제가 실패되었습니다.';
  }
}

const userApi = {
  ...baseApi,
  getUserList: getUserListInternal,
  getUserDetails: getUserDetailsInternal,
  insertUserData: insertUserDataInternal,
  updateUserData: updateUserDataInternal,
  deleteUserData: deleteUserDataInternal,
};

export default userApi;
