import baseApi from '@api/common/baseApi';

// 패턴 상태 목록 조회 (재시도 로직 포함)
async function getPatternStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternStatusApi.axios.post('/api/sslswg/policy-manage/pattern', {
      run_type: 'get',
      ...parameters,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      // 1초 대기 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getPatternStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 패턴 상태 상세 조회 (재시도 로직 포함)
async function getPatternStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternStatusApi.axios.post('/api/sslswg/policy-manage/pattern', {
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
      return getPatternStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 패턴 상태 등록 (재시도 로직 포함)
async function insertPatternStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternStatusApi.axios.post('/api/sslswg/policy-manage/pattern', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '패턴 정책이 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertPatternStatusDataInternal(data, retryCount - 1);
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
    return '패턴 정책 등록이 실패되었습니다.';
  }
}

// 패턴 상태 수정 (재시도 로직 포함)
async function updatePatternStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternStatusApi.axios.post('/api/sslswg/policy-manage/pattern', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '패턴 정책이 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updatePatternStatusDataInternal(data, retryCount - 1);
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
    return '패턴 정책 수정이 실패되었습니다.';
  }
}

// 패턴 상태 삭제 (재시도 로직 포함)
async function deletePatternStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternStatusApi.axios.post('/api/sslswg/policy-manage/pattern', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '패턴 정책이 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deletePatternStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '패턴 정책 삭제가 실패되었습니다.';
  }
}

const patternStatusApi = {
  ...baseApi,

  getPatternStatusList: getPatternStatusListInternal,

  getPatternStatusDetails: getPatternStatusDetailsInternal,

  insertPatternStatusData: insertPatternStatusDataInternal,

  updatePatternStatusData: updatePatternStatusDataInternal,

  deletePatternStatusData: deletePatternStatusDataInternal,
};

export default patternStatusApi;
