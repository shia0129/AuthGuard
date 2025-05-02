import { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@mui/material';

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  return <Checkbox indeterminate={indeterminate} ref={resolvedRef} {...rest} />;
});

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.any,
};

export default IndeterminateCheckbox;
