import { FormGroup, RadioGroup } from '@mui/material';

// form group 감싸는 함수.
const FormGroupRender = ({ type, children, direction, rest }) =>
  type === 'checkbox' ? (
    <FormGroup row={direction === 'row' && true} className="CMM-li-inputArea-formGroup">
      {children}{' '}
    </FormGroup>
  ) : (
    <RadioGroup
      row={direction === 'row' && true}
      value={rest?.value}
      onChange={rest?.onChange}
      className="CMM-li-inputArea-radioGroup"
    >
      {children}
    </RadioGroup>
  );

export default FormGroupRender;
