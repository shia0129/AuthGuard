import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
import PolicyGroupStatusModal from '@components/modal/hss/sslva/policy/policyGroupStatusModal';
import { setParameters } from '@modules/redux/reducers/hss/sslva/policyGroupStatus';
import useApi from '@modules/hooks/useApi';

function PolicyGroupStatusActionButton(props) {
  const { onSearchButtonClick, onDeleteButtonClick } = props;

  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalParams, setModalParams] = useState({ flag: '', id: '' });

  const [_, openModal] = useApi();

  const parameterData = useSelector((state) => state.vaPolicyGroupStatus);

  const handleInsertButtonClick = () => {
    const total = parameterData.totalElements;
    if (total >= 1) {
      openModal({
        message: '정책 그룹 정보는 1개만 등록하실 수 있습니다.',
      });
    } else {
      setModalParams({ flag: 'insert' });
      setModalOpen(true);
    }
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
        <PolicyGroupStatusModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          getPolicyGroupStatusList={inquiryClickButton}
        />
      )}
    </>
  );
}

export default PolicyGroupStatusActionButton;
