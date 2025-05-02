import { FormControl } from '@mui/material';

// form control 감싸는 함수.
const FormControlRender = ({
  children,
  size,
  formControlProps,
  formBackgroundFlag,
  isUncontrolled = false,
}) => {
  return (
    <FormControl
      className="CMM-li-inputArea-formControl"
      size={size}
      fullWidth
      {...formControlProps}
      sx={{
        ...(formBackgroundFlag
          ? {
              marginLeft: '0 !important',
              padding: '6px',
              justifyContent: 'center',
            }
          : isUncontrolled && {
              marginLeft: '0 !important',
            }),
      }}
    >
      {children}
    </FormControl>
  );
};

export default FormControlRender;
