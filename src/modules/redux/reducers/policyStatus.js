import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      systemGroup: '',
      systemId: '',
      serviceMethod: '',
      svcDesc: '',
      destType: '',
      destinationIP: '',
      destinationPortFrom: '',
      sourceIP: '',
      size: 10,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  searchOpenFlag: false,
};

const policyStatus = createSlice({
  name: 'policyStatus',
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
    setSearchOpenFlag(state, action) {
      state.searchOpenFlag = action.payload;
    },
  },
});

export default policyStatus.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns, setSearchOpenFlag } =
  policyStatus.actions;
