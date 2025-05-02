// libraries
import PropTypes from 'prop-types';
import { Box, FormControlLabel, Radio } from '@mui/material';
import { CheckOutlined } from '@ant-design/icons';

// components
import Avatar from '@components/@extended/Avatar';

function ColorPalette({ color, value, name, ...rest }) {
  return (
    <FormControlLabel
      className="colorBox"
      value={value}
      label=""
      control={
        <Radio
          name={name}
          disableRipple
          icon={
            <Avatar
              variant="rounded"
              type="combined"
              size="xs"
              sx={{ backgroundColor: color, borderColor: 'divider' }}
            >
              <Box sx={{ display: 'none' }} />
            </Avatar>
          }
          checkedIcon={
            <Avatar
              variant="rounded"
              type="combined"
              size="xs"
              sx={{ backgroundColor: color, color: '#000', borderColor: 'divider' }}
            >
              <CheckOutlined />
            </Avatar>
          }
          sx={{
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
          {...rest}
        />
      }
    />
  );
}

ColorPalette.propTypes = {
  color: PropTypes.string,
  value: PropTypes.string,
};

export default ColorPalette;
