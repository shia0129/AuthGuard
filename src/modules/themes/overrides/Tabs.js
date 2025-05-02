// ==============================|| OVERRIDES - TABS ||============================== //

export default function Tabs() {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 40,
          maxHeight: 40,
        },
        vertical: {
          overflow: 'visible',
        },
      },
    },
  };
}
