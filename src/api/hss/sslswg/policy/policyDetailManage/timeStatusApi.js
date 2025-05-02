import baseApi from '@api/common/baseApi';

async function getTimeStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await timeStatusApi.axios.post('/api/sslswg/policy-manage/time', {
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
      return getTimeStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function getTimeStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await timeStatusApi.axios.post('/api/sslswg/policy-manage/time', {
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
      return getTimeStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function insertTimeStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await timeStatusApi.axios.post('/api/sslswg/policy-manage/time', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '스케줄 정책이 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertTimeStatusDataInternal(data, retryCount - 1);
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
    return '스케줄 정책 등록이 실패되었습니다.';
  }
}

async function updateTimeStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await timeStatusApi.axios.post('/api/sslswg/policy-manage/time', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '스케줄 정책이 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateTimeStatusDataInternal(data, retryCount - 1);
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
    return '스케줄 정책 수정이 실패되었습니다.';
  }
}

async function deleteTimeStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await timeStatusApi.axios.post('/api/sslswg/policy-manage/time', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '스케줄 정책이 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteTimeStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '스케줄 정책 삭제가 실패되었습니다.';
  }
}

const timeStatusApi = {
  ...baseApi,
  getTimeStatusList: getTimeStatusListInternal,
  getTimeStatusDetails: getTimeStatusDetailsInternal,
  insertTimeStatusData: insertTimeStatusDataInternal,
  updateTimeStatusData: updateTimeStatusDataInternal,
  deleteTimeStatusData: deleteTimeStatusDataInternal,
};

export default timeStatusApi;
