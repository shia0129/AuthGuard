import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      name: '',
      description: '',
      enabled: '',
      size: 10,
      page: 0,
    },
  },
  deleteList: [],
  pageDataList: [],
  bridgeList: [],
  linkedList: [],
  listInfo: {},
  columns: [],
  routes: [],
  totalElements: 0,
};

const segmentStatus = createSlice({
  name: 'segmentStatus',
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
    setDeleteList(state, action) {
      state.deleteList = action.payload;
    },
    setSearchOpenFlag(state, action) {
      state.searchOpenFlag = action.payload;
    },
    setBridgeList(state, action) {
      state.bridgeList = action.payload;
    },
    setLinkedList(state, action) {
      state.linkedList = action.payload;
    },
    setRoutesList(state, action) {
      state.routesList = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default segmentStatus.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setDeleteList,
  setBridgeList,
  setLinkedList,
  setRoutesList,
  setSearchOpenFlag,
  resetState,
} = segmentStatus.actions;
