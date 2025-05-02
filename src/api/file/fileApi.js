import baseApi from '@api/common/baseApi';

const fileApi = {
  ...baseApi,

  getBoardFile: (parameters) => {
    return fileApi.axios.get(`/api/files/${parameters}`, {
      responseType: 'blob',
    });
  },

  /** 업로드 확장자 허용 여부 확인 함수.
   *
   * filesName : 업로드 파일명
   */
  checkFilesExtension: (filesName) => {
    return fileApi.axios.get('/api/files/checkExtension', {
      params: {
        filesName: filesName.join(','),
      },
    });
  },
};

export default fileApi;
