import baseApi from '@api/common/baseApi';

// 블랙리스트 상태 목록 조회 (재시도 로직 포함)
async function getBlackListStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list',
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
      return getBlackListStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 블랙리스트 상세 조회 (사유 목록 포함) (재시도 로직 포함)
async function getReasonListAllWithBlackListIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list',
      {
        run_type: 'get',
        mode: 'reason',
        ...parameters,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getReasonListAllWithBlackListIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 블랙리스트 사유 수정 (재시도 로직 포함)
async function updateReasonListWithBlackListIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list',
      {
        run_type: 'put',
        mode: 'reason',
        ...parameters,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateReasonListWithBlackListIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 블랙리스트 활성화/비활성화 변경 (재시도 로직 포함)
async function updateEnabledBlackListStatusDataInternal({ data, enabled }, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await blackListStatusApi.axios.post(
      '/api/sslswg/policy-manage/black-list',
      {
        run_type: 'put',
        data,
        enabled,
        signal,
      }
    );
    if (!result.data.errorYn && result.data.data.count > 0) {
      return enabled
        ? '블랙리스트 정보가 활성화되었습니다.'
        : '블랙리스트 정보가 비활성화되었습니다.';
    }
    return '블랙리스트 활성화 여부 변경이 실패되었습니다.';
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateEnabledBlackListStatusDataInternal({ data, enabled }, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '블랙리스트 활성화 여부 변경이 실패되었습니다.';
  }
}

const blackListStatusApi = {
  ...baseApi,

  getBlackListStatusList: getBlackListStatusListInternal,

  getReasonListAllWithBlackListId: getReasonListAllWithBlackListIdInternal,

  updateReasonListWithBlackListId: updateReasonListWithBlackListIdInternal,

  updateEnabledBlackListStatusData: updateEnabledBlackListStatusDataInternal,
};

export default blackListStatusApi;
