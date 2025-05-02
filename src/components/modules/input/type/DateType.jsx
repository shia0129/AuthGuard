// import { TextField } from '@mui/material';
import dynamic from 'next/dynamic';
const StyledTextField = dynamic(() => import('@components/modules/input/styled/StyledTextField'), {
  ssr: false,
});
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const StyledDatePicker = dynamic(
  () => import('@components/modules/input/styled/StyledDatePicker'),
  {
    ssr: false,
  },
);

import ko from 'moment/locale/ko';
import moment from 'moment';
// form group 감싸는 함수.
const DateType = ({
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
}) => {
  if (type === 'date1')
    return (
      <StyledDatePicker
        {...rest}
        className="CMM-li-inputArea-datePicker"
        onChange={(date) => {
          rest?.onChange && rest?.onChange(null, { date, name, type });
        }}
        views={rest?.views ? rest.views : ['year', 'month', 'day']}
        // views={['year', 'month', 'day']}
        format={rest?.inputFormat || 'YYYY-MM-DD'}
        // format="YYYY-MM-DD"
        // inputFormat="yyyy-MM-DD"
        locale={ko}
        minDate={moment('2000-01-01', ['MM-DD-YYYY', 'YYYY-MM-DD'])}
        maxDate={moment('2099-12-31', ['MM-DD-YYYY', 'YYYY-MM-DD'])}
        // minDate={moment('2000-01-01').format('yyyy-mm-dd')}
        // maxDate={moment('2099-12-31').format('yyyy-mm-dd')}
        value={moment(rest?.value)}
        disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
        slotProps={{
          textField: {
            className: 'CMM-li-inputArea-datePicker-textField',
            sx: { background: theme.palette.grey[0], ...rest?.sx },
            error: false,
            size: size,
            // value: moment(rest?.value),
            helperText: helperText,
            FormHelperTextProps: helperTextProps,
          },
        }}
        // slotsPros={{
        //   textField: (params) => {
        //     if (rest.value === '0000-00-00') params.inputProps.value = '0000-00-00';
        //     else if (rest.value === '9999-99-99') params.inputProps.value = '9999-99-99';
        //     return (
        //       <TextField
        //         {...params}
        //         sx={{ background: theme.palette.grey[0], ...rest?.sx }}
        //         error={false}
        //         name={name}
        //         size={size}
        //         value={params.value}
        //         helperText={helperText}
        //         FormHelperTextProps={helperTextProps}
        //       />
        //     );
        //   },
        // }}
      />
    );
  // if (type === 'date1')
  //   return (
  //     <DatePicker
  //       {...rest}
  //       onChange={(date) => {
  //         rest?.onChange && rest?.onChange(null, { date, name, type });
  //       }}
  //       views={['year', 'month', 'day']}
  //       inputFormat="yyyy-MM-DD"
  //       minDate={moment('2000-01-01')}
  //       maxDate={moment('2099-12-31')}
  //       disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
  //       renderInput={(params) => {
  //         if (rest.value === '0000-00-00') params.inputProps.value = '0000-00-00';
  //         else if (rest.value === '9999-99-99') params.inputProps.value = '9999-99-99';
  //         return (
  //           <TextField
  //             {...dateProps}
  //             {...params}
  //             sx={{ background: theme.palette.grey[0], ...rest?.sx }}
  //             error={false}
  //             name={name}
  //             size={size}
  //             helperText={helperText}
  //             FormHelperTextProps={helperTextProps}
  //           />
  //         );
  //       }}
  //     />
  //   );

  if (type === 'date2')
    return (
      <StyledTextField
        type="date"
        label={label}
        name={name}
        size={size}
        inputProps={{
          min: '2000-01-01',
          max: '2999-12-31',
        }}
        InputLabelProps={{ shrink: true }}
        {...rest}
      />
    );
};

export default DateType;
