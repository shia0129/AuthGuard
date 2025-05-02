import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      segmentName: '',
      searchDate: '',
      searchString: '',
      size: 10,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  segmentNameList: [],
  log_filter: '',
};

const log = createSlice({
  name: 'log',
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
    setSegmentNameList(state, action) {
      state.segmentNameList = action.payload;
    },
    setLogFilter(state, action) {
      state.log_filter = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default log.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setSegmentNameList,
  setLogFilter,
  resetState,
} = log.actions;
