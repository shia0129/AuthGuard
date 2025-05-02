import GridItem from '@components/modules/grid/GridItem';
import { Button, Stack } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import LoadingButton from '@components/modules/button/LoadingButton';

function ListComponent({ data, list = [] }) {
  const [matchesArray, setMatchesArray] = useState([]);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const dataArray = data ?? [];
    if (list.length === 0 || dataArray.length === 0) return;

    // list 데이터를 미리 매핑하여, id를 key로 하는 맵을 생성하여 중복된 조회를 피함.
    const listMap = new Map(list.map((item) => [item.id, { id: item.id, name: item.name }]));

    // dataArray를 순회하면서 listMap에서 일치하는 값을 찾아서 matchesArray에 저장.
    const newMatchesArray = dataArray
      .map((id) => listMap.get(id)) // listMap에서 id에 해당하는 프로토콜 찾기
      .filter(Boolean); // null 값 제거 (list에 존재하지 않는 id는 null)

    setMatchesArray(newMatchesArray);
  }, []);

  if (matchesArray.length === 0) {
    return (
      <LoadingButton loadingPosition="center" loading />
    );
  }

  return (
    <GridItem container divide={2}>
      {matchesArray.map((item) => (
        <Stack key={item.id} direction="row" spacing={0.1} sx={{ padding: '5px' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: '#63a3c6',
              maxHeight: '25px',
              pointerEvents: 'none', // 클릭 방지
              textTransform: 'none', // 대문자 변환 방지
            }}
          >
            {item.name}
          </Button>
        </Stack>
      ))}
    </GridItem>
  );
}

export default ListComponent;
