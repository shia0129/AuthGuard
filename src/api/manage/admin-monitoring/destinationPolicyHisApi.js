import baseApi from '@api/common/baseApi';
import HsLib from '@modules/common/HsLib';

const destinationPolicyHisApi = {
  ...baseApi,

  getDestinationPolicyHistoryList: async ({
    adminInfo: { seq },
    requestStartDate,
    requestEndDate,
    ...rest
  }) => {
    const result = await destinationPolicyHisApi.axios.get(
      '/api/preferences/destination-policy-change-history',
      {
        params: {
          ...rest,
          adminSeq: seq,
          requestStartDate: HsLib.removeDateTimeFormat(requestStartDate),
          requestEndDate: HsLib.removeDateTimeFormat(requestEndDate),
        },
      },
    );

    if (!result.data.errorYn) {
      return result.data.data;
    }
  },

  getDestinationPolicyHistoryExcelList: ({ adminInfo, ...rest }) => {
    return destinationPolicyHisApi.axios.get(
      '/api/preferences/destination-policy-change-history/excel',
      {
        params: { ...rest, adminSeq: adminInfo.seq },
        responseType: 'blob',
      },
    );
  },
};

export default destinationPolicyHisApi;
