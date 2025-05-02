import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      name: '',
      segmentName: '',
      detailName: '',
      size: 10,
      page: 0,
    },
  },
  deleteList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  segmentNameList: [],
  detailList: [],
};

const policyGroupStatus = createSlice({
  name: 'vaPolicyGroupStatus',
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
    setSegmentNameList(state, action) {
      state.segmentNameList = action.payload;
    },
    setDetailList(state, action) {
      state.detailList = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default policyGroupStatus.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setDeleteList,
  setSearchOpenFlag,
  setSegmentNameList,
  setDetailList,
  resetState,
} = policyGroupStatus.actions;
