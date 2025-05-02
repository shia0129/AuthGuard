import baseApi from '@api/common/baseApi';

// 세그먼트 목록 조회 (재시도 로직 포함)
async function getSegmentStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await segmentStatusApi.axios.post('/api/sslva/policy-manage/segment', {
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
      return getSegmentStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 세그먼트 상세 조회 (재시도 로직 포함)
async function getSegmentStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await segmentStatusApi.axios.post('/api/sslva/policy-manage/segment', {
      run_type: 'get',
      id: parameters,
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
      return getSegmentStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 세그먼트 컬럼 목록 조회 (재시도 로직 포함)
async function getSegmentStatusColumnListInternal(parameter, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await segmentStatusApi.axios.post('/api/sslva/policy-manage/segment', {
      run_type: 'get',
      column: parameter,
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
      return getSegmentStatusColumnListInternal(parameter, retryCount - 1);
    }
    throw error;
  }
}

// 세그먼트 등록 (재시도 로직 포함)
async function insertSegmentStatusDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await segmentStatusApi.axios.post('/api/sslva/policy-manage/segment', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return `세그먼트 정보가 등록 되었습니다.\n세그먼트를 시작하시기 바랍니다.`;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertSegmentStatusDataInternal(data, retryCount - 1);
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
    return '세그먼트 정보 등록이 실패되었습니다.';
  }
}

// 세그먼트 수정 (재시도 로직 포함)
async function updateSegmentStatusDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await segmentStatusApi.axios.post('/api/sslva/policy-manage/segment', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return `세그먼트 정보가 수정 되었습니다.\n세그먼트를 재시작하시기 바랍니다.`;
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateSegmentStatusDataInternal(data, retryCount - 1);
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
    return '세그먼트 정보 수정이 실패되었습니다.';
  }
}

// 세그먼트 상태 수정 (updateSegmentStatus) (재시도 로직 포함)
async function updateSegmentStatusInternal(id, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await segmentStatusApi.axios.post('/api/sslva/policy-manage/segment', {
      run_type: 'put',
      status: true,
      name: id,
      signal,
    });
    if (!result.data.errorYn) {
      return '세그먼트 상태 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateSegmentStatusInternal(id, retryCount - 1);
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
    return '세그먼트 상태 정보 수정이 실패되었습니다.';
  }
}

// 세그먼트 삭제 (재시도 로직 포함)
async function deleteSegmentStatusDataInternal(parameters, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await segmentStatusApi.axios.post('/api/sslva/policy-manage/segment', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '세그먼트 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteSegmentStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '세그먼트 정보 삭제가 실패되었습니다.';
  }
}

const segmentStatusApi = {
  ...baseApi,
  getSegmentStatusList: getSegmentStatusListInternal,
  getSegmentStatusDetails: getSegmentStatusDetailsInternal,
  getSegmentStatusColumnList: getSegmentStatusColumnListInternal,
  insertSegmentStatusData: insertSegmentStatusDataInternal,
  updateSegmentStatusData: updateSegmentStatusDataInternal,
  updateSegmentStatus: updateSegmentStatusInternal,
  deleteSegmentStatusData: deleteSegmentStatusDataInternal,
};

export default segmentStatusApi;
