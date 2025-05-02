import { TextField } from '@mui/material';
import LabelInput from '@components/modules/input/LabelInput';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState,useRef } from 'react';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import baseApi from '@api/common/baseApi';
import { useTheme } from '@mui/material/styles';

const EditableCell = ({ value: initialValue, row, column, updateMyData, listInfo, sx }) => {
  const { instance, source } = AuthInstance();

  const [value, setValue] = useState();
  baseApi.axios = instance;

  const theme = useTheme();

  let initValueOptions = column.valueOptions;
  if (listInfo.listCode === 'TableList' && column.id === 'sortColumn') {
    initValueOptions = [{ value: value, label: '' }];
  }
  const [valueOptions, setValueOptions] = useState(initValueOptions);
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const options = [];
    const getGrindInfo = async () => {
      const result = await baseApi.getGridInfo(row.original.listCode, baseApi);
      result.data.cellInfo.map((cell) => {
        // No 가 아닌 것
        if (cell.cellType !== 'N') options.push({ value: cell.cellName, label: cell.cellHead });
      });
      setValueOptions(options);
    };
    if (column.cellType === 'o') getGrindInfo();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    let isMount = true;
    if (isMount) {
      let initValue = initialValue;
      // Date
      if (column.cellType === 'D')
        initValue = HsLib.reactRegisterDateRender(row, '$1-$2-$3', false);
      // Date ~ Date
      if (column.cellType === 'G') initValue = HsLib.reactRegisterDateRender(row, '$1-$2-$3', true);
      if (column.id === 'no' || listInfo.tableEditable === 'N') {
        if (column.type === 'select') {
          initValue = column.valueOptions.find((option) => {
            if (option.value === initValue) return option;
          })?.label;
        }
      }
      if (column.cellType === 'o') {
        initValue = valueOptions.length === 0 ? '' : row.original.sortColumn;
      }
      setValue(initValue);
    }
    return () => {
      isMount = false;
    };
  }, [initialValue, valueOptions]);

  const onChange = useCallback(
    (e) => {
      try {
        // Number(,)
        if (column.cellType === 'I') {
          let onlyNums = e.target.value.replace(/[^0-9]/g, '');
          onlyNums = onlyNums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          setValue(onlyNums);
          // Decimal(1)
        } else if (column.cellType === '1') {
          setValue(parseFloat(e.target.value).toFixed(1));
          // setValue(e.target.value);
          // Decimal(2)
        } else if (column.cellType === '2') {
          setValue(parseFloat(e.target.value).toFixed(2));
          // Decimal(3)
        } else if (column.cellType === '3') {
          setValue(parseFloat(e.target.value).toFixed(3));
          // Number
        } else if (column.cellType === 'M') {
          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
          setValue(onlyNums);
        } else {
          let value = e.target?.value;

          if (column.maxLength > 0) value = value.slice(0, column.maxLength);
          setValue(value);
        }
      } catch (ex) {
        setValue(e.target?.value);
      }
    },
    [setValue],
  );
  const onBlur = useCallback(() => {
    updateMyData(row, column.id, value);
  }, [updateMyData, value]);

  if (row.original.fitWidth === 'Y' && column.id === 'cellWidth') {
    return (
      <TextField
        className="CMM-rt-rowArea-editableCell-textField"
        value={initialValue || ''}
        color="secondary"
        focused
        disabled={column.id === 'no' || (column.editableYn === 'N' && row.original.status !== 'I')}
        InputProps={{
          readOnly: true,
        }}
        sx={{
          height: '100%',
          justifyContent: 'center',
          '& .MuiOutlinedInput-input': { py: 0.75, px: 1 },
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          input: { textAlign: column.rowAlign || 'left' },
        }}
      />
    );
  }
  // cellType === 'C'
  if (column.type === 'select') {
    return (
      <LabelInput
        className="CMM-rt-rowArea-editableCell-labelInput"
        sx={{
          '& .MuiOutlinedInput-input': { py: 0.75, px: 1, background: theme.palette.grey[0] },
          // '& .MuiOutlinedInput-notchedOutline': { border: 'none' },

          '& .Mui-readOnly, & .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.grey[400],
          },
          ...sx,
        }}
        type={column.type}
        size="small"
        defaultValue=""
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={column.editableYn === 'N' && row.original.status !== 'I'}
        list={valueOptions}
      />
    );
  }

  return (
    <TextField
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      size="small"
      className="ediInput CMM-rt-rowArea-editableCell-textField"
      disabled={column.id === 'no' || (column.editableYn === 'N' && row.original.status !== 'I')}
      inputProps={{ maxLength: column.maxLength > 0 ? column.maxLength : null }}
      sx={{
        height: '100%',
        justifyContent: 'center',
        '& .MuiOutlinedInput-input': {
          py: 0.75,
          px: 1,
          // backgroundColor: '#fff',
          backgroundColor:
            column.id === 'no' || (column.editableYn === 'N' && row.original.status !== 'I')
              ? theme.palette.grey[10]
              : theme.palette.grey[0],
          borderRadius: '4px',
          color: theme.palette.grey[900],
        },
        '& .Mui-readOnly, & .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: theme.palette.grey[400],
        },
        input: { textAlign: column.rowAlign || 'left' },
      }}
    />
  );
};

EditableCell.propTypes = {
  value: PropTypes.any,
  row: PropTypes.object,
  column: PropTypes.object,
  updateMyData: PropTypes.func,
  listInfo: PropTypes.object,
  sx: PropTypes.object,
};

export default EditableCell;
