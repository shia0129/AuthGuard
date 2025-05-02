import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      name: '',
      category: '',
      value: '',
      enabled: '',
      size: 10,
      page: 0,
    },
  },
  checkList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  searchOpenFlag: false,
};

const blackListGroupStatus = createSlice({
  name: 'blackListGroupStatus',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },
    setPageDataList(state, action) {
      state.pageDataList = action.payload.pageDataList;
      state.totalElements = action.payload.totalElements;
    },
    setListInfo(state, action) {
      state.listInfo = action.payload;
    },
    setColumns(state, action) {
      state.columns = action.payload;
    },
    setCheckList(state, action) {
      state.checkList = action.payload;
    },
    setSearchOpenFlag(state, action) {
      state.searchOpenFlag = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default blackListGroupStatus.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setCheckList,
  setSearchOpenFlag,
  resetState,
} = blackListGroupStatus.actions;
