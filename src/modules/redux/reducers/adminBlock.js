import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

let today = HsLib.getTodayDate();
let monthAgo = HsLib.getBeforeDate('3M', today);

const initialState = {
  parameters: {
    current: {
      blockUserId: '',
      blockUserName: '',
      blockStartTime: HsLib.removeDateFormat(monthAgo),
      blockEndTime: HsLib.removeDateFormat(today),
      blockType: '',
      releaseType: '',
      size: 10,
      page: 0,
    },
  },
  modalParameters: {
    current: {
      size: 10,
      page: 0,
    },
  },
  passwordFailList: [],
  adminBlockList: [],
  comboData: [],
};

const adminBlock = createSlice({
  name: 'adminBlock',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },
    setModalParameters(state, action) {
      state.modalParameters.current = { ...state.modalParameters.current, ...action.payload };
    },
    setAdminBlockList(state, action) {
      state.adminBlockList = action.payload;
    },
    setPasswordFailList(state, action) {
      state.passwordFailList = action.payload;
    },
    setComboData(state, action) {
      state.comboData = { ...state.comboData, ...action.payload };
    },
  },
});

export default adminBlock.reducer;

export const {
  setParameters,
  setModalParameters,
  setAdminBlockList,
  setPasswordFailList,
  setComboData,
} = adminBlock.actions;
