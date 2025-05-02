import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      id: '',
      value: '',
      type: '',
      enabled: '',
      page: 0,
    },
  },
  checkList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
};

const blackListStatus = createSlice({
  name: 'blackListStatus',
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
    resetState() {
      return initialState;
    },
  },
});

export default blackListStatus.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns, setCheckList, resetState } =
  blackListStatus.actions;
