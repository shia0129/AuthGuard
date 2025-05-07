// ==============================|| PRESET THEME - DEFAULT ||============================== //

const Default = (colors, mode) => {
  const { grey } = colors;
  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16],
  };
  const contrastText = '#fff';

  let primaryColors = [
    'rgba(184, 196, 255, 0.17)', // 좌측메뉴 아이콘 배경색
    '#D6E4FF', // 좌측메뉴 아이콘 배경색
    '#ADC8FF',
    '#84A9FF',
    '#6690FF',
    '#008ABB', //좌측메뉴 아이콘선 / 화살표 아래색 / 버튼색
    '#015D8E', //hover
    '#1939B7',
    '#102693',
    '#102693',
  ];
  // let errorColors = ['#FFE7D3', '#FF805D', '#00bbe8', '#DB271D', '#930C1A']; //sub3 button
  // let warningColors = ['#ced7e2', '#4d5b80', '#33c8cd', '#DB970E', '#935B06']; //sub2 button
  // let infoColors = ['#fafafa', '#f0f0f0', '#B5B5B5','#262626', '#141414']; //sub1 button
  // let successColors = [
  //   'rgba(184, 196, 255, 0.17)',
  //   'rgba(184, 196, 255, 0.17)',
  //   '#008ABB',
  //   '#015D8E',
  //   '#00bbe8',
  // let successColors = [
  //   'rgba(184, 196, 255, 0.17)',
  //   'rgba(184, 196, 255, 0.17)',
  //   '#00bbe8',
  //   '#008ABB',
  //   '#015D8E',
  // ];
  let errorColors = ['#FFE7D3', '#FF805D', '#FF4528', '#DB271D', '#930C1A'];
  let warningColors = ['#FFF6D0', '#FFCF4E', '#FFB814', '#DB970E', '#935B06'];
  let infoColors = ['#DCF0FF', '#7EB9FF', '#549BFF', '#3D78DB', '#1A3D93'];
  // let infoColors = ['#DCF0FF', '#7EB9FF', '#61b2ac', '#3D78DB', '#1A3D93'];

  // let successColors = ['#EAFCD4', '#8AE65B', '#58D62A', '#3DB81E', '#137C0D'];
  let successColors = ['#EAFCD4', '#8AE65B', '#61b2ac', '#3c8b84', '#137C0D'];
  if (mode === 'dark') {
    primaryColors = [
      '#1c2134',
      '#1f294d',
      '#243462',
      '#273e83',
      '#2c4db0',
      '#305bdd',
      '#567fe9',
      '#80a4f4',
      '#a9c5f8',
      '#d2e2fb',
    ];
    errorColors = ['#341d1b', '#b03725', '#dd3f27', '#e9664d', '#fbd6c9'];
    warningColors = ['#342a1a', '#83631a', '#dda116', '#e9ba3a', '#fbefb5'];
    infoColors = ['#202734', '#416fb0', '#4c88dd', '#74a8e9', '#ecf4fb'];
    successColors = ['#1f2e1c', '#449626', '#4fba28', '#74cf4d', '#e3fbd2'];
  }

  return {
    primary: {
      lighter: primaryColors[0],
      100: primaryColors[1],
      200: primaryColors[2],
      light: primaryColors[3],
      400: primaryColors[4],
      main: primaryColors[5],
      dark: primaryColors[6],
      700: primaryColors[7],
      darker: primaryColors[8],
      900: primaryColors[9],
      contrastText,
    },
    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500],
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0],
    },
    error: {
      lighter: errorColors[0],
      light: errorColors[1],
      main: errorColors[2],
      dark: errorColors[3],
      darker: errorColors[4],
      contrastText,
    },
    warning: {
      lighter: warningColors[0],
      light: warningColors[1],
      main: warningColors[2],
      dark: warningColors[3],
      darker: warningColors[4],
      contrastText: greyColors[100],
    },
    info: {
      lighter: infoColors[0],
      light: infoColors[1],
      main: infoColors[2],
      dark: infoColors[3],
      darker: infoColors[4],
      contrastText,
    },
    success: {
      lighter: successColors[0],
      light: successColors[1],
      main: successColors[2],
      dark: successColors[3],
      darker: successColors[4],
      contrastText,
    },
    grey: greyColors,
  };
};

export default Default;
