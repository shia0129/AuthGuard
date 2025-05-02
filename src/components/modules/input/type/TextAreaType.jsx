import dynamic from 'next/dynamic';
const StyledTextArea = dynamic(() => import('@components/modules/input/styled/StyledTextArea'), {
  ssr: false,
});
// form group 감싸는 함수.
const TextAreaType = ({
  // type,
  name,
  rest,
  // item,
  // disabledefault,
  helperText,
  helperTextProps,
  // dateProps,
  // htmlType,
  size,
  defaultDisabled,
  // label,
  // itemList,
  theme,
  formBackgroundFlag,
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
    <StyledTextArea
      className="inputBox textArea CMM-li-inputArea-textArea"
      {...rest}
      inputProps={{
        ...rest?.inputProps,
        autoComplete: 'off',
      }}
      name={name}
      size={size}
      sx={
        formBackgroundFlag
          ? {
              padding: '6px',
              marginLeft: '0 !important',
              justifyContent: 'center',
              ...rest?.sx,
            }
          : { ...rest?.sx, background: theme.palette.grey[0] }
      }
      FormHelperTextProps={helperTextProps}
      disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
      helperText={helperText}
    />
  );
};

export default TextAreaType;
