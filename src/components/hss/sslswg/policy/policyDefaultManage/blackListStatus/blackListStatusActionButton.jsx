import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/blackListStatus';
import { useRouter } from 'next/router';

function BlackListStatusActionButton(props) {
  const { onSearchButtonClick, onEnabledButtonClick, onDisabledButtonClick } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const parameterData = useSelector((state) => state.blackListStatus);

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
            {
              label: '취소',
              callBack: () => router.back(),
              // color: 'error',
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>
    </>
  );
}

export default BlackListStatusActionButton;
