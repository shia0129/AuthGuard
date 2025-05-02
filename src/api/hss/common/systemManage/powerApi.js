import baseApi from '@api/common/baseApi';

// shutdown 재시도 로직 포함 함수
async function shutdownInternal(retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await powerApi.axios.post('/api/system/power', {
      action: 'shutdown',
      signal,
    });
    return result;
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return shutdownInternal(retryCount - 1);
    }
    throw error;
  }
}

// reboot 재시도 로직 포함 함수
async function rebootInternal(retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await powerApi.axios.post('/api/system/power', {
      action: 'reboot',
      signal,
    });
    return result;
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return rebootInternal(retryCount - 1);
    }
    throw error;
  }
}

const powerApi = {
  ...baseApi,
  shutdown: shutdownInternal,
  reboot: rebootInternal,
};

export default powerApi;
