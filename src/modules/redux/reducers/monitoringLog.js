import HsLib from '@modules/common/HsLib';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      registerId: '',
      registerName: '',
      registerStartDate: HsLib.getTodayDateTime('1M'),
      registerEndDate: HsLib.getTodayDateTime(),
      workType: '',
      size: 10,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
};

const monitoringLog = createSlice({
  name: 'monitoringLog',
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

export default monitoringLog.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns } = monitoringLog.actions;
