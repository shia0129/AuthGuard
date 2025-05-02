import baseApi from '@api/common/baseApi';

const noticeApi = {
  ...baseApi,

  getNoticeList: async (parameters) => {
    const result = await noticeApi.axios.get('/api/community/boards', {
      params: parameters,
    });

    if (!result.data.errorYn) {
      return result;
    }
  },

  getNoticeDetails: (parameters) => {
    return noticeApi.axios.get(`/api/community/boards/${parameters}`);
  },

  insertNotice: (data) => {
    return noticeApi.axios.post('/api/community/boards', data);
  },

  updateNotice: (data) => {
    return noticeApi.axios.put('/api/community/boards', data);
  },

  deleteNotice: (id) => {
    return noticeApi.axios.delete('/api/community/boards', { data: id });
  },
};

export default noticeApi;
