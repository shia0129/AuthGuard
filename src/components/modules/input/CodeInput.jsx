import { useEffect,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LabelInput from './LabelInput';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import codeApi from '@api/system/codeApi';
import { setCodeCacheList } from '@modules/redux/reducers/code';
import { unstable_batchedUpdates } from 'react-dom';
import { useFormContext } from 'react-hook-form';

const CodeInput = ({
  type = 'select',
  codeType,
  label = '',
  name = '',
  value = '',
  onChange = () => {},
  onHandleChange,
  disabledefault = false,
  disableLabel = false,
  labelBackgroundFlag = false,
  required = false,
  disabled = false,
}) => {
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  const dispatch = useDispatch();
  const { codeCacheList } = useSelector((state) => state.code);
  const methods = useFormContext();
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const comboData = async () => {
      const data = await HsLib.comboList(codeApi, codeType);
      unstable_batchedUpdates(() => {
        dispatch(setCodeCacheList({ [codeType]: data }));
      });
    };

    if (!(codeType in codeCacheList)) comboData();

    return () => {
      source.cancel(`CodeInput-${name}: 코드 조회 실패.`);
    };
  }, []);

  return (
    <LabelInput
      disabledefault={disabledefault}
      disableLabel={disableLabel}
      disabled={disabled}
      labelBackgroundFlag={labelBackgroundFlag}
      required={required}
      label={label}
      type={type}
      name={name}
      list={codeCacheList[`${codeType}`] || []}
      {...(!methods && { value, onChange })}
      {...(onHandleChange && { onHandleChange })}
    />
  );
};

export default CodeInput;
