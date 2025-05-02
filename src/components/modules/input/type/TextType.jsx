import InputAlert from '@components/modules/common/InputAlert';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useEffect, useState ,useRef} from 'react';
import { useFormContext } from 'react-hook-form';
const StyledTextField = dynamic(() => import('@components/modules/input/styled/StyledTextField'), {
  ssr: false,
});

const validateTextValue = (validateInfo, { name, value }, setValidInfo) => {
  if (_.isEmpty(validateInfo) || !value) return '';
  const { onlyNumber, onlyText, minValue, maxValue, maxLength } = validateInfo;

  // 숫자만 입력하는 경우.
  if (onlyNumber && !/^\d+$/.test(value)) {
    setValidInfo((prev) => ({ ...prev, [name]: `숫자만 입력 가능합니다.` }));
    return value.slice(0, value.length - 1);
  }
  // 문자만 입력하는 경우.
  if (onlyText && /[0-9]/g.test(value)) {
    setValidInfo((prev) => ({ ...prev, [name]: `문자만 입력 가능합니다.` }));
    return value.slice(0, value.length - 1);
  }
  // 최대 길이 값 체크.
  if (maxLength && value.length > maxLength) {
    setValidInfo((prev) => ({ ...prev, [name]: `최대 ${maxLength}자리 까지 입력 가능합니다.` }));
    return value.slice(0, maxLength);
  }

  // 최소, 최대값 계산
  if (onlyNumber && (minValue || maxValue)) {
    if (maxValue && Number(value) > Number(maxValue)) {
      setValidInfo((prev) => ({ ...prev, [name]: `${maxValue} 이하 값만 입력 가능합니다.` }));
      return value.slice(0, value.length - 1);
    }
    if (minValue && Number(value) < Number(minValue)) {
      setValidInfo((prev) => ({ ...prev, [name]: `${minValue} 이상 값만 입력 가능합니다.` }));
      return value.slice(0, value.length - 1);
    }
  }

  setValidInfo((prev) => {
    const prevObj = { ...prev };

    if (name in prevObj) delete prevObj[`${name}`];
    return prevObj;
  });

  return value;
};

// form group 감싸는 함수.
const TextType = ({
  name,
  rest,
  helperText,
  helperTextProps,
  htmlType,
  size,
  defaultDisabled,
  theme,
  formBackgroundFlag,
  typingCheck,
  onlyNumber,
  onlyText,
  maxValue,
  minValue,
  maxLength,
  maskRef,
}) => {
  const methods = useFormContext();

  const [validInfo, setValidInfo] = useState({});

  const validateInfo = { onlyNumber, onlyText, minValue, maxValue, maxLength };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const timer = setTimeout(() => {
      setValidInfo({});
    }, 3000);

    return () => clearTimeout(timer);
  }, [validInfo]);

  return methods ? (
    <StyledTextField
      {...rest}
      inputRef={maskRef}
      className="inputBox inputText CMM-li-inputArea-textField"
      inputProps={
        rest?.inputProps && {
          ...rest.inputProps,
          autoComplete: 'off',
        }
      }
      type={htmlType}
      name={name}
      value={!maskRef ? rest?.value : undefined}
      size={size}
      sx={
        formBackgroundFlag
          ? {
              '& .Mui-readOnly, & .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: 'black',
                backgroundColor: '#efefef',
              },
              padding: '6px',
              marginLeft: '0 !important',
              justifyContent: 'center',
              ...rest?.sx,
            }
          : {
              '& .Mui-readOnly, & .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: 'black',
                backgroundColor: '#efefef',
              },
              background: theme.palette.grey[0],
              ...rest?.sx,
            }
      }
      onChange={(e) => {
        !maskRef &&
          rest?.onChange &&
          rest?.onChange(
            e,
            typingCheck
              ? validateInfo
              : validateTextValue(validateInfo, { name, value: e.target.value }, setValidInfo),
          );
      }}
      helperText={helperText}
      FormHelperTextProps={helperTextProps}
      disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
    />
  ) : (
    <>
      <StyledTextField
        {...rest}
        inputRef={maskRef}
        className="inputBox inputText CMM-li-inputArea-textField"
        inputProps={
          rest?.inputProps && {
            ...rest.inputProps,
            autoComplete: 'off',
          }
        }
        type={htmlType}
        name={name}
        value={!maskRef ? rest?.value : undefined}
        size={size}
        sx={
          formBackgroundFlag
            ? {
                '& .Mui-readOnly, & .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                  backgroundColor: '#efefef',
                },
                padding: '6px',
                marginLeft: '0 !important',
                justifyContent: 'center',
                ...rest?.sx,
              }
            : {
                '& .Mui-readOnly, & .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                  backgroundColor: '#efefef',
                },
                background: theme.palette.grey[0],
                ...rest?.sx,
              }
        }
        onChange={(e) => {
          !maskRef &&
            rest?.onChange &&
            rest?.onChange(
              e,
              typingCheck
                ? validateInfo
                : validateTextValue(validateInfo, { name, value: e.target.value }, setValidInfo),
            );
        }}
        helperText={helperText}
        FormHelperTextProps={helperTextProps}
        disabled={!defaultDisabled ? rest?.disabled : defaultDisabled}
      />
      {name in validInfo && (
        <InputAlert sx={{ color: theme.palette.grey[0] }} className="searchAlertBox">
          {validInfo[`${name}`]}
        </InputAlert>
      )}
    </>
  );
};

export default TextType;
