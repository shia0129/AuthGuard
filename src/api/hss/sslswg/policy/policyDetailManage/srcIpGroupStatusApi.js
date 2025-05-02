import baseApi from '@api/common/baseApi';

// srcIpGroupStatusApi 내부 함수들을 재시도 로직을 포함하여 정의합니다.

async function getSrcIpGroupStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/src-ip-group',
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
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getSrcIpGroupStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function getSrcIpGroupStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/src-ip-group',
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
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getSrcIpGroupStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function getMappingListAllWithSrcIpGroupIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/src-ip-group',
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
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getMappingListAllWithSrcIpGroupIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function insertSrcIpGroupStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/src-ip-group',
      {
        run_type: 'add',
        ...data,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return '출발지IP 그룹 정책이 등록 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertSrcIpGroupStatusDataInternal(data, retryCount - 1);
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
    return '출발지IP 그룹 정책 등록이 실패되었습니다.';
  }
}

async function updateMappingListWithSrcIpGroupIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/src-ip-group',
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
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateMappingListWithSrcIpGroupIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function deleteSrcIpGroupStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await srcIpGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/src-ip-group',
      {
        run_type: 'del',
        data: parameters,
        signal,
      }
    );
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '출발지IP 그룹 정책이 삭제 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteSrcIpGroupStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '출발지IP 그룹 정책 삭제가 실패되었습니다.';
  }
}

const srcIpGroupStatusApi = {
  ...baseApi,

  getSrcIpGroupStatusList: getSrcIpGroupStatusListInternal,

  getSrcIpGroupStatusDetails: getSrcIpGroupStatusDetailsInternal,

  getMappingListAllWithSrcIpGroupId: getMappingListAllWithSrcIpGroupIdInternal,

  insertSrcIpGroupStatusData: insertSrcIpGroupStatusDataInternal,

  updateMappingListWithSrcIpGroupId: updateMappingListWithSrcIpGroupIdInternal,

  deleteSrcIpGroupStatusData: deleteSrcIpGroupStatusDataInternal,
};

export default srcIpGroupStatusApi;
