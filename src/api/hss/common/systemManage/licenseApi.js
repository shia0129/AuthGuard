import baseApi from '@api/common/baseApi';

async function insertLicenseDataInternal(fileList, retryCount = 3) {
  const formData = new FormData();
  fileList.forEach((file) => formData.append('file', file));
  formData.append('run_type', 'add');

  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const result = await licenseApi.axios.post('/api/system/license', formData, { signal });
    if (!result.data.errorYn) {
      return result.data.data;
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      // 1초 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return insertLicenseDataInternal(fileList, retryCount - 1);
    }
    throw error;
  }
}

const licenseApi = {
  ...baseApi,
  insertLicenseData: insertLicenseDataInternal,
};

export default licenseApi;
