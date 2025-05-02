// import { TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import moment from 'moment';

const StyledTextField = dynamic(() => import('@components/modules/input/styled/StyledTextField'), {
  ssr: false,
});
// import { TimePicker } from '@mui/x-date-pickers';
const StyledTimePicker = dynamic(
  () => import('@components/modules/input/styled/StyledTimePicker'),
  {
    ssr: false,
  },
);

const TimeTextField = ({ theme, rest, name, size, helperText, helperTextProps, ...params }) => {
  return (
    <StyledTextField
      className="CMM-li-inputArea-timePicker-textField"
      {...params}
      sx={{ backgroundColor: theme.palette.grey[0], ...rest?.sx }}
      error={false}
      name={name}
      size={size}
      value={params.value}
      helperText={helperText}
      FormHelperTextProps={helperTextProps}
    />
  );
};
// form group 감싸는 함수.
const TimeType = ({
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
  if (type === 'time2') {
    return (
      <StyledTextField
        type="time"
        size={size}
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        {...rest}
      />
    );
  }
  if (type === 'time1') {
    return (
      <StyledTimePicker
        className="CMM-li-inputArea-timePicker"
        value={moment(rest?.value)}
        size={size}
        views={rest?.views ? rest.views : ['hours', 'minutes']}
        format={rest?.inputFormat || 'hh:mm a'}
        disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
        onChange={(newValue) => {
          rest?.onChange && rest?.onChange(null, { date: newValue, name, type });
        }}
        slots={{
          textField: TimeTextField,
        }}
        slotProps={{
          textField: {
            theme,
            rest,
            name,
            size,
            helperText,
            helperTextProps,
          },
          desktopPaper: {
            sx: {
              // backgroundColor: 'red',
              '.MuiMultiSectionDigitalClock-root > ul:nth-of-type(3)': {
                // '.MuiMultiSectionDigitalClock-root > ul:nth-child(3):after': {
                overflow: 'visible',
              },
              ...rest?.sx,
            },
          },
        }}
      />
    );
  }
  // if (type === 'time1')
  //   return (
  //     <DesktopTimePicker
  //       disableMaskedInput
  //       value={rest?.value}
  //       size={size}
  //       InputLabelProps={{ shrink: true }}
  //       sx={{ background: theme.palette.grey[0], ...rest?.sx }}
  //       onChange={(newValue) => {
  //         rest?.onChange && rest?.onChange(newValue);
  //       }}
  //       renderInput={(params) => {
  //         return (
  //           <TextField
  //             {...params}
  //             sx={{ background: theme.palette.grey[0], ...rest?.sx }}
  //             error={false}
  //             size={size}
  //           />
  //         );
  //       }}
  //     />
  //   );
};

export default TimeType;
