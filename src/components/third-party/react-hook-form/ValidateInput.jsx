import React, { useEffect, useRef } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useIMask } from 'react-imask';
import moment from 'moment';

function ValidateInput(props) {
  const { name, rules, type, onHandleChange, onHandleBlur, checkList, children, maskOptions } = props;
  const { control, setValue } = useFormContext();
  const watchValue = useWatch({ control, name, disabled: maskOptions ? false : true });

  const { ref, maskRef } = useIMask(
    maskOptions && {
      lazy: false,
      mask:
        maskOptions?.type === 'cellPhone'
          ? '000-0000-0000'
          : maskOptions?.type === 'phone'
          ? '00[0]0000-0000'
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
      onAccept: (value, { unmaskedValue }) => {
        if (unmaskedValue) setValue(name, value);
        else setValue(name, null);
      },
    }
  );

  // 기존 watchValue와 maskRef를 동기화하는 useEffect를 제거합니다.
  // IMask의 onAccept 콜백에서 setValue를 처리하므로, 별도의 updateValue 호출이 불필요하여 무한 업데이트를 방지합니다.

  // checkbox 관련 useEffect (필요 시 별도 관리; 여기서는 제거)
  // useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
    //   if (!useEffect_0001.current){
    //     useEffect_0001.current = true;
    //     return; 
    //   }
    // }
  //   if (!isSecondCallAllowed.current) return;
  //   if (type === 'checkbox' && checkList.length !== 0 && checkList.includes(children.props.value)) {
  //     setValue(name, children.props.value);
  //   }
  // }, []);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 다른 부수 효과가 필요하다면 여기에 추가합니다.
  }, []); 

  return (
    <Controller
      className="CMM-li-inputArea-controller"
      control={control}
      name={name}
      rules={rules}
      defaultValue={type === 'checkbox' && checkList.includes(children.props.value) ? children.props.value : children.props?.defaultValue || ''}
      render={({ field }) => {
        let propsToPass = {
          ...field,
          ...children.props,
          inputRef: (e) => {
            field.ref(e);
            if (e) {
              ref.current = e;
            }
          },
        };
        delete propsToPass.ref;

        // 시간 타입의 경우 moment 적용
        let tempValue = null;
        if (type === 'time1' || type === 'date1' || type === 'dateTime') {
          tempValue = moment(field.value);
        } else {
          tempValue = field.value;
        }
        if (type === 'select' && field.value === null) field.value = '';

        if (!maskOptions) {
          propsToPass = {
            ...children.props,
            value: tempValue,
            inputRef: field.ref,
            checked: type === 'checkbox'
              ? children.props.value === field.value
                ? true
                : false
              : type === 'radio' && field.value === children.props.value,
            onChange: function onChange(e) {
              if (onHandleChange) {
                field.onChange(
                  onHandleChange({
                    value: type === 'dateTime' ? e : children.props.value || e.target.value,
                    name,
                    type,
                    checked: type !== 'dateTime' && e.target.checked,
                  })
                );
              } else {
                if (type === 'checkbox') {
                  field.onChange(e.target.checked ? children.props.value : '');
                } else if (type === 'radio') {
                  field.onChange(children.props.value || e.target.value);
                } else if (type === 'day1') {
                  let newValue;
                  let index = field.value && field.value.indexOf(e.target.value);
                  if (e.target.value === '0') {
                    if (field.value.length >= 7) {
                      newValue = [];
                    } else {
                      newValue = ['0', '1', '2', '3', '4', '5', '6', '7'];
                    }
                  } else {
                    if (field.value && index >= 0) {
                      newValue = field.value.slice();
                      newValue.splice(index, 1);
                      index = field.value && field.value.indexOf('0');
                      if (newValue.length === 1 && index >= 0) {
                        newValue.splice(index, 1);
                      }
                    } else {
                      newValue = field.value ? field.value.concat(e.target.value) : [e.target.value];
                      if (newValue.length === 7) {
                        newValue.push('0');
                      }
                    }
                    index = newValue && newValue.indexOf('0');
                    if (newValue.length < 8 && index >= 0) {
                      newValue.splice(index, 1);
                    }
                  }
                  newValue.sort();
                  field.onChange(newValue);
                } else {
                  field.onChange(e);
                }
              }
            },
          };
          delete propsToPass.ref;
          if (type === 'day1') {
            delete propsToPass.inputRef;
          }
        }

        if (onHandleBlur) {
          propsToPass = {
            ...propsToPass,
            onBlur: function onBlur(e) {
              field.onBlur(onHandleBlur({ value: children.props.value || e.target.value }));
            },
          };
        }

        return React.createElement(children.type, {
          ...propsToPass,
        });
      }}
    />
  );
}

export default ValidateInput;
