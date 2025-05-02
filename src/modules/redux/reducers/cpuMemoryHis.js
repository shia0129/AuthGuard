import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

let getToday = HsLib.getTodayDate();
let today = HsLib.removeDateFormat(getToday);

const initialState = {
  parameters: {
    current: {
      sysgrpId: '',
      systemId: '',
      startDate: today,
      endDate: today,
      searchGubn: '',
      size: 10,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  comboData: [],
  totalElements: 0,
};

const cpuMemoryHis = createSlice({
  name: 'cpuMemoryHis',
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

export default cpuMemoryHis.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns } = cpuMemoryHis.actions;
