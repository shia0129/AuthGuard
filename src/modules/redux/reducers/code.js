import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allCodeList: [], // 전체 코드 데이터.
  gridCodeCache: {}, // 그리드 코드 캐싱.
  codeCacheList: {}, // 코드 타입 별 캐싱.
};

const code = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setCodeCacheList(state, action) {
      state.codeCacheList = { ...state.codeCacheList, ...action.payload };
    },
    setAllCodeList: (state, action) => {
      state.allCodeList = action.payload;
    },
    setGridCodeCache: (state, action) => {
      const { name, value } = action.payload;

      state.gridCodeCache = {
        ...state.gridCodeCache,
        [name]: { ...state.gridCodeCache[`${name}`], ...value },
      };
    },
    resetGridCodeCache: (state) => {
      state.gridCodeCache = {};
    },
  },
});

export default code.reducer;

export const { setCodeCacheList, setAllCodeList, setGridCodeCache, resetGridCodeCache } =
  code.actions;
