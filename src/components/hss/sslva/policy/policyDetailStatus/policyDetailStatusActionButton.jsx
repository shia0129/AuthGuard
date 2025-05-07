import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
import PolicyDetailStatusModal from '@components/modal/hss/sslva/policy/policyDetailStatusModal';
import { setParameters } from '@modules/redux/reducers/hss/sslva/policyDetailStatus';

function PolicyDetailStatusActionButton(props) {
  const { onSearchButtonClick, onDeleteButtonClick, protocolList } = props;

  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalParams, setModalParams] = useState({ flag: '', id: '' });

  const parameterData = useSelector((state) => state.policyDetailStatus);

  const handleInsertButtonClick = () => {
    setModalParams({ flag: 'insert' });
    setModalOpen(true);
  };

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
          options={[
            {
              label: '추가',
              callBack: handleInsertButtonClick,
              color: 'success',
              variant: 'contained',
            },
            {
              label: '삭제',
              callBack: onDeleteButtonClick,
              color: 'secondary',
              variant: 'contained',
            },
          ]}
        />
        <ButtonSet
          options={[
            {
              label: '조회',
              callBack: () => inquiryClickButton(),
              color: 'primary',
              variant: 'contained',
            },
          ]}
        />
      </GridItem>
      {modalOpen && (
        <PolicyDetailStatusModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          getPolicyDetailStatusList={inquiryClickButton}
          protocolList={protocolList}
        />
      )}
    </>
  );
}

export default PolicyDetailStatusActionButton;
