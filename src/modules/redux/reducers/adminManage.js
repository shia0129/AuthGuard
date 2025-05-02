import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      userId: '',
      userName: '',
      userPermissionId: '',
      deleteYn: '',
      size: 10,
      page: 0,
    },
  },
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  adminPermissionParamList: [],
};

const adminManage = createSlice({
  name: 'adminManage',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },

    setAdminPermissionParamList(state, action) {
      state.adminPermissionParamList = action.payload;
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

export default adminManage.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setAdminPermissionParamList,
  setColumns,
} = adminManage.actions;
