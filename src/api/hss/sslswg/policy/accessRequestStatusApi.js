import baseApi from '@api/common/baseApi';

// accessRequestStatusApi 내부 함수들을 재시도 로직을 포함하여 정의합니다.

async function getAccessRequestStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accessRequestStatusApi.axios.post('/api/sslswg/access-request', {
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
      return getAccessRequestStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function getAccessRequestStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accessRequestStatusApi.axios.post('/api/sslswg/access-request', {
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
      return getAccessRequestStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function updateAccessRequestStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await accessRequestStatusApi.axios.post('/api/sslswg/access-request', {
      run_type: 'put',
      ...parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      const status = parameters.inUsed === '1' ? '허용' : '반려'; // fallback

      return `일괄 ${status} 처리되었습니다.`;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateAccessRequestStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '상태 변경에 실패했습니다.';
  }
}

const accessRequestStatusApi = {
  ...baseApi,

  getAccessRequestStatusList: getAccessRequestStatusListInternal,

  getAccessRequestStatusDetails: getAccessRequestStatusDetailsInternal,

  updateAccessRequestStatus: updateAccessRequestStatusDataInternal,
};

export default accessRequestStatusApi;
