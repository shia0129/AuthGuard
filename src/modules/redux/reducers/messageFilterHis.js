import HsLib from '@modules/common/HsLib';
import { createSlice } from '@reduxjs/toolkit';

let today = HsLib.getTodayDate();
let dayAgo = HsLib.getBeforeDate('7D', today);

const initialState = {
  parameters: {
    current: {
      policyName: '',
      systemId: '',
      srcIp: '',
      srcPort: '',
      destIp: '',
      destPort: '',
      startDate: HsLib.removeDateFormat(dayAgo),
      endDate: HsLib.removeDateFormat(today),
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

const messageFilterHis = createSlice({
  name: 'messageFilterHis',
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

export default messageFilterHis.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns, setSearchOpenFlag } =
  messageFilterHis.actions;
