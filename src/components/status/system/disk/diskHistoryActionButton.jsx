import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import { setParameters } from '@modules/redux/reducers/diskHis';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

function DiskHistoryActionButton({ onSearchButtonClick }) {
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.diskHis);

  const inquiryClickButton = () => {
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
          ]}
        />
      </Stack>
    </GridItem>
  );
}

export default DiskHistoryActionButton;
