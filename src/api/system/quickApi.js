const quickApi = {
  axios: null,

  getQuickMenuList: () => {
    return quickApi.axios.get('/api/system/quicks');
  },
  insertQuickMenu: (parameters) => {
    return quickApi.axios.post('/api/system/quicks/', parameters);
  },
  deleteQuickMenu: (parameters) => {
    return quickApi.axios.delete('/api/system/quicks', { data: parameters });
  },
};

export default quickApi;
