import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      container: '',
      interface: '',
      filter: '',
      duration: 10,
      count: '20',
    },
  },
  // deleteList: [],
  // pageDataList: [],
  // listInfo: {},
  // columns: [],
  totalElements: 0,
  segmentNameList: [],
  LinkedNameList: [],
};

const packetcaptureStatus = createSlice({
  name: 'packetcaptureStatus',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },
    // setPageDataList(state, action) {
    //   state.pageDataList = action.payload.pageDataList;
    //   state.totalElements = action.payload.totalElements;
    // },
    // setListInfo(state, action) {
    //   state.listInfo = action.payload;
    // },
    // setColumns(state, action) {
    //   state.columns = action.payload;
    // },
    // setDeleteList(state, action) {
    //   state.deleteList = action.payload;
    // },
    // setSearchOpenFlag(state, action) {
    //   state.searchOpenFlag = action.payload;
    // },
    setLinkedNameList(state, action) {
      state.LinkedNameList = action.payload;
    },
    setSegmentNameList(state, action) {
      state.segmentNameList = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default packetcaptureStatus.reducer;

export const {
  setParameters,
  // setPageDataList,
  // setListInfo,
  // setColumns,
  // setDeleteList,
  // setSearchOpenFlag,
  setLinkedNameList,
  setSegmentNameList,
  resetState,
} = packetcaptureStatus.actions;
