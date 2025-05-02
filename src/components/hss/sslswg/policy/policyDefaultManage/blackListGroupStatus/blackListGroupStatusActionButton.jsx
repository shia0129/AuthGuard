import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/blackListGroupStatus';

function BlackListGroupStatusActionButton(props) {
  const { onSearchButtonClick, onEnabledButtonClick, onDisabledButtonClick } = props;

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.blackListGroupStatus);

  const inquiryClickButton = () => {
    if (parameterData.parameters.current.page === 0) {
      onSearchButtonClick(parameterData.parameters.current);
    }
    dispatch(setParameters({ page: 0 }));
  };

  return (
    <>
      <GridItem item directionHorizon="space-between">
        <ButtonSet
          type="custom"
          options={[
            {
              label: '활성화',
              callBack: onEnabledButtonClick,
              // color: 'success',
              variant: 'outlined',
            },
            {
              label: '비활성화',
              callBack: onDisabledButtonClick,
              // color: 'warning',
              variant: 'outlined',
            },
          ]}
        />
        <ButtonSet
          type="custom"
          options={[
            {
              label: '조회',
              callBack: () => inquiryClickButton(),
              // color: 'info',
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>
    </>
  );
}

export default BlackListGroupStatusActionButton;
