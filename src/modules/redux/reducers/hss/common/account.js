import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      name: '',
      groupName: '', // groupId
      loginType: '',
      descr: '',
      size: 10,
      page: 0,
    },
  },
  deleteList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  loginTypeList: [
    { value: 'ID', label: 'ID' },
    { value: 'ID,PWD', label: 'ID,PWD' },
    { value: 'ID,PWD,PINCODE', label: 'ID,PWD,PINCODE' },
  ],
  groupNameList: [],
};

const account = createSlice({
  name: 'account',
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
    setGroupNameList(state, action) {
      state.groupNameList = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export default account.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setDeleteList,
  setSearchOpenFlag,
  setGroupNameList,
  resetState,
} = account.actions;
