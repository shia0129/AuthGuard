import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {
    userName: null,
    userId: null,
    accessToken: null,
  },
  treeList: [],
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
    setTreeList: (state, action) => {
      state.treeList = action.payload;
    },
  },
});

export const { setUserInfo, setTreeList } = commonSlice.actions;
export default commonSlice.reducer;
