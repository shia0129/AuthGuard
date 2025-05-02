import { createSlice } from '@reduxjs/toolkit';

const defaultTabState = {
  parameters: {
    current: {
      name: '',
      ip: '',
      value: '',
      url: '',
      inUsed: '',
      size: 10,
      page: 0,
    },
  },
  checkList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
};

const initialState = {
  wait: { ...defaultTabState },
  done: { ...defaultTabState },
  reject: { ...defaultTabState },
};

const accessRequestStatus = createSlice({
  name: 'accessRequestStatus',
  initialState,
  reducers: {
    setParameters(state, action) {
      const { tab, data } = action.payload;
      state[tab].parameters.current = {
        ...state[tab].parameters.current,
        ...data,
      };
    },
    setPageDataList(state, action) {
      const { tab, pageDataList, totalElements } = action.payload;
      state[tab].pageDataList = pageDataList;
      state[tab].totalElements = totalElements;
    },
    setListInfo(state, action) {
      const { tab, listInfo } = action.payload;
      state[tab].listInfo = listInfo;
    },
    setColumns(state, action) {
      const { tab, columns } = action.payload;
      state[tab].columns = columns;
    },
    setCheckList(state, action) {
      const { tab, checkList } = action.payload;
      state[tab].checkList = checkList;
    },
    resetState() {
      return initialState;
    },
  },
});

export default accessRequestStatus.reducer;

export const { setParameters, setPageDataList, setListInfo, setColumns, setCheckList, resetState } =
  accessRequestStatus.actions;
