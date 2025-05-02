import baseApi from '@api/common/baseApi';

// 블랙리스트 그룹 상태 목록 조회 (재시도 로직 포함)
async function getPatternGroupStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/pattern-group',
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
      // 1초 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getPatternGroupStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 블랙리스트 그룹 상태 상세 조회 (재시도 로직 포함)
async function getPatternGroupStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/pattern-group',
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
      return getPatternGroupStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 패턴 그룹 매핑 목록 조회 (재시도 로직 포함)
async function getMappingListAllWithPatternGroupIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/pattern-group',
      {
        run_type: 'get',
        mode: 'mapping',
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
      return getMappingListAllWithPatternGroupIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 패턴 그룹 상태 등록 (재시도 로직 포함)
async function insertPatternGroupStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/pattern-group',
      {
        run_type: 'add',
        ...data,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return '패턴 그룹 정책이 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertPatternGroupStatusDataInternal(data, retryCount - 1);
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
    return '패턴 그룹 정책 등록이 실패되었습니다.';
  }
}

// 패턴 그룹 매핑 수정 (재시도 로직 포함)
async function updateMappingListWithPatternGroupIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/pattern-group',
      {
        run_type: 'put',
        mode: 'mapping',
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
      return updateMappingListWithPatternGroupIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 패턴 그룹 상태 삭제 (재시도 로직 포함)
async function deletePatternGroupStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await patternGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/pattern-group',
      {
        run_type: 'del',
        data: parameters,
        signal,
      }
    );
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '패턴 그룹 정책이 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deletePatternGroupStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '패턴 그룹 정책 삭제가 실패되었습니다.';
  }
}

const patternGroupStatusApi = {
  ...baseApi,

  getPatternGroupStatusList: getPatternGroupStatusListInternal,

  getPatternGroupStatusDetails: getPatternGroupStatusDetailsInternal,

  getMappingListAllWithPatternGroupId: getMappingListAllWithPatternGroupIdInternal,

  insertPatternGroupStatusData: insertPatternGroupStatusDataInternal,

  updateMappingListWithPatternGroupId: updateMappingListWithPatternGroupIdInternal,

  deletePatternGroupStatusData: deletePatternGroupStatusDataInternal,
};

export default patternGroupStatusApi;
