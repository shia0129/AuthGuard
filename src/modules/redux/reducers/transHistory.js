import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

const initialState = {
  parameters: {
    current: {
      sysgrpId: '',
      systemId: '',
      workStart: HsLib.getTodayDateTime('1M'),
      workEnd: HsLib.getTodayDateTime(),
      protocol: '',
      srcIp: '',
      srcPort: '',
      destIp: '',
      destPort: '',
      option: '',
      size: 25,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  gridPdfInfo: [],
  searchOpenFlag: false,
};

const transHistory = createSlice({
  name: 'transHistory',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },
    setTransmission(state, action) {
      state.pageDataList = action.payload.pageDataList;
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

export default transHistory.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns, setSearchOpenFlag } =
  transHistory.actions;
