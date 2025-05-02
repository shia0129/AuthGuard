// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  notificationList: [],
  setDataFlag: false,
  notificationCnt: 0,
};

// ==============================|| SLICE - NOTIFICATION ||============================== //

const notification = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationList(state, action) {
      state.notificationList = action.payload.notificationList;
    },
    setDataFlag(state, action) {
      state.dataFlag = action.payload.dataFlag;
    },
    setNotificationCnt(state, action) {
      state.notificationCnt = action.payload.notificationCnt;
    },
  },
});

export default notification.reducer;

export const { setNotificationList, setDataFlag, setNotificationCnt } = notification.actions;
