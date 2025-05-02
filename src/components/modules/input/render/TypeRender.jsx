import { Box } from '@mui/material';

import TextType from '@components/modules/input/type/TextType';
import TextAreaType from '@components/modules/input/type/TextAreaType';
import SelectType from '@components/modules/input/type/SelectType';
import RadioType from '@components/modules/input/type/RadioType';
import CheckboxType from '@components/modules/input/type/CheckboxType';
import DateType from '@components/modules/input/type/DateType';
import TimeType from '@components/modules/input/type/TimeType';
import DateTimeType from '@components/modules/input/type/DateTimeType';
import DayType from '@components/modules/input/type/DayType';

// type 별 input 렌더링 함수.
const TypeRender = ({
  type = 'empty',
  name = '',
  rest,
  item = null,
  disabledefault = false,
  helperText,
  helperTextProps,
  dateProps,
  htmlType,
  size,
  defaultDisabled,
  label,
  itemList,
  theme,
  formBackgroundFlag = false,
  typingCheck = false,
  onlyNumber = false,
  onlyText = false,
  maxValue = null,
  minValue = null,
  maxLength = null,
  list = null,
  dateTimeOptions,
  maskRef,
}) => {
  if (type === 'text') {
    return TextType({
      // type,
      name,
      rest,
      // item,
      // disabledefault,
      helperText,
      helperTextProps,
      // dateProps,
      htmlType,
      size,
      defaultDisabled,
      // label,
      // itemList,
      theme,
      formBackgroundFlag,
      typingCheck,
      onlyNumber,
      onlyText,
      maxValue,
      minValue,
      maxLength,
      // list,
      // dateTimeOptions,
      maskRef,
    });
  }
  if (type === 'textArea') {
    return TextAreaType({
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
    });
  }
  if (type === 'select') {
    return SelectType({
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
    });
  }
  if (type === 'radio') {
    return RadioType({
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
    });
  }
  if (type === 'checkbox') {
    return CheckboxType({
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
    });
  }
  if (type === 'date1' || type === 'date2') {
    return DateType({
      type,
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
      label,
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
    });
  }
  if (type === 'time2' || type === 'time1') {
    return TimeType({
      type,
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
      label,
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
    });
  }
  if (type === 'dateTime') {
    return DateTimeType({
      type,
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
      // formBackgroundFlag,
      // typingCheck,
      // onlyNumber,
      // onlyText,
      // maxValue,
      // minValue,
      // maxLength,
      // list,
      dateTimeOptions,
      // maskRef,
    });
  }
  if (type === 'day1') {
    return DayType({
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
    });
  }

  return (
    <Box
      key={item?.id}
      width="100%"
      sx={{ ...rest.emptysx }}
      className="CMM-li-inputArea-typeRender-box"
    />
  );
};

export default TypeRender;
