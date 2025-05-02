import baseApi from '@api/common/baseApi';

async function getSiteStatusListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteStatusApi.axios.post('/api/sslswg/policy-manage/site', {
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
      return getSiteStatusListInternal(parameters, retryCount - 1);
    }
    // 필요에 따라 여기서 에러 메시지 처리를 추가할 수 있습니다.
    throw error;
  }
}

async function getSiteStatusDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteStatusApi.axios.post('/api/sslswg/policy-manage/site', {
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
      return getSiteStatusDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

async function insertSiteStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    console.log(data);
    const result = await siteStatusApi.axios.post('/api/sslswg/policy-manage/site', {
      run_type: 'add',
      ...data,
      signal,
    });

    if (!result.data.errorYn) {
      return '사이트 정책이 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertSiteStatusDataInternal(data, retryCount - 1);
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
    return '사이트 정책 등록이 실패되었습니다.';
  }
}

async function updateSiteStatusDataInternal(data, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteStatusApi.axios.post('/api/sslswg/policy-manage/site', {
      run_type: 'put',
      ...data,
      signal,
    });

    if (!result.data.errorYn) {
      return '사이트 정책이 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateSiteStatusDataInternal(data, retryCount - 1);
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
    return '사이트 정책 수정이 실패되었습니다.';
  }
}

async function deleteSiteStatusDataInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await siteStatusApi.axios.post('/api/sslswg/policy-manage/site', {
      run_type: 'del',
      data: parameters,
      signal,
    });

    if (!result.data.errorYn && result.data.data.count > 0) {
      return '사이트 정책이 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteSiteStatusDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '사이트 정책 삭제가 실패되었습니다.';
  }
}

const siteStatusApi = {
  ...baseApi,

  getSiteStatusList: getSiteStatusListInternal,

  getSiteStatusDetails: getSiteStatusDetailsInternal,

  insertSiteStatusData: insertSiteStatusDataInternal,

  updateSiteStatusData: updateSiteStatusDataInternal,

  deleteSiteStatusData: deleteSiteStatusDataInternal,
};

export default siteStatusApi;
