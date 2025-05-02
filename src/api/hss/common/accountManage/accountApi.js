import baseApi from '@api/common/baseApi';

async function getAccountListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accountApi.axios.post('/api/account', {
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
      return getAccountListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function getAccountDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accountApi.axios.post('/api/account', {
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
      return getAccountDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function insertAccountDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await accountApi.axios.post(
      '/api/account',
      {
        run_type: 'add',
        ...data,
        signal,
      },
      { timeout: 60000 }
    );
    if (!result.data.errorYn) {
      return '계정 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertAccountDataInternal(data, retryCount - 1);
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
    return '계정 정보 등록이 실패되었습니다.';
  }
}

async function updateAccountDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await accountApi.axios.post('/api/account', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '계정 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateAccountDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '계정 정보 수정이 실패되었습니다.';
  }
}

async function deleteAccountDataInternal(parameters, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await accountApi.axios.post('/api/account', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '계정 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteAccountDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '계정 정보 삭제가 실패되었습니다.';
  }
}

const accountApi = {
  ...baseApi,
  getAccountList: getAccountListInternal,
  getAccountDetails: getAccountDetailsInternal,
  insertAccountData: insertAccountDataInternal,
  updateAccountData: updateAccountDataInternal,
  deleteAccountData: deleteAccountDataInternal,
};

export default accountApi;
