import { useEffect, useState, useRef } from 'react';
import { Select, MenuItem, ListItemText, FormControl } from '@mui/material';
import Label from '@components/modules/label/Label';

const itemStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: '12px',
  backgroundColor: '#007bff',
  color: 'white',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  whiteSpace: 'nowrap',
  lineHeight: '14px',
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultipleSelect = (props) => {
  const { required, label, name, dataList, onValueChange, initValue } = props;
  const [value, setValue] = useState([]);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (initValue) {
      setValue(initValue);
    }
  }, [initValue]);

  const handleChange = (event) => {
    const newSelectedOptions = event.target.value;
    setValue(newSelectedOptions);

    const selectedOptionsDetails = dataList.filter((option) =>
      newSelectedOptions.includes(option.id),
    );
    onValueChange(selectedOptionsDetails);
  };

  return (
    <Label required={required} label={label} labelBackgroundFlag>
      <FormControl fullWidth>
        <Select
          multiple
          MenuProps={MenuProps}
          name={name}
          value={value}
          onChange={handleChange}
          renderValue={(selected) =>
            selected.map((data) => {
              const item = dataList.find((option) => option.id === data);

              return (
                item && (
                  <span key={item.id} style={itemStyle}>
                    {item.name}
                  </span>
                )
              );
            })
          }
        >
          {dataList.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <ListItemText primary={option.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Label>
  );
};

export default MultipleSelect;
