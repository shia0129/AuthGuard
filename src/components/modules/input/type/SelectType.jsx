// import { Select, MenuItem } from '@mui/material';
import dynamic from 'next/dynamic';
const StyledMenuItem = dynamic(() => import('@components/modules/input/styled/StyledMenuItem'), {
  ssr: false,
});
const StyledSelect = dynamic(() => import('@components/modules/input/styled/StyledSelect'), {
  ssr: false,
});
// form group 감싸는 함수.
const SelectType = ({
  // type,
  name,
  rest,
  // item,
  disabledefault,
  // helperText,
  // helperTextProps,
  // dateProps,
  // htmlType,
  // size,
  defaultDisabled,
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
  list,
  // dateTimeOptions,
  // maskRef,
}) => {
  return (
    <StyledSelect
      className="inputBox select CMM-li-inputArea-select"
      {...rest}
      displayEmpty
      name={name}
      sx={{ ...rest?.sx, background: theme.palette.grey[0] }}
      disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 300,
          },
          sx: {
            ...rest?.sx,
            // '.MuiList-root': {
            //   backgroundColor: 'orange',
            // },
          },
        },
      }}
    >
      {!disabledefault && <StyledMenuItem value="">선택</StyledMenuItem>}
      {list?.map((data, index) => (
        <StyledMenuItem key={index} value={data.value}>
          {data.label}
        </StyledMenuItem>
      ))}
    </StyledSelect>
  );
};

export default SelectType;
