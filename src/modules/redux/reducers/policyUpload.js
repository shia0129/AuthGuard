import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  verifyResponseData: {},
  uploadFileList: [],
};

const policyUpload = createSlice({
  name: 'policyUpload',
  initialState,
  reducers: {
    setVerifyResponseData(state, action) {
      state.verifyResponseData = action.payload;
    },
    setUploadFileList(state, action) {
      state.uploadFileList = action.payload || [];
    },
  },
});

export default policyUpload.reducer;

export const { setUploadFileList, setVerifyResponseData } = policyUpload.actions;
