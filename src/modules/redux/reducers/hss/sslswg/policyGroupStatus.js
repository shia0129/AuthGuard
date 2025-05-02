import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      name: '',
      segmentName: '',
      timeId: '',
      isBlackList: '',
      action: '',
      description: '',
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
  timeNameList: [],
};

const policyGroupStatus = createSlice({
  name: 'swgPolicyGroupStatus',
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
    setTimeNameList(state, action) {
      state.timeNameList = action.payload;
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
  setTimeNameList,
  resetState,
} = policyGroupStatus.actions;
