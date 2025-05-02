import baseApi from '@api/common/baseApi';

const versionApi = {
  ...baseApi,

  getVersionDetail: () => {
    return versionApi.axios.get(`/api/system/version`);
    // return versionApi.axios.get(`/api/system/admins/version`);
  },
};

export default versionApi;
