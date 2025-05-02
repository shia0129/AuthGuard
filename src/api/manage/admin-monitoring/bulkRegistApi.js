import baseApi from '@api/common/baseApi';

const bulkRegistApi = {
  ...baseApi,

  getBulkRegistHistoryList: async (parameters) => {
    // TODO: 일괄 등록 이력 조회 API 연결.
    // const result = await bulkRegistApi.axios.get('', {
    //   params: parameters,
    // });
    // if (!result.data.errorYn) {
    //   return result.data.data;
    // }
  },

  getFailFileDownloadExcelList: (parameters) => {
    // TODO: 일괄 등록 이력 실패 파일 다운로드 API 연결.
    // return bulkRegistApi.axios.get(
    //   '',
    //   {
    //     params: parameters,
    //     responseType: 'blob',
    //   },
    // );
  },
};

export default bulkRegistApi;
