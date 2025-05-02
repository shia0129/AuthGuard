import { useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { Stack } from '@mui/material';
import ButtonSet from '@components/modules/button/ButtonSet';

function BlockActionButton({ onSearchButtonClick }) {
  const parameterData = useSelector((state) => state.transBlock);

  return (
    <GridItem item directionHorizon="end" spacing={1.3}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <ButtonSet
          type="search"
          options={[
            {
              label: '조회',
              callBack: () => onSearchButtonClick(parameterData.parameters.current),
              variant: 'outlined',
            },
            {
              label: '엑셀',
              variant: 'outlined',
            },
            {
              label: 'PDF',
              variant: 'outlined',
            },
          ]}
        />
      </Stack>
    </GridItem>
  );
}

export default BlockActionButton;
