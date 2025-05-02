import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      id: '',
      name: '',
      value: '',
      size: 10,
      page: 0,
    },
  },
  deleteList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
};

const srcIpGroupUpdateStatus = createSlice({
  name: 'srcIpGroupUpdateStatus',
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
    setDeleteList(state, action) {
      state.deleteList = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default srcIpGroupUpdateStatus.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setDeleteList,
  resetState,
} = srcIpGroupUpdateStatus.actions;
