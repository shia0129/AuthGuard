// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardContent() {
  return {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 15,
          '&:last-child': {
            paddingBottom: 15,
          },
        },
      },
    },
  };
}
