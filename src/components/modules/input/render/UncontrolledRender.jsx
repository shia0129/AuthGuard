import { Stack } from '@mui/material';
import ValidateInput from '@components/third-party/react-hook-form/ValidateInput';
import InputAlert from '@components/modules/common/InputAlert';

// 비제어 컴포넌트 react-hook-form 감싸는 함수.
const UncontrolledRender = ({
  children,
  type,
  name,
  rules,
  errors,
  onHandleChange = null,
  key = null,
  rest,
  maskOptions,
  checkList,
  onHandleBlur = null,
  formBackgroundFlag = false,
}) => {
  const nameArray = name.split('.');
  let tempStore;
  nameArray.forEach((name) => {
    if (tempStore) tempStore = tempStore[`${name}`];
    else tempStore = errors[`${name}`];
  });
  return (
    <Stack
      key={key}
      className={
        rest?.className
          ? rest?.className + ' CMM-li-inputArea-uncontrolledRender-stack'
          : 'CMM-li-inputArea-uncontrolledRender-stack'
      }
      direction="column"
      spacing={2}
      sx={
        formBackgroundFlag
          ? {
              padding: '6px',
              marginLeft: '0 !important',
              justifyContent: 'center',
              ...rest?.sx,
            }
          : { ...rest?.sx }
      }
    >
      <ValidateInput
        name={name}
        rules={rules}
        type={type}
        onHandleChange={onHandleChange}
        onHandleBlur={onHandleBlur}
        maskOptions={maskOptions}
        checkList={checkList}
      >
        {children}
      </ValidateInput>
      {type !== 'checkbox' && type !== 'radio' && tempStore && (
        <InputAlert>{tempStore.message}</InputAlert>
      )}
    </Stack>
  );
};

export default UncontrolledRender;
