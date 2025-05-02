// ==============================|| DEFAULT THEME - TYPOGRAPHY  ||============================== //

const Typography = (fontFamily) => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontWeight: 600,
    fontSize: '2.375rem',
    lineHeight: 1.21,
  },
  h2: {
    fontWeight: 900, //20230412수정
    fontSize: '20px', //20230410수정-20px
    lineHeight: 1.27,
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.33,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.57,
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.66,
  },
  body1: {
    fontSize: '0.875rem',
    lineHeight: 1.57,
  },
  body2: {
    fontSize: '0.75rem',
    lineHeight: 1.66,
  },
  title1: {
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: 1.57,
  },
  title2: {
    fontSize: '16px',
    fontWeight: 800,
    lineHeight: 1.57,
  },
  subtitle1: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.57,
  },
  subtitle2: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.66,
  },
  overline: {
    lineHeight: 1.66,
  },
  button: {
    textTransform: 'capitalize',
  },
});

export default Typography;
