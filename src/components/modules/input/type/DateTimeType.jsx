import dynamic from 'next/dynamic';
const StyledDateTimePicker = dynamic(
  () => import('@components/modules/input/styled/StyledDateTimePicker'),
  {
    ssr: false,
  },
);
import moment from 'moment';

const DateTimeType = ({
  type,
  name,
  rest,
  helperText,
  helperTextProps,
  size,
  defaultDisabled,
  theme,
  dateTimeOptions,
}) => {
  const { ampm, toolbarTitle, minDate, maxDate, openTo } = dateTimeOptions;

  let date = new Date(rest?.value);

  return (
    <StyledDateTimePicker
      {...rest}
      className="CMM-li-inputArea-dateTimePicker"
      ampm={ampm}
      disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
      toolbarTitle={toolbarTitle || '날짜 & 시간 선택'}
      format={rest?.inputFormat || 'YYYY-MM-DD hh:mm a'}
      value={moment(date)}
      minDate={minDate || moment('2000-01-01')}
      maxDate={maxDate || moment('2099-12-31')}
      views={rest?.views ? rest.views : ['year', 'month', 'day', 'hours', 'minutes']}
      onChange={(date) => {
        rest?.onChange && rest?.onChange(null, { date, name, type });
        return date;
      }}
      openTo={openTo || 'day'}
      slotProps={{
        textField: {
          className: 'CMM-li-inputArea-dateTimePicker-textField',
          sx: {
            background: theme.palette.grey[0],
            '& .Mui-focused': {
              boxShadow: '0 0 2px #008abb !important',
            },
            ...rest?.sx,
          },
          error: false,
          size: size,
          helperText: helperText,
          FormHelperTextProps: helperTextProps,
        },
      }}
      {...dateTimeOptions}
    />
  );
};

export default DateTimeType;
