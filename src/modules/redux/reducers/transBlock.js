import { createSlice } from '@reduxjs/toolkit';
import HsLib from '@modules/common/HsLib';

const initialState = {
  parameters: {
    current: {
      sysgrpId: '',
      systemId: '',
      svcStartTime: HsLib.getTodayDateTime(),
      svcEndTime: HsLib.getTodayDateTime(),
      boundType: '',
      srcIp: '',
      srcPort: '',
      dstIp: '',
      dstPort: '',
      ipProto: '',
      size: 25,
      page: 0,
    },
  },
  transmissionBlockList: [],
  columns: [],
  comboData: [],
};

const transBlock = createSlice({
  name: 'transBlock',
  initialState,
  reducers: {
    setParameters(state, action) {
      state.parameters.current = { ...state.parameters.current, ...action.payload };
    },
    setTransmissionBlockList(state, action) {
      state.transmissionBlockList = action.payload.transmissionBlockList;
    },
    setColumns(state, action) {
      state.columns = action.payload.columns;
    },
    setComboData(state, action) {
      state.comboData = { ...state.comboData, ...action.payload };
    },
  },
});

export default transBlock.reducer;

export const { setParameters, setTransmissionBlockList, setColumns, setComboData } =
  transBlock.actions;
