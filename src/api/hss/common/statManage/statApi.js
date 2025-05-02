import baseApi from '@api/common/baseApi';

// NetData 일정기간 동안의 합산 데이터 또는 TopX 합산 데이터 조회(재시도 로직 포함)
async function getStatTopListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await statApi.axios.post('/api/stat', {
      run_type: 'get',
      top_list: true,
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
      return getStatTopListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// NetData 일정기간 동안의 초/분/시/일/월 데이터 또는 TopX 순위 초/분/시/일/월 데이터 조회(재시도 로직 포함)
async function getStatSumDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const result = await statApi.axios.post('/api/stat', {
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
      return getStatSumDataInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

const statApi = {
  ...baseApi,
  getStatTopList: getStatTopListInternal,
  getStatSumData: getStatSumDataInternal,
};

export default statApi;
