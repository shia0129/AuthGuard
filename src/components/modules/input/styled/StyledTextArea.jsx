import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

// textArea resize style 적용.
const StyledTextArea = styled(TextField)((prop) => ({
  textarea: {
    resize: prop?.InputProps?.readOnly ? 'none' : 'both',
  },
}));

export default StyledTextArea;
