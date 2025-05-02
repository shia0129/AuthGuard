import baseApi from '@api/common/baseApi';

// 로그 목록 조회 (재시도 로직 포함)
async function getLogListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await logApi.axios.post('/api/log', {
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
      return getLogListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 로그 개수 조회 (재시도 로직 포함)
async function getLogCountInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await logApi.axios.post('/api/log', {
      run_type: 'get',
      count: true,
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
      return getLogCountInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

const logApi = {
  ...baseApi,
  getLogList: getLogListInternal,
  getLogCount: getLogCountInternal,
};

export default logApi;
