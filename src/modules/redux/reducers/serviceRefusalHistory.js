import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

const initialState = {
  parameters: {
    current: {
      sysgrpId: '',
      systemId: '',
      workStartTime: HsLib.getTodayDateTime('1M'),
      workEndTime: HsLib.getTodayDateTime(),
      protocol: '',
      srcIp: '',
      srcPort: '',
      destIp: '',
      destPort: '',
      size: 25,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  searchOpenFlag: false,
};

const serviceRefusalHistory = createSlice({
  name: 'serviceRefusalHistory',
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
      state.listInfo = action.payload.listInfo;
    },
    setColumns(state, action) {
      state.columns = action.payload.columns;
    },
    setSearchOpenFlag(state, action) {
      state.searchOpenFlag = action.payload;
    },
  },
});

export default serviceRefusalHistory.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns, setSearchOpenFlag } =
  serviceRefusalHistory.actions;
