import { Checkbox } from '@mui/material';
import dynamic from 'next/dynamic';
// const StyledCheckbox = dynamic(() => import('@components/modules/input/StyledCheckbox'), {
//   ssr: false,
// });
const StyledFormControlLabel = dynamic(
  () => import('@components/modules/input/styled/StyledFormControlLabel'),
  {
    ssr: false,
  },
);
// form group 감싸는 함수.
const CheckboxType = ({
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
  return (
    // <FormControlLabel
    <StyledFormControlLabel
      className="CMM-li-inputArea-formControlLabel"
      sx={{ ...item?.sx }}
      key={item.value}
      // list={itemList}
      disabled={
        !defaultDisabled ? (item?.disabled ? item?.disabled : !item.value && true) : defaultDisabled
      }
      value={item.value}
      control={
        <Checkbox
          // className="CMM-li-inputArea-formControlLabel-checkbox"
          // <StyledCheckbox
          // sx={{ visibility: !item.value && 'hidden' }}
          sx={{
            ...(formBackgroundFlag ? { padding: '7px' } : { visibility: !item.value && 'hidden' }),
          }}
          name={name}
          value={item.value}
          checked={item.checked}
          onChange={rest?.onChange}
        />
      }
      label={item.label}
    />
  );
};

export default CheckboxType;
