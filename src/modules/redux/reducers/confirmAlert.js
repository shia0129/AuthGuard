import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '저장하시겠습니까?',
  close: true,
  confirmButtonText: '저장',
  target: 'NONE',
  methods: null,
};

const confirmAlert = createSlice({
  name: 'confirmAlert',
  initialState,
  reducers: {
    openConfirmAlert(state, action) {
      return {
        ...action.payload,
        message: action.payload.message ? action.payload.message : '저장하시겠습니까?',
        confirmButtonText: action.payload.confirmButtonText
          ? action.payload.confirmButtonText
          : '저장',
        type: 'CONFIRM',
        open: true,
      };
    },

    closeConfirmAlert(state) {
      state.open = false;
    },

    handleConfirmClick(state) {
      state.open = false;
    },
  },
});

export default confirmAlert.reducer;

export const { openConfirmAlert, closeConfirmAlert, handleConfirmClick } = confirmAlert.actions;
