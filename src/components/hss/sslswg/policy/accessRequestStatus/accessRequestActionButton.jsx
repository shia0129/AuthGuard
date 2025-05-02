import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
// import { useState } from 'react';
// import AccessRequestModal from '@components/modal/hss/common/accountManage/accessRequestModal';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/accessRequestStatus';

function AccessRequestActionButton(props) {
  const { onSearchButtonClick, onAllowClick, onRejectClick, tableName } = props;

  const dispatch = useDispatch();

  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalParams, setModalParams] = useState({ flag: '', id: '' });

  const parameterData = useSelector((state) => state.accessRequestStatus[tableName]);

  const handleInsertButtonClick = () => {
    // setModalParams({ flag: 'insert' });
    // setModalOpen(true);
  };

  const inquiryClickButton = () => {
    if (parameterData.parameters.current.page === 0) {
      onSearchButtonClick(parameterData.parameters.current);
    }
    dispatch(
      setParameters({
        tab: tableName,
        data: { page: 0 },
      }),
    );
  };

  return (
    <>
      <GridItem item directionHorizon="space-between">
        <ButtonSet
          type="custom"
          options={[
            {
              label: '일괄 허용',
              callBack: onAllowClick,
              // color: 'success',
              variant: 'outlined',
            },
            {
              label: '일괄 반려',
              callBack: onRejectClick,
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
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>
      {/* {modalOpen && (
        <AccessRequestModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          getAccessRequestList={inquiryClickButton}
        />
      )} */}
    </>
  );
}

export default AccessRequestActionButton;
