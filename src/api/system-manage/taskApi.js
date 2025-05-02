import baseApi from '@api/common/baseApi';

const taskApi = {
  ...baseApi,

  getTaskList: (parameters) => {
    return taskApi.axios.get('/api/system-manage/settings/task', {
      params: parameters,
    });
  },

  saveTask: (parameters) => {
    return taskApi.axios.post('/api/system-manage/settings/task', parameters);
  },

  deleteTask: (parameters) => {
    return taskApi.axios.delete('/api/system-manage/settings/task', {
      data: parameters,
    });
  },
};

export default taskApi;
