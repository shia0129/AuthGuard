import baseApi from '@api/common/baseApi';

// srcIpStatus 목록 조회 (재시도 로직 포함)
async function getSrcIpStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpStatusApi.axios.post('/api/sslswg/policy-manage/src-ip', {
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
      return getSrcIpStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// srcIpStatus 상세 조회 (재시도 로직 포함)
async function getSrcIpStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpStatusApi.axios.post('/api/sslswg/policy-manage/src-ip', {
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
      return getSrcIpStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// srcIpStatus 등록 (재시도 로직 포함)
async function insertSrcIpStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpStatusApi.axios.post('/api/sslswg/policy-manage/src-ip', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '출발지IP 정책이 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertSrcIpStatusDataInternal(data, retryCount - 1);
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
    return '출발지IP 정책 등록이 실패되었습니다.';
  }
}

// srcIpStatus 수정 (재시도 로직 포함)
async function updateSrcIpStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpStatusApi.axios.post('/api/sslswg/policy-manage/src-ip', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '출발지IP 정책이 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateSrcIpStatusDataInternal(data, retryCount - 1);
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
    return '출발지IP 정책 수정이 실패되었습니다.';
  }
}

// srcIpStatus 삭제 (재시도 로직 포함)
async function deleteSrcIpStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpStatusApi.axios.post('/api/sslswg/policy-manage/src-ip', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '출발지IP 정책이 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteSrcIpStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '출발지IP 정책 삭제가 실패되었습니다.';
  }
}

const srcIpStatusApi = {
  ...baseApi,

  getSrcIpStatusList: getSrcIpStatusListInternal,

  getSrcIpStatusDetails: getSrcIpStatusDetailsInternal,

  insertSrcIpStatusData: insertSrcIpStatusDataInternal,

  updateSrcIpStatusData: updateSrcIpStatusDataInternal,

  deleteSrcIpStatusData: deleteSrcIpStatusDataInternal,
};

export default srcIpStatusApi;
