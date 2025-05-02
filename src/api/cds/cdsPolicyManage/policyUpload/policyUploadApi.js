import baseApi from '@api/common/baseApi';

const policyUploadApi = {
  ...baseApi,

  getPolicyFileVerify: async (fileList) => {
    const formData = new FormData();

    fileList.forEach((file) => formData.append('file', file));
    const result = await policyUploadApi.axios.put('/api/cds/policy-upload', formData);

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  insertPolicyFile: async (parameters) => {
    const result = await policyUploadApi.axios.post('/api/cds/policy-upload', {
      policies: parameters,
    });

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },
};

export default policyUploadApi;
