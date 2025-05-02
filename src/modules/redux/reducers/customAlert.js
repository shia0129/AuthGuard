import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  close: true,
  title: '',
  content: '',
  buttons: null,
  width: null,
  type: 'CUSTOM',
};

const customAlert = createSlice({
  name: 'customAlert',
  initialState,
  reducers: {
    openCustomAlert(state, action) {
      return {
        ...action.payload,
        type: 'CUSTOM',
        open: true,
      };
    },

    closeCustomAlert(state) {
      state.open = false;
    },

    handleButtonsClick(state) {
      state.open = false;
    },
  },
});

export default customAlert.reducer;

export const { openCustomAlert, closeCustomAlert, handleButtonsClick } = customAlert.actions;
