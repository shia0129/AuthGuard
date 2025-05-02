import baseApi from '@api/common/baseApi';

// 인터페이스 목록 조회 (재시도 로직 포함)
async function getInterfaceListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await interfaceApi.axios.post('/api/interface', {
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
      return getInterfaceListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 인터페이스 상세 조회 (재시도 로직 포함)
async function getInterfaceDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await interfaceApi.axios.post('/api/interface', {
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
      return getInterfaceDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 인터페이스 컬럼 목록 조회 (재시도 로직 포함)
async function getInterfaceColumnListInternal(parameter, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await interfaceApi.axios.post('/api/interface', {
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
      return getInterfaceColumnListInternal(parameter, retryCount - 1);
    }
    throw error;
  }
}

// 인터페이스 멤버 목록 조회 (재시도 로직 포함)
async function getInterfaceMemberListInternal(parameter, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await interfaceApi.axios.post('/api/interface', {
      run_type: 'get',
      member: parameter,
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
      return getInterfaceMemberListInternal(parameter, retryCount - 1);
    }
    throw error;
  }
}

// 인터페이스 등록 (재시도 로직 포함)
async function insertInterfaceDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await interfaceApi.axios.post('/api/interface', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '인터페이스 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertInterfaceDataInternal(data, retryCount - 1);
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
    return '인터페이스 정보 등록이 실패되었습니다.';
  }
}

// 인터페이스 수정 (재시도 로직 포함)
async function updateInterfaceDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await interfaceApi.axios.post('/api/interface', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return '인터페이스 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateInterfaceDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '인터페이스 정보 수정이 실패되었습니다.';
  }
}

// 인터페이스 삭제 (재시도 로직 포함)
async function deleteInterfaceDataInternal(parameters, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await interfaceApi.axios.post('/api/interface', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return '인터페이스 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if (
      (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteInterfaceDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return '인터페이스 정보 삭제가 실패되었습니다.';
  }
}

const interfaceApi = {
  ...baseApi,
  getInterfaceList: getInterfaceListInternal,
  getInterfaceDetails: getInterfaceDetailsInternal,
  getInterfaceColumnList: getInterfaceColumnListInternal,
  getInterfaceMemberList: getInterfaceMemberListInternal,
  insertInterfaceData: insertInterfaceDataInternal,
  updateInterfaceData: updateInterfaceDataInternal,
  deleteInterfaceData: deleteInterfaceDataInternal,
};

export default interfaceApi;
