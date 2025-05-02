import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import { useSelector } from 'react-redux';

function AdminBlockActionButton({ onSearchButtonClick, onExcelButtonClick }) {
  const parameterData = useSelector((state) => state.adminAccess);
  return (
    <GridItem item directionHorizon="end">
      <ButtonSet
        type="custom"
        options={[
          {
            label: '조회',
            variant: 'outlined',
            callBack: () => onSearchButtonClick(parameterData.parameters.current),
          },
          {
            label: '엑셀',
            variant: 'outlined',
            callBack: onExcelButtonClick,
          },
        ]}
      />
    </GridItem>
  );
}

export default AdminBlockActionButton;
