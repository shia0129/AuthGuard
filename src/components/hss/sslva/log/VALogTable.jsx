import { useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import { AuthInstance } from '@modules/axios';
import { Link } from '@mui/material';

function VALogTable(props) {
  const { columns } = useSelector((state) => state.log);
  const { source } = AuthInstance();

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const value = props.value;

        return <>{value}</>;
      },
    }));
  const useEffect_0001 = useRef(false);
  useEffect(() => {
   if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <GridItem item>
      <HsReduxTable
        sx={{
          '.CMM-rt-tableArea-reactRow': {
            height: 'unset',
          },
          '.CMM-rt-headerArea-tableHead, .CMM-rt-headerArea-tableHead tr th, .CMM-rt-rowArea-tableCell':
          {
            padding: '0',
          },
          '.MuiStack-root': {
            flexWrap: 'wrap',
          },
          '.CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
            whiteSpace: 'normal',       // 문자열이 줄 바꿈될 수 있도록 
            wordWrap: 'break-word',     // 길이가 넘쳐도 줄바꿈을 하도록 설정
            wordBreak: 'break-word',    // 긴 단어도 잘리거나 줄바꿈되도록 설정
            overflow: 'visible',        // 오버플로우를 숨기지 않음
            textOverflow: 'clip',       // ...으로 잘리지 않도록
            pointerEvents: 'none',      // 마우스 이벤트를 차단해서 툴팁이 보이지 않도록 할 수 있음
          },
          '.CMM-rt-rowArea-tableCell, .CMM-rt-rowArea-tableCell div p': {
            lineHeight: '35px',
          },
        }}
        name="log"
        customColumn={makeColumns()}
      />
    </GridItem>
  );
}

export default VALogTable;
