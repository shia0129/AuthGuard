import HsLib from '@modules/common/HsLib';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      destIp: '',
      destPort: '',
      sysgrpId: '',
      systemId: '',
      requestStartDate: HsLib.getTodayDateTime('1M'),
      requestEndDate: HsLib.getTodayDateTime(),
      srcIp: '',
      controlFlag: '',
      adminInfo: {
        name: '',
        seq: '',
      },
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

const departurePolicyHis = createSlice({
  name: 'departurePolicyHis',
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

export default departurePolicyHis.reducer;

export const { setParameters, setPageDataList, setColumns, setListInfo, setSearchOpenFlag } =
  departurePolicyHis.actions;
