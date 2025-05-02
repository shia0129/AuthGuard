import baseApi from '@api/common/baseApi';

// 사이트 그룹 상태 목록 조회 (재시도 로직 포함)
async function getSiteGroupStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/site-group',
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getSiteGroupStatusListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 사이트 그룹 상태 상세 조회 (재시도 로직 포함)
async function getSiteGroupStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/site-group',
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
      return getSiteGroupStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 사이트 그룹 매핑 목록 조회 (재시도 로직 포함)
async function getMappingListAllWithSiteGroupIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/site-group',
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
      return getMappingListAllWithSiteGroupIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 사이트 그룹 상태 등록 (재시도 로직 포함)
async function insertSiteGroupStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/site-group',
      {
        run_type: 'add',
        ...data,
        signal,
      }
    );
    if (!result.data.errorYn) {
      return '사이트 그룹 정책이 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertSiteGroupStatusDataInternal(data, retryCount - 1);
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
    return '사이트 그룹 정책 등록이 실패되었습니다.';
  }
}

// 사이트 그룹 매핑 수정 (재시도 로직 포함)
async function updateMappingListWithSiteGroupIdInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/site-group',
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
      return updateMappingListWithSiteGroupIdInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 사이트 그룹 상태 삭제 (재시도 로직 포함)
async function deleteSiteGroupStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteGroupStatusApi.axios.post(
      '/api/sslswg/policy-manage/site-group',
      {
        run_type: 'del',
        data: parameters,
        signal,
      }
    );
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '사이트 그룹 정책이 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteSiteGroupStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '사이트 그룹 정책 삭제가 실패되었습니다.';
  }
}

const siteGroupStatusApi = {
  ...baseApi,

  getSiteGroupStatusList: getSiteGroupStatusListInternal,

  getSiteGroupStatusDetails: getSiteGroupStatusDetailsInternal,

  getMappingListAllWithSiteGroupId: getMappingListAllWithSiteGroupIdInternal,

  insertSiteGroupStatusData: insertSiteGroupStatusDataInternal,

  updateMappingListWithSiteGroupId: updateMappingListWithSiteGroupIdInternal,

  deleteSiteGroupStatusData: deleteSiteGroupStatusDataInternal,
};

export default siteGroupStatusApi;
