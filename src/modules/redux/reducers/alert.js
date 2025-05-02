import { createSlice } from '@reduxjs/toolkit';

// modal 초기 상태 값.
const initialState = {
  open: false,
  message: '메시지가 없습니다.',
  close: true,
  type: 'info',
};

// ==============================|| SLICE - alert ||============================== //

const alert = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    // modal open 리듀서.
    openAlert(state, action) {
      return {
        ...action.payload,
        type: action.payload.type ? action.payload.type : 'info',
        open: true,
      };
    },

    // 하위 두 리듀서는 redux-saga에서 race를 통해 실행.

    // modal close 리듀서.
    closeAlert(state) {
      state.open = false;
    },

    // modal ok 리듀서.
    clickConfirm(state) {
      state.open = false;
    },
  },
});

export default alert.reducer;

export const { closeAlert, openAlert, clickConfirm } = alert.actions;
