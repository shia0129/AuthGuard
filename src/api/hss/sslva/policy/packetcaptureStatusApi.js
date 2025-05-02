import baseApi from '@api/common/baseApi';

// 인증서 상태 목록 조회 (재시도 로직 포함)
async function getpacketcaptureListInternal(parameters, retryCount = 3) {
  console.log(parameters);
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const result = await packetcaptureStatusApi.axios.post('/api/pcapture', {
      run_type: 'get',
      ...parameters,
      signal,
    });

    console.log(result.data);
    return result.data;
    // if (!result.data.errorYn) {
    //   return result.data;
    // }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getpacketcaptureListInternal(parameters, retryCount - 1);
    }
    throw error;
  }
}

// 인증서 상태 상세 조회 (재시도 로직 포함)
// async function getCertStatusDetailsInternal(parameters, retryCount = 3) {
//   const controller = new AbortController();
//   const signal = controller.signal;
//   try {
//     const result = await certStatusApi.axios.post('/api/sslva/policy-manage/cert', {
//       run_type: 'get',
//       id: parameters,
//       signal,
//     });
//     if (!result.data.errorYn) {
//       return result.data.data;
//     }
//   } catch (error) {
//     if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return getCertStatusDetailsInternal(parameters, retryCount - 1);
//     }
//     throw error;
//   }
// }

// async function getCertNameListInternal(parameters, retryCount = 3) {
//   const controller = new AbortController();
//   const signal = controller.signal;
//   try {
//     const result = await certStatusApi.axios.post('/api/sslva/policy-manage/cert', {
//       run_type: 'get',
//       data: parameters,
//       certName: true,
//       signal,
//     });
//     if (!result.data.errorYn) {
//       return result.data.data;
//     }
//   } catch (error) {
//     if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return getCertNameListInternal(parameters, retryCount - 1);
//     }
//     throw error;
//   }
// }

// // 인증서 상태 등록 (재시도 로직 포함)
// async function insertCertStatusDataInternal(data, retryCount = 3) {
//   const controller = new AbortController();
//   const signal = controller.signal;

//   try {
//     const formData = new FormData();
//     formData.append('run_type', 'add');
//     formData.append('name', data.name);
//     formData.append('certFile', data.certFile);
//     formData.append('keyFile', data.keyFile);

//     const result = await certStatusApi.axios.post('/api/sslva/policy-manage/cert', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       signal,
//     });

//     if (!result.data.errorYn) {
//       return '인증서 정보가 등록 되었습니다.';
//     }
//   } catch (error) {
//     if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
//       await new Promise((r) => setTimeout(r, 1000));
//       return insertCertStatusDataInternal(data, retryCount - 1);
//     }

//     if (error.response?.data?.errorYn) {
//       const msg = error.response.data.error.errorMessage;
//       return typeof msg === 'object' ? Object.values(msg).flat().shift() : msg;
//     }

//     return '인증서 정보 등록이 실패되었습니다.';
//   }
// }

// 인증서 상태 수정 (재시도 로직 포함)
// async function updateCertStatusDataInternal(data, retryCount = 3) {
//   const controller = new AbortController();
//   const signal = controller.signal;
//   try {
//     const result = await certStatusApi.axios.post('/api/sslva/policy-manage/cert', {
//       run_type: 'put',
//       ...data,
//       signal,
//     });
//     if (!result.data.errorYn) {
//       return '인증서 정보가 수정 되었습니다.';
//     }
//   } catch (error) {
//     if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return updateCertStatusDataInternal(data, retryCount - 1);
//     }
//     if (error.response && error.response.data.errorYn) {
//       const errorMessage = error.response.data.error.errorMessage;
//       let finalErrorMessage = '';
//       if (typeof errorMessage === 'object') {
//         finalErrorMessage = Object.values(errorMessage).flat().shift();
//       } else {
//         finalErrorMessage = errorMessage;
//       }
//       return finalErrorMessage;
//     }
//     return '인증서 정보 수정이 실패되었습니다.';
//   }
// }

// 인증서 상태 삭제 (재시도 로직 포함)
// async function deleteCertStatusDataInternal(parameters, retryCount = 3) {
//   const controller = new AbortController();
//   const signal = controller.signal;
//   try {
//     const result = await certStatusApi.axios.post('/api/sslva/policy-manage/cert', {
//       run_type: 'del',
//       data: parameters,
//       signal,
//     });
//     if (!result.data.errorYn && result.data.data.count > 0) {
//       return '인증서 정보가 삭제 되었습니다.';
//     }
//   } catch (error) {
//     if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return deleteCertStatusDataInternal(parameters, retryCount - 1);
//     }
//     if (error.response && error.response.data.errorYn) {
//       return error.response.data.error.errorMessage;
//     }
//     return '인증서 정보 삭제가 실패되었습니다.';
//   }
// }

const packetcaptureStatusApi = {
  ...baseApi,
  getpacketcaptureList:  getpacketcaptureListInternal,
  // getCertStatusList: getCertStatusListInternal,
  // getCertNameList: getCertNameListInternal,
  // // getCertStatusDetails: getCertStatusDetailsInternal,
  // insertCertStatusData: insertCertStatusDataInternal,
  // // updateCertStatusData: updateCertStatusDataInternal,
  // deleteCertStatusData: deleteCertStatusDataInternal,
};

export default packetcaptureStatusApi;
