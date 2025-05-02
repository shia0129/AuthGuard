import baseApi from '@api/common/baseApi';
import HsLib from '@modules/common/HsLib';

const departurePolicyHisApi = {
  ...baseApi,

  getDeparturePolicyHistoryList: async ({
    adminInfo: { seq },
    requestStartDate,
    requestEndDate,
    ...rest
  }) => {
    const result = await departurePolicyHisApi.axios.get(
      '/api/preferences/departure-policy-change-history',
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

  getDeparturePolicyHistoryExcelList: ({ adminInfo, ...rest }) => {
    return departurePolicyHisApi.axios.get(
      '/api/preferences/departure-policy-change-history/excel',
      {
        params: { ...rest, adminSeq: adminInfo.seq },
        responseType: 'blob',
      },
    );
  },
};

export default departurePolicyHisApi;
