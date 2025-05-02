import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import { setParameters } from '@modules/redux/reducers/messageFilterHis';
import { useDispatch, useSelector } from 'react-redux';

function MessageFilterHistoryActionButton({ onSearchButtonClick, onExcelButtonClick }) {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.messageFilterHis);

  const inquiryClickButton = () => {
    if (parameterData.parameters.current.page === 0) {
      onSearchButtonClick(parameterData.parameters.current);
    }
    dispatch(setParameters({ page: 0 }));
  };

  return (
    <GridItem item directionHorizon="end">
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
        ]}
      />
    </GridItem>
  );
}

export default MessageFilterHistoryActionButton;
