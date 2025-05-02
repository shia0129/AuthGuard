import baseApi from '@api/common/baseApi';

const historyApi = {
  ...baseApi,

  getHistoryList: (parameters) => {
    return historyApi.axios.get('/api/data-transmission/status/history', {
      params: {
        periodDate: `${parameters.requestStartDate.format(
          'YYYYMMDD',
        )}-${parameters.requestEndDate.format('YYYYMMDD')}`,
        ...parameters,
      },
    });
  },
};

export default historyApi;
