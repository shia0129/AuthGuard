import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      name: '',
      proxyType: '',
      protocolTypeId: '',
      size: 10,
      page: 0,
    },
  },
  deleteList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  protocolTypeList: [],
  certNameList: [],
};

const policyDetailStatus = createSlice({
  name: 'policyDetailStatus',
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
    setSearchOpenFlag(state, action) {
      state.searchOpenFlag = action.payload;
    },
    setProtocolTypeList(state, action) {
      state.protocolTypeList = action.payload;
    },
    setCertNameList(state, action) {
      state.certNameList = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default policyDetailStatus.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setDeleteList,
  setSearchOpenFlag,
  setProtocolTypeList,
  setCertNameList,
  resetState,
} = policyDetailStatus.actions;
