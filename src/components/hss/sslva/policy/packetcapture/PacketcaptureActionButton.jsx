import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
// import CertStatusModal from '@components/modal/hss/sslva/policy/certStatusModal';
// import { setParameters } from '@modules/redux/reducers/hss/sslva/certStatus';
import { setParameters } from '@modules/redux/reducers/hss/sslva/packetcaptureStatus';
import { ConsoleView } from 'react-device-detect';

function PacketcaptureActionButton(props) {
  // const { onSearchButtonClick, onDeleteButtonClick } = props;
  const { onStartButtonClick } = props;
  const dispatch = useDispatch();

  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalParams, setModalParams] = useState({ flag: '', id: '' });

  const parameterData = useSelector((state) => state.packetcaptureStatus);

  // const handleInsertButtonClick = () => {
  //   setModalParams({ flag: 'insert' });
  //   setModalOpen(true);
  // };

  const startClickButton = () => {
    // 입력값 검사.............
    // console.log(parameterData.parameters.current);
    onStartButtonClick(parameterData.parameters.current);
  };

  return (
    <>
      <GridItem item directionHorizon="end">
        <ButtonSet
          options={[
            {
              label: '시작',
              callBack: () => startClickButton(),
              color: 'primary',
              variant: 'contained',
            },
            // {
            //   label: '추가',
            //   callBack: handleInsertButtonClick,
            //   variant: 'outlined',
            // },
            // {
            //   label: '삭제',
            //   callBack: onDeleteButtonClick,
            //   variant: 'outlined',
            // },
          ]}
        />
      </GridItem>
      {/* {modalOpen && (
        <CertStatusModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          getCertStatusList={inquiryClickButton}
        />
      )} */}
    </>
  );
}

export default PacketcaptureActionButton;
