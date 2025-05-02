import { hsApi } from '@api/api';

const gridInfoCache = {};
const comboInfoCache = {};
const baseApi = {
  axios: null,

  getGridInfo: async (listCode) => {
    const cached = gridInfoCache[`${listCode}`];
    if (!cached) {
      gridInfoCache[`${listCode}`] = await hsApi.get('/api/gridInfo?listCode=' + listCode);
      return gridInfoCache[`${listCode}`];
    }
    return cached;
  },
  getComboInfo: async (code) => {
    const cached = comboInfoCache[`${code}`];
    if (!cached) {
      comboInfoCache[`${code}`] = await hsApi.get(
        '/api/system/codes/all?codeType=' + code + '&deleteYn=N',
      );
      return comboInfoCache[`${code}`];
    }
    return cached;
  },
};

export default baseApi;
