import baseApi from '@api/common/baseApi';


async function getZoneMakeInfoInternal(retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
      run_type: 'get',
      mkinfo: 'true',
      signal,
    });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getZoneListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// ZONE 목록 조회 (재시도 로직 포함)
async function getZoneListInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
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
      return getZoneListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// ZONE 상세 조회 (재시도 로직 포함)
async function getZoneDetailsInternal(parameters, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
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
      return getZoneDetailsInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// ZONE 컬럼 목록 조회 (재시도 로직 포함)
async function getZoneColumnListInternal(parameter, retryCount = 3) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
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
      return getZoneColumnListInternal(parameter, retryCount - 1);
    }
    throw error;
  }
}

// ZONE 등록 (재시도 로직 포함)
async function insertZoneDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
      run_type: 'add',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return 'ZONE 정보가 등록 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertZoneDataInternal(data, retryCount - 1);
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
    return 'ZONE 정보 등록이 실패되었습니다.';
  }
}

// ZONE 수정 (재시도 로직 포함)
async function updateZoneDataInternal(data, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
      run_type: 'put',
      ...data,
      signal,
    });
    if (!result.data.errorYn) {
      return 'ZONE 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateZoneDataInternal(data, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return 'ZONE 정보 수정이 실패되었습니다.';
  }
}

// ZONE 상태 수정 (재시도 로직 포함)
async function updateZoneStatusInternal(id, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
      run_type: 'put',
      status: true,
      name: id,
      signal,
    });
    if (!result.data.errorYn) {
      return 'ZONE 상태 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateZoneStatusInternal(id, retryCount - 1);
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
    return 'ZONE 상태 정보 수정이 실패되었습니다.';
  }
}

// ZONE 삭제 (재시도 로직 포함)
async function deleteZoneDataInternal(parameters, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
      run_type: 'del',
      data: parameters,
      signal,
    });
    if (!result.data.errorYn && result.data.data.count > 0) {
      return 'ZONE 정보가 삭제 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteZoneDataInternal(parameters, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      return error.response.data.error.errorMessage;
    }
    return 'ZONE 정보 삭제가 실패되었습니다.';
  }
}

const zoneApi = {
  ...baseApi,
  getZoneMakeInfo : getZoneMakeInfoInternal,
  getZoneList: getZoneListInternal,
  getZoneDetails: getZoneDetailsInternal,
  getZoneColumnList: getZoneColumnListInternal,
  insertZoneData: insertZoneDataInternal,
  updateZoneData: updateZoneDataInternal,
  updateZoneStatus: updateZoneStatusInternal,
  deleteZoneData: deleteZoneDataInternal,
};

export default zoneApi;
