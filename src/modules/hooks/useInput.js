import { useState, useMemo, useCallback } from 'react';
import { useRef } from 'react';

const useInput = (initValue = null) => {
  /**
   * size: 페이지 크기.
   * page: 페이지 번호.
   */
  const [data, setData] = useState({ ...initValue, size: 25, page: 0 });
  const defaultData = useMemo(() => ({ ...initValue, size: 25, page: 0 }), []);
  // data 변경에 따라 렌더링에 영향을 주지않는 Ref 변수.
  const unControlRef = useRef(data);
  const changeHandler = useCallback(
    (event, info = null) => {
      if (event) {
        const { type, name, value } = event.target;
        if (type === 'checkbox') {
          setData((prevData) => {
            let newValueList;
            // 배열인 경우, 체크박스가 여러개인 경우
            if (Array.isArray(prevData[`${name}`])) {
              newValueList = prevData[`${name}`]?.includes(value)
                ? prevData[`${name}`]?.filter((v) => v !== value)
                : [...prevData[`${name}`], value];
            } else {
              newValueList = prevData[`${name}`] ? false : true;
            }
            return {
              ...prevData,
              [name]: newValueList,
            };
          });
        } else {
          let inputValue = value;
          let errorMessage = '';
          if (info) {
            const { onlyNumber, onlyText, minValue, maxValue, maxLength } = info;

            // 숫자만 입력하는 경우.
            if (onlyNumber && !/^\d+$/.test(value))
              inputValue = inputValue.slice(0, inputValue.length - 1);
            // 문자만 입력하는 경우.
            if (onlyText && /[0-9]/g.test(value))
              inputValue = inputValue.slice(0, inputValue.length - 1);
            // 최대 길이 값 체크.
            if (maxLength && inputValue?.length > maxLength)
              inputValue = inputValue.slice(0, maxLength);

            // 최소, 최대값 계산
            if (onlyNumber && (minValue || maxValue)) {
              if (Number(inputValue) > Number(maxValue)) {
                inputValue = '';
                errorMessage = `${maxValue}이하 값만 입력 가능합니다.`;
              }
              if (Number(inputValue) < Number(minValue)) {
                inputValue = '';
                errorMessage = `${minValue}이상 값만 입력 가능합니다.`;
              }

              if (errorMessage) {
                data.errorInformation = { ...data?.errorInformation, [name]: errorMessage };
              } else if (data?.errorInformation?.[`${name}`]) {
                delete data.errorInformation[`${name}`];
              }
            }
          }

          const result = {
            ...data,
            [name]: inputValue,
          };
          unControlRef.current = result;
          setData(result);
        }
      } else {
        const { date, name: dateName, type } = info;
        let result;
        if (type === 'date1' || type === 'dateTime' || type === 'time1') {
          result = {
            ...data,
            [dateName]: date,
          };
        }
        unControlRef.current = result;
        setData(result);
      }
    },
    [data],
  );

  const reset = useCallback(
    (_, additionalParameter) => {
      const initValue = {
        ...defaultData,
        size: 25,
        page: 0,
        ...additionalParameter,
      };
      setData(initValue);
      unControlRef.current = initValue;
    },
    [defaultData, data],
  );

  const changeData = (newData) => {
    unControlRef.current = newData;
    setData(newData);
  };

  return [data, changeHandler, reset, changeData, unControlRef];
};

export default useInput;
