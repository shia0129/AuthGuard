import baseApi from '@api/common/baseApi';

// 프로토콜 상태 목록 조회 (재시도 로직 포함)
async function getProtocolStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await protocolStatusApi.axios.post('/api/sslva/policy-manage/protocol', {
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
      return getProtocolStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 프로토콜 상태 상세 조회 (재시도 로직 포함)
async function getProtocolStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await protocolStatusApi.axios.post('/api/sslva/policy-manage/protocol', {
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
      return getProtocolStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function getProtocolTypeListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await protocolStatusApi.axios.post('/api/sslva/policy-manage/protocol', {
      run_type: 'get',
      data: parameters,
      protocolType: true,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getProtocolTypeListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 프로토콜 상태 등록 (재시도 로직 포함)
async function insertProtocolStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await protocolStatusApi.axios.post('/api/sslva/policy-manage/protocol', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '프로토콜 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertProtocolStatusDataInternal(data, retryCount - 1);
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
    return '프로토콜 정보 등록이 실패되었습니다.';
  }
}

// 프로토콜 상태 수정 (재시도 로직 포함)
async function updateProtocolStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await protocolStatusApi.axios.post('/api/sslva/policy-manage/protocol', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '프로토콜 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateProtocolStatusDataInternal(data, retryCount - 1);
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
    return '프로토콜 정보 수정이 실패되었습니다.';
  }
}

// 프로토콜 상태 삭제 (재시도 로직 포함)
async function deleteProtocolStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await protocolStatusApi.axios.post('/api/sslva/policy-manage/protocol', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '프로토콜 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteProtocolStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '프로토콜 정보 삭제가 실패되었습니다.';
  }
}

const protocolStatusApi = {
  ...baseApi,
  getProtocolStatusList: getProtocolStatusListInternal,
  getProtocolTypeList: getProtocolTypeListInternal,
  getProtocolStatusDetails: getProtocolStatusDetailsInternal,
  insertProtocolStatusData: insertProtocolStatusDataInternal,
  updateProtocolStatusData: updateProtocolStatusDataInternal,
  deleteProtocolStatusData: deleteProtocolStatusDataInternal,
};

export default protocolStatusApi;
