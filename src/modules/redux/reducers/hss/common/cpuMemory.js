import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

let getToday = HsLib.getTodayDate();
let today = HsLib.removeDateFormat(getToday);

const initialState = {
  parameters: {
    current: {
      zoneName: '',
      startDate: today,
      endDate: today,
      size: 10,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  comboData: [],
  totalElements: 0,
  zoneNameList: [],
};

const cpuMemory = createSlice({
  name: 'cpuMemory',
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
    setZoneNameList(state, action) {
      state.zoneNameList = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default cpuMemory.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setZoneNameList,
  resetState,
} = cpuMemory.actions;
