import { Stack, Button } from '@mui/material';
import { isValidElement } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * 버튼을 묶는 컴포넌트 함수.
 * @param {String} type button set 타입. (search, custom)
 * @param {Object} sx Stack 적용 스타일.
 * @param {String} size button 사이즈.
 * @param {Array} options 버튼 정의 내용 (variant, color, callBack, label, role, fontColor, className)
 *
 */
const ButtonSet = ({ type, sx, size = 'small', options = [] }) => {
  const menuRoleList = useSelector((state) => state.menu.menuRoleList);

  return (
    <Stack direction="row" spacing={1.25} sx={{ ...sx }}>
      {options.map((option, index) => {
        let defaultVariant, defaultColor, defaultRole;
        if (option.role === 'insert') defaultRole = '2';
        else if (option.role === 'update') defaultRole = '3';
        else if (option.role === 'delete') defaultRole = '4';

        if (type === 'search') {
          defaultVariant = index % 2 === 0 ? 'outlined' : 'contained';
          defaultColor = index % 2 === 0 ? 'secondary' : 'primary';
        } else if (type === 'custom') {
          defaultVariant = 'contained';
          defaultColor = 'secondary';
        } else {
          defaultVariant = index % 2 === 0 ? 'contained' : 'outlined';
          defaultColor = index % 2 === 0 ? 'secondary' : 'secondary';
        }

        const display = option.role && !menuRoleList.includes(defaultRole) && 'none';

        return (
          <Button
            key={isValidElement(option.label) ? index : option.label}
            sx={{ display: display, ...option.sx }}
            size={size}
            className={option.className}
            variant={option.variant || defaultVariant}
            color={option.color || defaultColor}
            onClick={option.callBack}
            ref={option.ref}
          >
            {option.label}
          </Button>
        );
      })}
    </Stack>
  );
};

ButtonSet.propTypes = {
  /**
   * 디자인 적용 타입
   */
  type: PropTypes.oneOf(['search', 'custom', undefined]),
  /**
   * 버튼 그룹을 감싸는 컴포넌트에 적용할 스타일.
   */
  sx: PropTypes.object,
  /**
   * 버튼들의 크기.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * 연속되는 버튼들의 정보 객체.
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      sx: PropTypes.object,
      variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
      color: PropTypes.oneOf([
        'inherit',
        'primary',
        'secondary',
        'success',
        'error',
        'info',
        'warning',
        'any color string',
      ]),
      callBack: PropTypes.func,
      ref: PropTypes.any,
      label: PropTypes.string,
      role: PropTypes.oneOf(['insert', 'update', 'delete', 'read']),
    }),
  ),
};

export default ButtonSet;
