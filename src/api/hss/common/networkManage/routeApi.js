import baseApi from '@api/common/baseApi';

// 라우팅 목록 조회 (재시도 로직 포함)
async function getRouteListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await routeApi.axios.post('/api/route', {
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
      return getRouteListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 라우팅 상세 조회 (재시도 로직 포함)
async function getRouteDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await routeApi.axios.post('/api/route', {
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
      return getRouteDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 라우팅 컬럼 목록 조회 (재시도 로직 포함)
async function getRouteColumnListInternal(parameter, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await routeApi.axios.post('/api/route', {
      run_type: 'get',
      column: parameter,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getRouteColumnListInternal(parameter, retryCount - 1);
    }
    throw error;
  }
}

// 라우팅 멤버 목록 조회 (재시도 로직 포함)
async function getRouteMemberListInternal(parameter, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await routeApi.axios.post('/api/route', {
      run_type: 'get',
      member: parameter,
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getRouteMemberListInternal(parameter, retryCount - 1);
    }
    throw error;
  }
}

// 라우팅 등록 (재시도 로직 포함)
async function insertRouteDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await routeApi.axios.post('/api/route', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '라우팅 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertRouteDataInternal(data, retryCount - 1);
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
  }
  return '라우팅 정보 등록이 실패되었습니다.';
}

// 라우팅 수정 (재시도 로직 포함)
async function updateRouteDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await routeApi.axios.post('/api/route', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '라우팅 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateRouteDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
  }
  return '라우팅 정보 수정이 실패되었습니다.';
}

// 라우팅 삭제 (재시도 로직 포함)
async function deleteRouteDataInternal(parameters, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await routeApi.axios.post('/api/route', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '라우팅 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteRouteDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
  }
  return '라우팅 정보 삭제가 실패되었습니다.';
}

const routeApi = {
  ...baseApi,
  getRouteList: getRouteListInternal,
  getRouteDetails: getRouteDetailsInternal,
  getRouteColumnList: getRouteColumnListInternal,
  getRouteMemberList: getRouteMemberListInternal,
  insertRouteData: insertRouteDataInternal,
  updateRouteData: updateRouteDataInternal,
  deleteRouteData: deleteRouteDataInternal,
};

export default routeApi;
