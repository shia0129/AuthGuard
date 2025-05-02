import baseApi from '@api/common/baseApi';

async function getVersionDetailInternal(retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await versionApi.axios.post('/api/system/version', {
      run_type: 'get',
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      // 1초 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getVersionDetailInternal(retryCount - 1);
    }
    throw error;
  }
}

const versionApi = {
  ...baseApi,
  getVersionDetail: getVersionDetailInternal,
};

export default versionApi;
