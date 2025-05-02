import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

let getToday = HsLib.getTodayDate();
let today = HsLib.removeDateFormat(getToday);
let getWeekLater = HsLib.getAfterDate('7D', getToday);
let weekLater = HsLib.removeDateFormat(getWeekLater);

const initialState = {
  parameters: {
    current: {
      boardStartDate: today,
      boardEndDate: weekLater,
      userName: '',
      boardSearchWord: '',
      boardUseYn: '',
      size: 25,
      page: 0,
    },
  },
  noticeList: [],
  columns: [],
};

const notice = createSlice({
  name: 'noticeSearchForm',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },
    setNoticeList(state, action) {
      state.noticeList = action.payload.noticeList;
    },
    setColumns(state, action) {
      state.columns = action.payload.columns;
    },
  },
});

export default notice.reducer;

export const { setParameters, setNoticeList, setColumns } = notice.actions;
