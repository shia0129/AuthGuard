import { Stack, InputLabel, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useFormContext } from 'react-hook-form';
import useAccess from '@modules/hooks/useAccess';
import moment from 'moment';
import { useEffect,useRef } from 'react';
import { useIMask } from 'react-imask';
import { useIntl } from 'react-intl';
import FormGroupRender from '@components/modules/input/render/FormGroupRender';
import FormControlRender from '@components/modules/input/render/FormControlRender';
import UncontrolledRender from '@components/modules/input/render/UncontrolledRender';
import TypeRender from '@components/modules/input/render/TypeRender';
import InputAlert from '../common/InputAlert';

/**
 * Label과 함께 다양한 타입의 Input을 지원하는 제어 / 비제어 컴포넌트.
 * @param {String} type input 타입 종류. (text, select, checkbox, radio, date, textArea)
 * @param {String} label input에 대한 label. (없을 경우 Input만 렌더링.)
 * @param {Boolean} required 필수 입력 값 여부. (default false)
 * @param {String} errorMesg  필수 입력 값 에러 메시지.
 * @param {Boolean} disabledefault select option의 기본 값인 '선택' 값 포함여부.(default false)
 * @param {String} name Input name
 * @param {Object} rules RHF 값 유효성 검증 객체. (비제어 컴포넌트 전용)
 * @param {Function} onHandleChange 커스텀 onChange 함수. (비제어 컴포넌트 전용)
 * @param {String} direction label과 input 배치 방향.
 * @param {Object} labelSx label 적용 CSS.
 * @param {String} helperText input에 대한 부가설명.
 * @param {Object} helperTextProps helperText 적용 속성.
 * @param {Object} dateProps date input에 적용할 속성
 * @param {String} htmlType input html type.
 * @param {String} size input 크기.
 * @param {Object} emptysx checkbox 또는 radio type의 list 항목 중 value가 없는 경우 렌더링되는 Box 컴포넌트 CSS.
 * @param {Object} stacksx label과 input을 감싸는 Stack 컴포넌트 CSS.
 * @param {Object} maskOptions react-imask input masking 옵션.
 * @param {Object} formControlProps Select, Checkbox, Radio의 FormControl 컴포넌트 속성.
 * @param {Array} totalList 동일한 name의 Checkbox 목록이 사용되는 경우 한 곳에 담기위한 목록. (비제어 전용)
 * @param {Array} checkList checkbox default check 여부. (비제어)
 * @param {Number} maxLength text input 입력 최대 길이 제한.
 * @param {Number} maxValue text input 입력 최대값 제한.
 * @param {Number} minValue text input 입력 최소값 제한.
 * @param {Boolean} onlyNumber text input 숫자만 입력 가능하도록 제한.
 * @param {Boolean} onlyText text input 문자만 입력 가능하도록 제한.
 * @param {Boolean} onlySite text input 도메인 형식의 문자만 입력 가능하도록 제한.
 * @param {Boolean} onlyUrl text input URL 형식의 문자만 입력 가능하도록 제한.
 * @param {Boolean} disableAutoRules input validation 사용 여부.
 * @param {Boolean} typingCheck input validation 입력 제한 여부.
 * @param {Function} onHandleBlur 커스텀 onBlur이벤트 지정.
 * @param {Boolean} labelBackgroundFlag 라벨 디자인포맷 적용 여부.
 * @param {Object} dateTimeOptions dateTime type input 적용 속성.
 * @param {Boolean} labelOverflow label 내용이 길어질 경우, ... 축약 사용여부.
 * @param {Array} list checkBox, radio, select에서 컴포넌트 생성 시 사용하는 목록.
 * @param {Boolean} disableLabel label 사용 여부 (label은 사용하고 싶지않지만, 에러메시지 표시하기 위해.)
 */
function LabelInput({
  type = 'text',
  label = '',
  required = false,
  errorMesg = '',
  disabledefault = false,
  name,
  rules,
  onHandleChange = null,
  direction = 'row',
  labelSx,
  helperText,
  helperTextProps,
  dateProps,
  htmlType,
  size = 'small',
  emptysx,
  stacksx,
  maskOptions,
  formControlProps,
  checkList = [],
  totalList = [],
  maxLength,
  maxValue,
  minValue,
  onlyNumber = false,
  onlyText = false,
  onlySite = false,
  onlyUrl = false,
  disableAutoRules = false,
  typingCheck = false,
  onHandleBlur = null,
  enableCheckAll = false,
  labelBackgroundFlag = false,
  dateTimeOptions = {},
  labelOverflow = false,
  list = [],
  disableLabel = false,
  ...rest
}) {
  const methods = useFormContext();
  const { insert, update } = useAccess();
  const theme = useTheme();
  const intl = useIntl();

  const { ref, setUnmaskedValue } = useIMask(
    maskOptions && {
      lazy: true,
      mask:
        maskOptions?.type === 'cellPhone'
          ? '000-0000-0000'
          : maskOptions?.type === 'phone'
          ? '00[0])0000-0000'
          : maskOptions?.type === 'ipv4'
          ? 'w.w.w.w'
          : maskOptions?.type === 'ipv6'
          ? 'w:w:w:w:w:w:w:w'
          : maskOptions?.type === 'mac'
          ? 'w:w:w:w:w:w'
          : 'w@w',
      blocks:
        maskOptions?.type === 'email'
          ? {
              w: {
                mask: /^[0-9a-zA-Z.]*$/,
              },
            }
          : maskOptions?.type === 'ipv4'
          ? {
              w: {
                mask: /^(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])$/,
              },
            }
          : maskOptions?.type === 'ipv6'
          ? {
              w: {
                mask: /^[0-9a-fA-F]{1,4}$/,
              },
            }
          : maskOptions?.type === 'mac'
          ? {
              w: {
                mask: /^[0-9A-Fa-f]{1,2}$/,
              },
            }
          : null,
      ...maskOptions,
    },
    {
      onAccept: (_, maskRef, event) => {
        if (rest?.onChange && event) {
          if (maskRef.unmaskedValue === '') {
            rest.onChange({ target: { type, name, value: '' } });
          } else {
            rest.onChange(event);
          }
        }
      },
    },
  );
  const useEffect_0001 = useRef(false);
  // 제어 컴포넌트 마스킹 후 초기화 시 값 업데이트.
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (maskOptions && !rest?.value) {
      setUnmaskedValue('');
    }
  }, [rest?.value]);

  let defaultDisabled = false;

  // 제어 컴포넌트 중, 수정 페이지에 대한 권한이 없거나 추가 페이지에 대한 권한이 없으면 input disabled 처리.
  if (
    methods?.type !== 'auth' &&
    ((methods?.flag === 'update' && !update) || (methods?.flag === 'insert' && !insert))
  )
    defaultDisabled = true;

  // 기본 설정 RHF Rule Option Validation.
  const ruleOptions = { ...rules };

  if (methods) {
    if (!disableAutoRules) {
      if (type === 'date1') {
        ruleOptions.validate = {
          ...ruleOptions.validate,
          validDate: (value) => {
            return moment(value).isValid() || '올바른 날짜 형식을 입력해주세요.';
          },
        };
      }
      // 텍스트인 경우 숫자만 입력
      if (type === 'text') {
        // 숫자 입력만 허용
        if (onlyNumber) {
          ruleOptions.validate = {
            ...ruleOptions.validate,
            onlyNumber: (value) => {
              const regexp = /[^0-9]/g;
              return !value || !regexp.test(value) || '숫자만 입력가능합니다.';
            },
          };
          // 숫자입력의 경우, 최대값 지정
          if (maxValue)
            ruleOptions.validate = {
              ...ruleOptions.validate,
              lessThenMaxValue: (value) => {
                return (
                  !value ||
                  Number(value) <= Number(maxValue) ||
                  `${maxValue}이하 값만 입력 가능합니다.`
                );
              },
            };

          // 숫자입력의 경우, 최소값 지정
          if (minValue)
            ruleOptions.validate = {
              ...ruleOptions.validate,
              moreThenMinValue: (value) => {
                return (
                  !value ||
                  Number(value) >= Number(minValue) ||
                  `${minValue}이상 값만 입력 가능합니다.`
                );
              },
            };
        }
        // 문자 입력만 허용
        else if (onlyText)
          ruleOptions.validate = {
            ...ruleOptions.validate,
            onlyText: (value) => {
              const regexp = /[0-9]/g;
              return !regexp.test(value) || '문자만 입력가능합니다.';
            },
          };
        // 도메인 형식의 입력만 허용
        else if (onlySite) {
          ruleOptions.validate = {
            ...ruleOptions.validate,
            onlySite: (value) => {
              const regexp = /^[a-zA-Z.-]+$/;
              return regexp.test(value) || '올바른 도메인 형식을 입력하세요. (예: hanssak.co.kr)';
            },
          };
        }
        // URL 형식의 입력만 허용
        else if (onlyUrl) {
          ruleOptions.validate = {
            ...ruleOptions.validate,
            onlyUrl: (value) => {
              const regex = /^[a-zA-Z0-9.-]+\/[a-zA-Z0-9-_/]*$/;
              return regex.test(value) || '올바른 URL 형식을 입력하세요. (예: hanssak.co.kr/login)';
            },
          };
        }
      }
      // 필수 입력 지정
      if (required) {
        if (type === 'checkbox') {
          ruleOptions.validate = {
            ...ruleOptions.validate,
            checkRequired: () => {
              const listValue = methods.getValues(name).filter((data) => data);
              if (listValue.length !== 0) {
                methods.clearErrors(name);
                return true;
              }
              return label ? `${label}을(를) 선택해주세요.` : errorMesg;
            },
          };
        } else {
          let message;

          if (type === 'date1') {
            if (label) message = '시작날짜를 입력해주세요.';
            else message = '종료날짜를 입력해주세요.';
          } else if (label) {
            if (type === 'select' || type === 'radio')
              message = errorMesg || `${label}을(를) 선택해주세요.`;
            else message = errorMesg || `${label}을(를) 입력해주세요.`;
          } else if (errorMesg) {
            message = errorMesg;
          }

          ruleOptions.required = {
            value: true,
            message,
          };
        }
      } else {
        ruleOptions.required = {
          value: false,
        };
      }

      if (maxLength) {
        ruleOptions.validate = {
          ...ruleOptions.validate,
          checkMaxLength: (value) =>
            !value ||
            String(value)?.length <= Number(maxLength) ||
            `${maxLength}자리 이하로 입력해야 합니다.`,
        };
      }
    }
  }

  // text 타입의 경우, 입력 값 제어 이벤트 핸들러.
  if (typingCheck && (type === 'text' || type === 'textArea')) {
    onHandleChange = ({ value }) => {
      let targetValue = value;

      // 숫자만 입력하는 경우.
      if (onlyNumber && !/^\d+$/.test(value)) return targetValue.slice(0, targetValue.length - 1);
      // 문자만 입력하는 경우.
      if (onlyText && /[0-9]/g.test(value)) return targetValue.slice(0, targetValue.length - 1);
      // 최대 길이 값 체크.
      if (maxLength && String(value)?.length > maxLength) {
        return targetValue.slice(0, maxLength);
      }
      return targetValue;
    };

    onHandleBlur = ({ value }) => {
      let targetValue = value;
      // 숫자만 입력하는 경우.
      if (onlyNumber && !/^\d+$/.test(value)) return targetValue.slice(0, targetValue.length - 1);
      // 문자만 입력하는 경우.
      if (onlyText && /[0-9]/g.test(value)) return targetValue.slice(0, targetValue.length - 1);
      // 최대 길이 값 체크.
      if (maxLength && String(value)?.length > maxLength) {
        return targetValue.slice(0, maxLength);
      }
      if (onlyNumber) {
        // 최대값보다 큰 경우.
        if (maxValue) {
          if (Number(targetValue) > Number(maxValue)) {
            methods.setError(name, {
              type: 'maxValueError',
              message: `${maxValue}이하 값만 입력 가능합니다.`,
            });
            return;
          } else {
            methods.clearErrors(name);
          }
        }

        // 최소값보다 작은 경우.
        if (minValue) {
          if (Number(targetValue) < Number(minValue)) {
            methods.setError(name, {
              type: 'minValueError',
              message: `${minValue}이상 값만 입력 가능합니다.`,
            });
            return;
          } else {
            methods.clearErrors(name);
          }
        }
      }
      return targetValue;
    };
  }

  return (
    <Stack
      sx={{ height: '100%', ...stacksx }}
      direction={direction}
      // alignItems={direction === 'row' ? (labelBackgroundFlag ? '' : 'center') : 'baseline'}
      alignItems={direction === 'row' ? 'center' : ' '}
      spacing={1.5}
      className="CMM-li-rootArea-stack"
    >
      {!disableLabel &&
        label &&
        type !== 'date2' &&
        type !== 'time2' &&
        (labelBackgroundFlag ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: '42px',
              padding: '0 15px',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              backgroundColor: theme.palette.grey[50],
              borderRight: '1px solid',
              borderColor: theme.palette.grey[300],
              ...labelSx,
            }}
            className={
              required || rest?.requiredMask
                ? 'CMM-li-labelArea-div text inputText req'
                : 'CMM-li-labelArea-div text inputText'
            }
            dangerouslySetInnerHTML={{ __html: label }}
          />
        ) : (
          <InputLabel
            sx={{
              width: '100%',
              textAlign: 'right',
              pl: 2,
              fontSize: '14px',
              ...(!labelOverflow && {
                whiteSpace: 'unset',
                textOverflow: 'unset',
                overflow: 'unset',
              }),
              ...labelSx,
            }}
            className={
              required
                ? 'CMM-li-labelArea-inputLabel text inputText req'
                : 'CMM-li-labelArea-inputLabel text inputText'
            }
          >
            {Object.prototype.hasOwnProperty.call(intl.messages, label) ? (
              intl.formatMessage({ id: label })
            ) : (
              <div
                style={{ display: 'inline-block' }}
                dangerouslySetInnerHTML={{ __html: label }}
              />
            )}
          </InputLabel>
        ))}
      {methods ? (
        type === 'checkbox' || type === 'radio' ? (
          <Stack direction="column" className="CMM-li-inputArea-stack">
            {FormControlRender({
              children: (
                <>
                  {FormGroupRender({
                    children: list?.map((data, index) => {
                      if (data.value)
                        return UncontrolledRender({
                          children: TypeRender({
                            type,
                            itemList: list,
                            item: data,
                            defaultDisabled,
                            formBackgroundFlag: labelBackgroundFlag ? true : false,
                            name,
                            rest,
                          }),
                          type,
                          name:
                            type === 'checkbox'
                              ? totalList.length !== 0
                                ? `${name}.${totalList?.findIndex(
                                    (totalData) => totalData.value === data.value,
                                  )}`
                                : `${name}.${index}`
                              : name,
                          rules: ruleOptions,
                          errors: methods?.formState.errors,
                          onHandleChange,
                          key: data.id || data.value,
                          checkList,
                          theme,
                          formBackgroundFlag: labelBackgroundFlag ? true : false,
                        });
                      else return TypeRender({ rest: { ...rest, emptysx }, item: data });
                    }),
                    direction,
                    type,
                    rest,
                  })}
                  {helperText && <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>}
                </>
              ),
              size,
              formControlProps,
              isUncontrolled: labelBackgroundFlag ? true : false,
            })}
            {methods?.formState.errors[`${name}`] && (
              <InputAlert>
                {type === 'checkbox'
                  ? methods?.formState.errors[`${name}`].filter((data) => data)[0].message
                  : methods?.formState.errors[`${name}`].message}
              </InputAlert>
            )}
          </Stack>
        ) : type === 'select' ? (
          FormControlRender({
            children: (
              <>
                {UncontrolledRender({
                  children: TypeRender({
                    type,
                    name,
                    rest,
                    disabledefault,
                    helperText,
                    defaultDisabled,
                    theme,
                    list,
                  }),
                  type,
                  name,
                  rules: ruleOptions,
                  errors: methods?.formState.errors,
                  onHandleChange,
                  rest,
                  formBackgroundFlag: labelBackgroundFlag ? true : false,
                  theme,
                })}
                {helperText && <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>}
              </>
            ),
            size,
            formControlProps,
            isUncontrolled: labelBackgroundFlag ? true : false,
          })
        ) : (
          UncontrolledRender({
            children: TypeRender({
              type,
              rest,
              helperText,
              helperTextProps,
              dateProps,
              htmlType,
              size,
              defaultDisabled,
              label,
              name,
              theme,
              dateTimeOptions,
            }),
            type,
            name,
            rules: ruleOptions,
            errors: methods?.formState.errors,
            maskOptions,
            rest,
            onHandleChange,
            onHandleBlur,
            theme,
            formBackgroundFlag: labelBackgroundFlag ? true : false,
          })
        )
      ) : type === 'checkbox' ? (
        FormControlRender({
          children: FormGroupRender({
            children: list
              ?.map((item) => ({
                ...item,
                checked: Array.isArray(rest.value) ? rest.value.includes(item.value) : rest.value,
              }))
              .map((data) => TypeRender({ type, name, item: data, defaultDisabled, rest }))
              .reduce(
                (init, data) => [...init, data],
                enableCheckAll
                  ? [
                      // eslint-disable-next-line react/jsx-key
                      <FormControlLabel
                        // key={`param-checkbox-all`}
                        disabled={defaultDisabled}
                        value={['ALL VALUES']}
                        control={
                          <Checkbox
                            name={name}
                            value={'ALL VALUES'}
                            checked={
                              JSON.stringify(rest.value.sort()) ===
                              JSON.stringify(list?.map((item) => item.value).sort())
                            }
                            onChange={() => {
                              const workList =
                                rest.value.length === list.length || rest.value.length === 0
                                  ? list
                                  : list.filter((item) => !rest.value.includes(item.value));
                              workList.map((item) =>
                                rest?.onChange({
                                  target: { type: 'checkbox', value: item.value, name },
                                }),
                              );
                            }}
                          />
                        }
                        label={`전체`}
                      />,
                    ]
                  : [],
              ),
            direction,
            type,
            rest,
          }),
          size,
          formControlProps,
          formBackgroundFlag: labelBackgroundFlag ? true : false,
        })
      ) : type === 'radio' ? (
        FormControlRender({
          children: FormGroupRender({
            children: list
              .map((item) => ({
                ...item,
                checked: rest.value === item.value,
              }))
              .map((data) => TypeRender({ type, name, item: data, defaultDisabled, rest })),
            direction,
            type,
            rest,
          }),
          size,
          formControlProps,
          formBackgroundFlag: labelBackgroundFlag ? true : false,
        })
      ) : type === 'select' ? (
        FormControlRender({
          children: TypeRender({
            type,
            name,
            rest,
            disabledefault,
            defaultDisabled,
            theme,
            formBackgroundFlag: labelBackgroundFlag ? true : false,
            list,
          }),
          size,
          formControlProps,
          formBackgroundFlag: labelBackgroundFlag ? true : false,
        })
      ) : (
        TypeRender({
          type,
          name,
          rest,
          size,
          helperText,
          helperTextProps,
          dateProps,
          htmlType,
          label,
          defaultDisabled,
          maxLength,
          theme,
          formBackgroundFlag: labelBackgroundFlag ? true : false,
          typingCheck,
          onlyNumber,
          onlyText,
          maxValue,
          minValue,
          dateTimeOptions,
          maskRef: maskOptions && ref,
        })
      )}
    </Stack>
  );
}

LabelInput.displayName = 'LabelInput';

LabelInput.propTypes = {
  /**
   * input 타입 종류.
   */
  type: PropTypes.string,
  /**
   * input에 대한 label.
   */
  label: PropTypes.string,
  /**
   * 필수 입력 값 여부. **(Uncontrolled)**
   */
  required: PropTypes.bool,
  /**
   * 필수 입력 값 에러 메시지. **(Uncontrolled)**
   */
  errorMesg: PropTypes.string,
  /**
   * select option의 기본 값인 '선택' 값 포함여부.
   */
  disabledefault: PropTypes.bool,
  /**
   * input name. **(Uncontrolled)**
   */
  name: PropTypes.string,
  /**
   * RHF 값 유효성 검증 객체.
   * - [React Hook Form](https://react-hook-form.com/docs/useform/register#options)
   */
  rules: PropTypes.shape({
    validate: (value) => {},
  }),
  /**
   * 커스텀 onChange 함수. **(Uncontrolled)**
   * @param {*} value input value. (dateTime type, event객체)
   * @param {*} name  input name.
   * @param {*} type LabelInput type.
   * @param {*} checked input checked value. (dateTime type, undefined)
   */
  onHandleChange: ({ value, name, type, checked }) => {},
  /**
   * label과 input 배치 방향.
   */
  direction: PropTypes.string,
  /**
   * label 적용 CSS.
   */
  labelSx: PropTypes.object,
  /**
   * input에 대한 부가설명.
   */
  helperText: PropTypes.string,
  /**
   * helperText 적용 속성.
   * - [FormhelperText 속성](https://mui.com/material-ui/api/form-helper-text/)
   */
  helperTextProps: PropTypes.object,
  /**
   * input html type.
   * - [html input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
   */
  htmlType: PropTypes.string,
  /**
   * input 크기.
   */
  size: PropTypes.string,
  /**
   * checkbox 또는 radio type의 list 항목 중 value가 없는 경우 렌더링되는 Box 컴포넌트 CSS.
   */
  emptysx: PropTypes.object,
  /**
   * label과 input을 감싸는 Stack 컴포넌트 CSS.
   */
  stacksx: PropTypes.object,
  /**
   * input masking 옵션. **(type: text)**
   * - **cellPhone: 000-0000-0000**
   * - **phone: 00[0])0000-0000**
   * - **ipv4: 0.0.0.0**
   * - **ipv6: 0:0:0:0:0:0:0:0**
   * - **mac: 0:0:0:0:0:0**
   * - **email: id@email.com**
   */
  maskOptions: PropTypes.shape({
    type: PropTypes.oneOf(['cellPhone', 'phone', 'ipv4', 'ipv6', 'mac', 'email']),
  }),
  /**
   * FormControl 컴포넌트 속성. **(type: checkbox, radio, select)**
   * - [FormControl 속성](https://mui.com/material-ui/api/form-control/)
   */
  formControlProps: PropTypes.object,
  /**
   * checkbox default check 여부. **(Uncontrolled)**
   * - **list props 요소의 value를 포함하는 배열**
   *
   */
  checkList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),

  /**
   * 동일한 name의 Checkbox 목록이 사용되는 경우 한 곳에 담기위한 목록. **(Uncontrolled)**
   * - **특별한 경우를 제외하고 사용X.**
   */
  totalList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  /**
   * text input 입력 최대 길이 제한.
   * - typingCheck true 시, 입력을 제한.
   * - typingCheck false 시, submit을 제한. **(Uncontrolled)**
   */
  maxLength: PropTypes.number,
  /**
   * text input 입력 최대값 제한.
   * - typingCheck true 시, 입력을 제한.
   * - typingCheck false 시, submit을 제한. **(Uncontrolled)**
   */
  maxValue: PropTypes.number,
  /**
   * text input 입력 최소값 제한.
   * - typingCheck true 시, 입력을 제한.
   * - typingCheck false 시, submit을 제한. **(Uncontrolled)**
   */
  minValue: PropTypes.number,
  /**
   * text input 숫자만 입력 가능하도록 제한.
   * - typingCheck true 시, 입력을 제한.
   * - typingCheck false 시, submit을 제한. **(Uncontrolled)**
   */
  onlyNumber: PropTypes.bool,
  /**
   * text input 문자만 입력 가능하도록 제한.
   * - typingCheck true 시, 입력을 제한.
   * - typingCheck false 시, submit을 제한. **(Uncontrolled)**
   */
  onlyText: PropTypes.bool,
  /**
   * text input 도메인 형식의 문자만 입력 가능하도록 제한.
   * - typingCheck true 시, 입력을 제한.
   * - typingCheck false 시, submit을 제한. **(Uncontrolled)**
   */
  onlySite: PropTypes.bool,
  /**
   * text input URL 형식의 문자만 입력 가능하도록 제한.
   * - typingCheck true 시, 입력을 제한.
   * - typingCheck false 시, submit을 제한. **(Uncontrolled)**
   */
  onlyUrl: PropTypes.bool,
  /**
   * input validation 사용 여부.
   */
  disableAutoRules: PropTypes.bool,
  /**
   * input validation 입력 제한 여부.
   */
  typingCheck: PropTypes.bool,
  /**
   * 커스텀 onBlur이벤트 지정. **(Uncontrolled)**
   * @param {*} value input value.
   */
  onHandleBlur: ({ value }) => {},
  /**
   * 디자인포맷 적용 여부.
   */
  labelBackgroundFlag: PropTypes.bool,
  /**
   * dateTime type input 적용 속성.
   */
  dateTimeOptions: PropTypes.shape({
    ampm: PropTypes.oneOf(['am', 'pm']),
    toolbarTitle: PropTypes.string,
    inputFormat: PropTypes.string,
    minDate: PropTypes.instanceOf(moment),
    maxDate: PropTypes.instanceOf(moment),
    hideTabs: PropTypes.bool,
    views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
    openTo: PropTypes.oneOf(['year', 'month', 'day', 'hours', 'minutes', 'seconds']),
  }),
  /**
   * label 내용이 길어질 경우, 축약 사용여부.
   */
  labelOverflow: PropTypes.bool,
  /**
   * 컴포넌트 생성 시 사용하는 목록. **(type: checkbox, radio, select)**
   *
   */
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
  /**
   * label 사용여부
   * - **true 시, label은 표시되지 않지만 에러 메시지는 표시.**
   */
  disableLabel: PropTypes.bool,
  /**
   *  Row 확장 여부 **(type: textArea)**
   * - **true 시, rows에 지정한 값만큼 textArea확장**
   */
  multiline: PropTypes.bool,
  /**
   * Row 확장 값  **(type: textArea)**
   */
  rows: PropTypes.number,
  /**
   * 제어 컴포넌트 이벤트 핸들러 **(Controlled)**
   * - **dateTime type: (null, dateInfo) => {} **
   * - **그 외: (event) => {}**
   * - __**checkbox type value는 배열로 관리되므로 주의.**__
   *
```javascript
// onChange 핸들러 예제 함수
const handleOnChange = (event, dateInfo) => {
  if (type === 'checkbox') {

    setValue((prevData) => {
      const newValue = [...prevData];
      const idx = newValue.findIndex((item) => item === Number(event.target.value));
    
      if (idx !== -1) {
        newValue.splice(idx, 1);
      } else newValue.push(Number(event.target.value));

      return newValue;
    });

  } else if (type === 'date1') {

    setValue(dateInfo.date);

    // story book actions.
    rest.onChange(dateInfo);
    return;

  } else setValue(event.target.value);

  // story book actions.
  rest.onChange(event);
};
```
   *
   */
  onChange: PropTypes.func,
};

export default LabelInput;
