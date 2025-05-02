import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

let getToday = HsLib.getTodayDate();
let today = HsLib.removeDateFormat(getToday);

const initialState = {
  parameters: {
    current: {
      systemId: '',
      groupCd: '',
      alarmDesc: '',
      startDate: today,
      endDate: today,
      size: 10,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
};

const integrityCheck = createSlice({
  name: 'integrityCheck',
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
  },
});

export default integrityCheck.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns } = integrityCheck.actions;
