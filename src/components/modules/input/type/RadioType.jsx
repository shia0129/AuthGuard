import { createElement } from 'react';
// import { FormControlLabel, Radio } from '@mui/material';
import dynamic from 'next/dynamic';
const StyledRadio = dynamic(() => import('@components/modules/input/styled/StyledRadio'), {
  ssr: false,
});
const StyledFormControlLabel = dynamic(
  () => import('@components/modules/input/styled/StyledFormControlLabel'),
  {
    ssr: false,
  },
);
// form group 감싸는 함수.
const RadioType = ({
  // type,
  name,
  rest,
  item,
  // disabledefault,
  // helperText,
  // helperTextProps,
  // dateProps,
  // htmlType,
  // size,
  defaultDisabled,
  // label,
  // itemList,
  // theme,
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
  if (rest?.children) {
    return createElement(rest.children.type, {
      ...item,
    });
  }
  return (
    <StyledFormControlLabel
      className="CMM-li-inputArea-formControlLabel"
      sx={{ ...item?.sx }}
      key={item.value}
      // list={itemList}
      disabled={!defaultDisabled ? item?.disabled : defaultDisabled}
      value={item.value}
      control={
        <StyledRadio
          className="CMM-li-inputArea-formControlLabel-radio"
          name={name}
          sx={{
            ...(formBackgroundFlag ? { padding: '7px' } : {}),
          }}
        />
      }
      label={item.label}
    />
  );
};

export default RadioType;
