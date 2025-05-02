import baseApi from '@api/common/baseApi';

const menuListCache = {};

const menuApi = {
  ...baseApi,

  getMenuList: async ({ useYn, isMenu, isEdit = false, signal, ...rest }) => {
    const key = JSON.stringify({ useYn, isMenu, ...rest });
    const cached = menuListCache[key];

    if (cached && !isEdit) {
      return cached;
    }

    try {
      const response = await menuApi.axios.get('/api/system/menus', {
        params: { useYn, isMenu, ...rest },
        signal,
      });

      menuListCache[key] = response;
      return response;
    } catch (error) {
      delete menuListCache[key]; // 요청 실패 시 캐시 삭제
      throw error;
    }
  },
};

export default menuApi;
