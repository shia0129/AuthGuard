import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
import { setParameters } from '@modules/redux/reducers/transHistory';

function TransmissionActionButton({ onSearchButtonClick, onExcelButtonClick, onPdfButtonClick }) {
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.transHistory);

  const inquiryClickButton = () => {
    // 조회 버튼을 클릭할 경우 0 페이지로 조회를 하도록 함.
    // 따라서 page 설정을 변경할 경우 부모 컴포넌트의 useEffect로 조회 처리가 되지만
    // 이미 설정된 페이지 번호가 0 페이지일 경우 useEffect가 동작하지 않기 때문에 직접 조회처리를 함
    // 향후 조회를 위한 action event를 정리할 필요가 있음
    if (parameterData.parameters.current.page === 0) {
      onSearchButtonClick(parameterData.parameters.current);
    }
    dispatch(setParameters({ page: 0 }));
  };

  return (
    <GridItem item directionHorizon="end" spacing={1.3}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <ButtonSet
          type="custom"
          options={[
            {
              label: '조회',
              callBack: inquiryClickButton,
              variant: 'outlined',
            },
            {
              label: '엑셀',
              callBack: onExcelButtonClick,
              variant: 'outlined',
            },
            {
              label: 'PDF',
              callBack: onPdfButtonClick,
              variant: 'outlined',
            },
          ]}
        />
      </Stack>
    </GridItem>
  );
}

export default TransmissionActionButton;
