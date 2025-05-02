import baseApi from '@api/common/baseApi';

async function getServiceStatusInternal({ hasToken = true }, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await dashboardApi.axios.get('/api/system/service/status', {
      headers: {
        Authorization: '',
      },
      ...(!hasToken && { headers: { Authorization: '' } }),
      signal,
    });
    return result;
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getServiceStatusInternal({ hasToken }, retryCount - 1);
    }
    throw error;
  }
}

async function getDashboardDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await dashboardApi.axios.get('/api/system/dashboard/data', {
      run_type: 'get',
      ...parameters,
      signal,
    });
    return result;
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getDashboardDataInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

const dashboardApi = {
  ...baseApi,

  getServiceStatus: ({ hasToken = true }) => getServiceStatusInternal({ hasToken }),
  getDashboardData: getDashboardDataInternal,
};

export default dashboardApi;
