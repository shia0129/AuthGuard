import HsLib from '@modules/common/HsLib';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      destIp: '',
      destPort: '',
      svcDesc: '',
      systemId: '',
      requestStartDate: HsLib.getTodayDateTime('1M'),
      requestEndDate: HsLib.getTodayDateTime(),
      svcMod: '',
      destType: '',
      controlFlag: '',
      systemGroupId: '',
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

const destinationPolicyHis = createSlice({
  name: 'destinationPolicyHis',
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

export default destinationPolicyHis.reducer;

export const { setParameters, setPageDataList, setColumns, setListInfo, setSearchOpenFlag } =
  destinationPolicyHis.actions;
