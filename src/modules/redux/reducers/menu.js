// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  openItem: ['dashboard'],
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true,
  selectedItem: null,
  selectedTopMenu: null,
  menuItem: { items: [], topItems: [] },
  originalMenuItem: { items: [] },
  menuRoleList: [],
  popupRoleList: {},
  topMenuUseYn: 'Y',
  selectedCollapse: null,
  searchText: '',
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },
    selectedItem(state, action) {
      state.selectedItem = action.payload.selectedItem;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    setMenuItem(state, action) {
      const { menuItem, topMenuItem } = action.payload;
      if (menuItem) state.menuItem = { ...state.menuItem, items: menuItem };
      if (topMenuItem) state.menuItem = { ...state.menuItem, topItems: topMenuItem };
    },
    // setOriginalMenuItem(state, action) {
    //   state.originalMenuItem = { items: action.payload.menuItem };
    // },
    setMenuRoleList(state, action) {
      state.menuRoleList = action.payload.menuRoleList;
    },
    setPopupRoleList(state, action) {
      if (isEmpty(action.payload.popupRoleList)) {
        state.popupRoleList = action.payload.popupRoleList;
      } else {
        state.popupRoleList = produce(state.popupRoleList, (draft) => ({
          ...draft,
          ...action.payload.popupRoleList,
        }));
      }
    },
    setTopMenuUseYn(state, action) {
      state.topMenuUseYn = action.payload.topMenuUseYn;
    },
    setSelectedCollapse(state, action) {
      state.selectedCollapse = action.payload.selectedCollapse;
    },
    setSelectedTopMenu(state, action) {
      state.selectedTopMenu = action.payload.selectedTopMenu;
    },
    // setSearchText(state, action) {
    //   state.searchText = action.payload.searchText;
    // },
  },
});

export default menu.reducer;

export const {
  activeItem,
  activeComponent,
  openDrawer,
  openComponentDrawer,
  setMenuItem,
  selectedItem,
  setMenuRoleList,
  // setOriginalMenuItem,
  setPopupRoleList,
  setTopMenuUseYn,
  setSelectedCollapse,
  setSelectedTopMenu,
  // setSearchText,
} = menu.actions;
