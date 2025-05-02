import LabelInput from '@components/modules/input/LabelInput';
import React from 'react';
import { useState, useEffect,useRef} from 'react';
import styled from 'styled-components';
import Button, { Stack } from '@mui/material';
import Label from '@components/modules/label/Label';

const CheckBoxInput = styled.div`
  input[type='checkbox'] {
    display: none;
  }

  input[type='checkbox'] + label {
    display: inline-block;
    margin: 1px;
    font: 0.8rem 'Noto Sans KR';
    text-align: center;
    background: #fcfcfc;
    border: 1px solid #ddd;
    padding: 6px 11px;
    box-sizing: border-box;
    cursor: pointer;
  }

  input[type='checkbox']:checked + label {
    background-image: none;
    background: #00aeb4;
    color: #fcfcfc;
    border: 1px solid #ccc;
    padding: 6px 11px;
    box-sizing: border-box;
    cursor: pointer;
    z-index: 1;
  }
`;

function WeekCheckBox(param) {
  const periodWeek = [
    { id: 'periodMonday', title: '월', key: 'monday' },
    { id: 'periodTuesday', title: '화', key: 'tuesday' },
    { id: 'periodWednesday', title: '수', key: 'wednesday' },
    { id: 'periodThursday', title: '목', key: 'thursday' },
    { id: 'periodFriday', title: '금', key: 'friday' },
    { id: 'periodSaturday', title: '토', key: 'saturday' },
    { id: 'periodSunday', title: '일', key: 'sunday' },
  ];

  const internalWeek = [
    { id: 'in0', title: '일', key: 'sunday' },
    { id: 'in1', title: '월', key: 'monday' },
    { id: 'in2', title: '화', key: 'tuesday' },
    { id: 'in3', title: '수', key: 'wednesday' },
    { id: 'in4', title: '목', key: 'thursday' },
    { id: 'in5', title: '금', key: 'friday' },
    { id: 'in6', title: '토', key: 'saturday' },
  ];

  const externalWeek = [
    { id: 'ex0', title: '일', key: 'sunday' },
    { id: 'ex1', title: '월', key: 'monday' },
    { id: 'ex2', title: '화', key: 'tuesday' },
    { id: 'ex3', title: '수', key: 'wednesday' },
    { id: 'ex4', title: '목', key: 'thursday' },
    { id: 'ex5', title: '금', key: 'friday' },
    { id: 'ex6', title: '토', key: 'saturday' },
  ];

  const [checkItemsInternal, setCheckItemsInternal] = useState([]);
  const [checkItemsExternal, setCheckItemsExternal] = useState([]);

  const init = async () => {
    if (param.weekValue === 'all') {
      const weekParam = [];
      if (param.type === 'insideWeek') {
        internalWeek.forEach((el) => weekParam.push(el.id));
        setCheckItemsInternal(weekParam);
      } else if (param.type === 'externalWeek') {
        externalWeek.forEach((el) => weekParam.push(el.id));
        setCheckItemsExternal(weekParam);
      }
    } else if (param.weekValue !== undefined) {
      const weekParam = param.weekValue.split(',');
      if (param.type === 'insideWeek') {
        const internalWeek = [];
        weekParam.forEach((el) => {
          internalWeek.push('in' + el);
        });
        setCheckItemsInternal(internalWeek);
      } else if (param.type === 'externalWeek') {
        const externalWeek = [];
        weekParam.forEach((el) => {
          externalWeek.push('ex' + el);
        });
        setCheckItemsExternal(externalWeek);
      }
    }
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();
  }, [param]);

  const handleAllCheck = (checked, id) => {
    const idArray = [];
    if (checked) {
      // 전체 선택
      if (id === 'internalWhole') {
        // 사후결재 - 내부 전체 선택
        internalWeek.forEach((el) => idArray.push(el.id));
        setCheckItemsInternal(idArray);
      } else if (id === 'externalWhole') {
        // 사후결재 - 외부 전체 선택
        externalWeek.forEach((el) => idArray.push(el.id));
        setCheckItemsExternal(idArray);
      }
      // else if (id === 'periodWhole') {
      //   // 기간 구분 - 요일별 - 전체 선택
      //   periodWeek.forEach((el) => idArray.push(el.id));
      //   setCheckItems(idArray);
      // }
    } else {
      if (id === 'internalWhole') {
        setCheckItemsInternal([]);
      } else if (id === 'externalWhole') {
        setCheckItemsExternal([]);
      }
      // else if (id === 'periodWhole') {

      // }
      // setCheckItems([]); // 전체 해제
    }
  };

  const handleSingleCheckInternal = (checked, id) => {
    console.log(checkItemsInternal);
    if (checked) {
      setCheckItemsInternal((prev) => [...prev, id]);
    } else {
      setCheckItemsInternal(checkItemsInternal.filter((el) => el !== id));
    }
  };

  const handleSingleCheckExternal = (checked, id) => {
    console.log(checkItemsExternal);
    if (checked) {
      setCheckItemsExternal((prev) => [...prev, id]);
    } else {
      setCheckItemsExternal(checkItemsExternal.filter((el) => el !== id));
    }
  };
  return (
    <>
      {/* {param.type === 'periodWeek' && (
        <CheckBoxInput>
          <Stack direction="row">
            <Label label="요일 선택" />
            <input
              type="checkbox"
              id="periodWhole"
              onChange={(e) => handleAllCheck(e.target.checked, e.target.id)}
              checked={checkItems.length === externalWeek.length ? true : false}
            />
            <label htmlFor="periodWhole" style={{ minWidth: '50px', height: '31px' }}>
              전체
            </label>
            {periodWeek?.map((data, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={data.id}
                  onChange={(e) => handleSingleCheck(e.target.checked, data.id)}
                  checked={checkItems.includes(data.id) ? true : false}
                />
                <label htmlFor={data.id}>{data.title}</label>
              </div>
            ))}
          </Stack>
        </CheckBoxInput>
      )} */}
      {param.type === 'insideWeek' && (
        <CheckBoxInput>
          <Stack direction="row">
            <Label label="요일 선택" />
            <input
              type="checkbox"
              id="internalWhole"
              disabled={param.disabled}
              onChange={(e) => handleAllCheck(e.target.checked, e.target.id)}
              checked={checkItemsInternal.length === externalWeek.length ? true : false}
            />
            <label htmlFor="internalWhole" style={{ minWidth: '50px', height: '31px' }}>
              전체
            </label>
            {internalWeek?.map((data, index) => (
              <div key={param.type + index}>
                <input
                  type="checkbox"
                  id={data.id}
                  disabled={param.disabled}
                  onChange={(e) => handleSingleCheckInternal(e.target.checked, data.id)}
                  checked={checkItemsInternal.includes(data.id) ? true : false}
                />
                <label htmlFor={data.id}>{data.title}</label>
              </div>
            ))}
          </Stack>
        </CheckBoxInput>
      )}
      {param.type === 'externalWeek' && (
        <CheckBoxInput>
          <Stack direction="row">
            <Label label="요일 선택" />
            <input
              type="checkbox"
              id="externalWhole"
              disabled={param.disabled}
              onChange={(e) => handleAllCheck(e.target.checked, e.target.id)}
              checked={checkItemsExternal.length === externalWeek.length ? true : false}
            />
            <label htmlFor="externalWhole" style={{ minWidth: '50px', height: '31px' }}>
              전체
            </label>
            {externalWeek?.map((data, index) => (
              // {week?.map((data, index) => (
              <div key={param.type + index}>
                <input
                  disabled={param.disabled}
                  type="checkbox"
                  id={data.id}
                  onChange={(e) => handleSingleCheckExternal(e.target.checked, data.id)}
                  checked={checkItemsExternal.includes(data.id) ? true : false}
                />
                <label htmlFor={data.id}>{data.title}</label>
              </div>
            ))}
          </Stack>
        </CheckBoxInput>
      )}
    </>
  );
}

export default WeekCheckBox;
