import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      name: '',
      target: '',
      netmask: '',
      gateway: '',
      dev: '',
      type: '',
      isDefault: '',
      size: 10,
      page: 0,
    },
  },
  deleteList: [],
  pageDataList: [],
  listInfo: {},
  columns: [],
  totalElements: 0,
  typeList: [
    { label: 'Net', value: 'net' },
    { label: 'Host', value: 'host' },
    { label: 'Default', value: 'default' },
  ],
  interfaceNameList: [],
  // interfaceMemberList: [],
  // interfaceTypeList: [],
};

const route = createSlice({
  name: 'route',
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
    setInterfaceNameList(state, action) {
      state.interfaceNameList = action.payload;
    },
    // setInterfaceMemberList(state, action) {
    //   state.interfaceMemberList = action.payload;
    // },
    // setInterfaceTypeList(state, action) {
    //   state.interfaceTypeList = action.payload;
    // },
    resetState() {
      return initialState;
    },
  },
});

export default route.reducer;

export const {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setDeleteList,
  setSearchOpenFlag,
  setInterfaceNameList,
  setInterfaceMemberList,
  setInterfaceTypeList,
  resetState,
} = route.actions;
