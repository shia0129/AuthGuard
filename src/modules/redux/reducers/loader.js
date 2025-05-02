import { createSlice } from '@reduxjs/toolkit';

// modal 초기 상태 값.
const initialState = {
  loading: false,
};

// ==============================|| SLICE - alert ||============================== //

const loader = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

export default loader.reducer;

export const { startLoading, stopLoading } = loader.actions;
