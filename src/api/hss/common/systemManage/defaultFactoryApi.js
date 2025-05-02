import baseApi from '@api/common/baseApi';

// 장비 초기화 API (재시도 로직 포함)
async function defaultFactoryInternal(retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await defaultFactoryApi.axios.post('/api/system/default-factory', {
      action: 'start',
      signal,
    });
    return result;
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      // 요청이 취소된 경우 1초 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return defaultFactoryInternal(retryCount - 1);
    }
    throw error;
  }
}

const defaultFactoryApi = {
  ...baseApi,
  defaultFactory: defaultFactoryInternal,
};

export default defaultFactoryApi;
