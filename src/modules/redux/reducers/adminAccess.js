import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

let getToday = HsLib.getTodayDate();
let today = HsLib.removeDateFormat(getToday);

const initialState = {
  parameters: {
    current: {
      accessResult: '',
      accessStatus: '',
      failCode: '',
      startDate: today,
      endDate: today,
      adminId: '',
      adminName: '',
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

const adminAccess = createSlice({
  name: 'adminAccess',
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

export default adminAccess.reducer;

export const { setParameters, setPageDataList, setColumns, setListInfo, setSearchOpenFlag } =
  adminAccess.actions;
