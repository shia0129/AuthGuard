import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
import { setParameters } from '@modules/redux/reducers/adminAccess';

function AdminAccessActionButton({ onSearchButtonClick, onExcelButtonClick }) {
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.adminAccess);

  const inquiryClickButton = () => {
    if (parameterData.parameters.current.page === 0) {
      onSearchButtonClick(parameterData.parameters.current);
    }
    dispatch(setParameters({ page: 0 }));
  };

  return (
    <GridItem item directionHorizon="end">
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
              variant: 'outlined',
              callBack: onExcelButtonClick,
            },
          ]}
        />
      </Stack>
    </GridItem>
  );
}

export default AdminAccessActionButton;
