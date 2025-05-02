import baseApi from '@api/common/baseApi';

const commandApi = {
  ...baseApi,

  getCommandList: (parameters) => {
    return commandApi.axios.get('/api/system-manage/settings/command', {
      params: parameters,
    });
  },
  saveCommand: (parameters) => {
    return commandApi.axios.post('/api/system-manage/settings/command', parameters);
  },
  deleteCommand: (parameters) => {
    return commandApi.axios.delete('/api/system-manage/settings/command', {
      data: parameters,
    });
  },
};

export default commandApi;
