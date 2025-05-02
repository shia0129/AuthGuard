import dynamic from 'next/dynamic';
const ToggleButtonGroup = dynamic(() => import('@mui/material/ToggleButtonGroup'), { ssr: false });
const StyledMuiToggleButton = dynamic(
  () => import('@components/modules/input/styled/StyledMuiToggleButton'),
  { ssr: false },
);

// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import StyledMuiToggleButton from '@components/modules/input/StyledMuiToggleButton';

// form group 감싸는 함수.
const DayType = ({
  // type,
  // name,
  rest,
  // item,
  // disabledefault,
  // helperText,
  // helperTextProps,
  // dateProps,
  // htmlType,
  // size,
  // defaultDisabled,
  // label,
  // itemList,
  theme,
  // formBackgroundFlag,
  // typingCheck,
  // onlyNumber,
  // onlyText,
  // maxValue,
  // minValue,
  // maxLength,
  // list,
  // dateTimeOptions,
  // maskRef,
}) => {
  return (
    <ToggleButtonGroup
      className="CMM-li-inputArea-toggleButtonGroup"
      size="small"
      value={rest?.value}
      aria-label="text alignment"
      sx={{ maxHeight: '32px' }}
    >
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        sx={{ maxHeight: '32px' }}
        value="0"
        textcolor={theme.palette.text.primary}
      >
        전체
      </StyledMuiToggleButton>
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        value="1"
        textcolor={theme.palette.text.primary}
      >
        월
      </StyledMuiToggleButton>
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        value="2"
        textcolor={theme.palette.text.primary}
      >
        화
      </StyledMuiToggleButton>
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        value="3"
        textcolor={theme.palette.text.primary}
      >
        수
      </StyledMuiToggleButton>
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        value="4"
        textcolor={theme.palette.text.primary}
      >
        목
      </StyledMuiToggleButton>
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        value="5"
        textcolor={theme.palette.text.primary}
      >
        금
      </StyledMuiToggleButton>
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        value="6"
        textcolor={theme.palette.text.primary}
      >
        토
      </StyledMuiToggleButton>
      <StyledMuiToggleButton
        className="CMM-li-inputArea-muiToggleButton"
        value="7"
        textcolor={theme.palette.text.primary}
      >
        일
      </StyledMuiToggleButton>
    </ToggleButtonGroup>
  );
};

export default DayType;
