import baseApi from '@api/common/baseApi';

// 블랙리스트 그룹 상태 목록 조회 함수 (재시도 로직 포함)
async function getBlackListGroupStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list-group',
      {
        run_type: 'get',
        ...parameters,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      // 1초 대기 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getBlackListGroupStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 블랙리스트 그룹 상태 상세 조회 함수 (재시도 로직 포함)
async function getBlackListGroupStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list-group',
      {
        run_type: 'get',
        id: parameters,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getBlackListGroupStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 블랙리스트 그룹 상태 등록 함수 (재시도 로직 포함)
async function insertBlackListGroupStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list-group',
      {
        run_type: 'add',
        ...data,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return '블랙리스트 그룹 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertBlackListGroupStatusDataInternal(data, retryCount - 1);
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
    return '블랙리스트 그룹 정보 등록이 실패되었습니다.';
  }
}

// 블랙리스트 그룹 상태 수정 함수 (재시도 로직 포함)
async function updateBlackListGroupStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list-group',
      {
        run_type: 'put',
        ...data,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return '블랙리스트 그룹 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateBlackListGroupStatusDataInternal(data, retryCount - 1);
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
    return '블랙리스트 그룹 정보 수정이 실패되었습니다.';
  }
}

// 블랙리스트 그룹 활성화/비활성화 변경 함수 (재시도 로직 포함)
async function updateEnabledBlackListGroupStatusDataInternal({ data, enabled }, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list-group',
      {
        run_type: 'put',
        data,
        enabled,
        signal,
      }
    );
    if (!result.data.errorYn && result.data.data.count > 0) {
      return enabled
        ? '블랙리스트 그룹 정보가 활성화되었습니다.'
        : '블랙리스트 그룹 정보가 비활성화되었습니다.';
    }
    return '블랙리스트 그룹 활성화 여부 변경이 실패되었습니다.';
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateEnabledBlackListGroupStatusDataInternal({ data, enabled }, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '블랙리스트 그룹 활성화 여부 변경이 실패되었습니다.';
  }
}

// 블랙리스트 그룹 삭제 함수 (재시도 로직 포함)
async function deleteBlackListGroupStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list-group',
      {
        run_type: 'del',
        data: parameters,
        signal,
      }
    );
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '블랙리스트 그룹 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteBlackListGroupStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '블랙리스트 그룹 정보 삭제가 실패되었습니다.';
  }
}

const blackListGroupStatusApi = {
  ...baseApi,

  getBlackListGroupStatusList: getBlackListGroupStatusListInternal,

  getBlackListGroupStatusDetails: getBlackListGroupStatusDetailsInternal,

  insertBlackListGroupStatusData: insertBlackListGroupStatusDataInternal,

  updateBlackListGroupStatusData: updateBlackListGroupStatusDataInternal,

  updateEnabledBlackListGroupStatusData: updateEnabledBlackListGroupStatusDataInternal,

  deleteBlackListGroupStatusData: deleteBlackListGroupStatusDataInternal,
};

export default blackListGroupStatusApi;
