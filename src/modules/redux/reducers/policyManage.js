import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parameters: {
    current: {
      boundType: '',
      policyName: '',
      serviceMethod: '',
      destinationIp: '',
      destinationPort: '',
      sourceIp: '',
      enabledType: '',
      systemGroupId: '',
      size: 10,
      page: 0,
    },
  },
  modalData: {
    boundType: '',
    policyName: '',
    remark: '',
    enabledType: '',
    serviceMethod: '',
    systemGroupId: '',
    virtualSourceIp: '',
  },
  policyManageList: [],
  columns: [],
  deleteList: [],
  addCheckList: [],
  totalElements: 0,
  searchOpenFlag: false,
};

const policyManage = createSlice({
  name: 'policyManage',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },
    setModalData(state, action) {
      state.modalData = { ...state.modalData, ...action.payload };
    },
    setPolicyManageList(state, action) {
      state.policyManageList = action.payload.policyManageList;
      state.totalElements = action.payload.totalElements;
    },
    setColumns(state, action) {
      state.columns = action.payload.columns;
    },
    setDeleteList(state, action) {
      state.deleteList = action.payload.deleteList;
    },
    setAddCheckList(state, action) {
      state.addCheckList = [...state.addCheckList, action.payload.addCheckList];
    },
    setRemoveCheckList(state, action) {
      const updatedCheckList = state.addCheckList.filter(
        (item) => item !== action.payload.addCheckList,
      );
      state.addCheckList = updatedCheckList;
    },
    setResetCheckList(state, action) {
      state.addCheckList = [];
    },
    setSearchOpenFlag(state, action) {
      state.searchOpenFlag = action.payload;
    },
  },
});

export default policyManage.reducer;

export const {
  setParameters,
  setModalData,
  setPolicyManageList,
  setColumns,
  setDeleteList,
  setAddCheckList,
  setRemoveCheckList,
  setResetCheckList,
  setSearchOpenFlag,
} = policyManage.actions;
