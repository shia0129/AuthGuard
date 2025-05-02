import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setParameters } from '@modules/redux/reducers/hss/common/cpuMemory';

function CpuMemoryActionButton({ onSearchButtonClick }) {
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.cpuMemory);

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

export default CpuMemoryActionButton;
