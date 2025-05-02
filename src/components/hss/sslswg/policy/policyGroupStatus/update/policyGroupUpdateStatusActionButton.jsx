import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/policyGroupUpdateStatus';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PolicyDetailUpdateStatusModal from '@components/modal/hss/sslswg/policy/policyDetailUpdateStatusModal';

function PolicyGroupUpdateStatusActionButton(props) {
  const { onSearchButtonClick } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const parameterData = useSelector((state) => state.swgPolicyGroupUpdateStatus);
  const parameters = parameterData.parameters.current;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalParams, setModalParams] = useState({ flag: '', id: '', type: '' });

  const inquiryClickButton = () => {
    if (parameters.page === 0) {
      onSearchButtonClick(parameters);
    }
    dispatch(setParameters({ page: 0 }));
  };

  const handleInsertButtonClick = (label) => {
    setModalParams({ flag: 'insert', id: parameters.id, type: label });
    setModalOpen(true);
  };

  return (
    <>
      <GridItem item directionHorizon="space-between">
        <ButtonSet
          type="custom"
          options={[
            {
              label: '사이트 설정',
              callBack: () => handleInsertButtonClick('site'),
              variant: 'outlined',
            },
            {
              label: '패턴 설정',
              callBack: () => handleInsertButtonClick('pattern'),
              variant: 'outlined',
            },
            {
              label: '출발지IP 설정',
              callBack: () => handleInsertButtonClick('srcip'),
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
            // {
            //   label: '설정',
            //   callBack: handleInsertButtonClick,
            //   variant: 'outlined',
            // },
            {
              label: '취소',
              callBack: () => {
                router.push({
                  pathname: '/hss/sslswgManage/policyGroupManage',
                });
              },
              // color: 'error',
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>
      {modalOpen && (
        <PolicyDetailUpdateStatusModal
          open={modalOpen}
          close={setModalOpen}
          modalParams={modalParams}
          getStatusList={inquiryClickButton}
        />
      )}
    </>
  );
}

export default PolicyGroupUpdateStatusActionButton;
