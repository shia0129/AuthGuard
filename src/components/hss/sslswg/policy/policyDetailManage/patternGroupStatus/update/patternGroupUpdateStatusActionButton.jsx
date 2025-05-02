import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/pattern/patternGroupUpdateStatus';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PatternGroupUpdateStatusModal from '@components/modal/hss/sslswg/policy/patternGroupUpdateStatusModal';

function PatternGroupUpdateStatusActionButton(props) {
  const { onSearchButtonClick } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const parameterData = useSelector((state) => state.patternGroupUpdateStatus);
  const parameters = parameterData.parameters.current;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalParams, setModalParams] = useState({ flag: '', id: '' });

  const inquiryClickButton = () => {
    if (parameters.page === 0) {
      onSearchButtonClick(parameters);
    }
    dispatch(setParameters({ page: 0 }));
  };

  const handleInsertButtonClick = () => {
    setModalParams({ flag: 'insert', id: parameters.id });
    setModalOpen(true);
  };

  return (
    <>
      <GridItem item directionHorizon="end">
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
              label: '설정',
              callBack: handleInsertButtonClick,
              variant: 'outlined',
            },
            {
              label: '취소',
              callBack: () => {
                router.push({
                  pathname: '/hss/sslswgManage/policyDetailManage/patternManage',
                  query: { tab: 'patternGroupStatus' },
                });
              },
              // color: 'error',
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>
      {modalOpen && (
        <PatternGroupUpdateStatusModal
          open={modalOpen}
          close={setModalOpen}
          modalParams={modalParams}
          getStatusList={inquiryClickButton}
        />
      )}
    </>
  );
}

export default PatternGroupUpdateStatusActionButton;
