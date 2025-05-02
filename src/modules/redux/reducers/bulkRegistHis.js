import HsLib from '@modules/common/HsLib';
import { createSlice } from '@reduxjs/toolkit';

let today = HsLib.getTodayDate();
let weekAgo = HsLib.getBeforeDate('1M', today);

const initialState = {
  parameters: {
    current: {
      statusDivision: '',
      requestStartDate: HsLib.removeDateFormat(weekAgo),
      requestEndDate: HsLib.removeDateFormat(today),
      controlFlag: '',
      workerName: '',
      size: 10,
      page: 0,
    },
  },
  pageDataList: [
    {
      requestTime: '',
      endTime: '',
      workType: '',
      progressClassification: '',
      failFileDownload: '',
      totalNumber: '',
      successesNumber: '',
      failNumber: '',
      workerName: '',
      message: '',
    },
  ],
  listInfo: {},
  columns: [],
  totalElements: 0,
};

const bulkRegistHis = createSlice({
  name: 'bulkRegistHis',
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

export default bulkRegistHis.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns } = bulkRegistHis.actions;
