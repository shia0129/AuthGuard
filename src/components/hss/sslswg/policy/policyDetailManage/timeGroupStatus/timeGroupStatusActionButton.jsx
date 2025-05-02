import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
import { useState } from 'react';
import TimeGroupStatusModal from '@components/modal/hss/sslswg/policy/timeGroupStatusModal';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/time/timeGroupStatus';

function TimeGroupStatusActionButton(props) {
  const { onSearchButtonClick, onDeleteButtonClick } = props;

  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const parameterData = useSelector((state) => state.timeGroupStatus);

  const handleInsertButtonClick = () => {
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
      <GridItem item directionHorizon="end">
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <ButtonSet
            type="custom"
            options={[
              {
                label: '조회',
                callBack: () => inquiryClickButton(),
                variant: 'outlined',
              },
              {
                label: '추가',
                callBack: handleInsertButtonClick,
                variant: 'outlined',
              },
              {
                label: '삭제',
                callBack: onDeleteButtonClick,
                variant: 'outlined',
              },
            ]}
          />
        </Stack>
      </GridItem>
      {modalOpen && (
        <TimeGroupStatusModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          getTimeGroupStatusList={inquiryClickButton}
        />
      )}
    </>
  );
}

export default TimeGroupStatusActionButton;
