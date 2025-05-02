// libraries
import { useState, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Typography, Stack, Button } from '@mui/material';
import { CloseCircleFilled } from '@ant-design/icons';
import { unstable_batchedUpdates } from 'react-dom';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import IconButton from '@components/@extended/IconButton';
import ObjectModal from '@components/modal/streaming/objectModal';
import PortModal from '@components/modal/streaming/portModal';
// functions
import { AuthInstance } from '@modules/axios';
import codeApi from '@api/system/codeApi';
import { isNull } from 'lodash';
function PolicyModal({ alertOpen, setModalOpen, modalParams, getList }) {
  // 파라미터
  const { flag, rowData } = modalParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      policyDirection: '',
      policyName: '',
      serviceMethod: '',
      destinationIP: '',
      destinationPort: '',
      departureIP: '',
      activationYN: '',
      systemGroup: '',
    },
  });
  // 수정팝업여부 상태값
  const [isUpdate, setIsUpdate] = useState(true);
  // 목적지IP 상태값
  const [destinationIPList, setDestinationIPList] = useState([]);
  // 목적지PORT 상태값
  const [destinationPortList, setDestinationPortList] = useState([]);
  // 출발지IP 상태값
  const [departureIPList, setDepartureIPList] = useState([]);
  // 객체팝업 오픈여부 상태값
  const [objectModalOpen, setObjectModalOpen] = useState(false);
  // 객체팝업 파라미터 상태값
  const [objectModalParams, setObjectModalParams] = useState({});
  // Port팝업 오픈여부 상태값
  const [portModalOpen, setPortModalOpen] = useState(false);
  // Port팝업 파라미터 상태값
  const [portModalParams, setPortModalParams] = useState({});
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    // 초기화
    init();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, []);
  // 초기화
  const init = () => {
    // 변경모드 세팅
    if (flag === 'update') {
      getDetails();
    }
  };
  // 선택된 상세값 출력
  const getDetails = async () => {
    // const result = await apiCall(codeApi.getDetails, id);
    // if (result.status === 200) {
    //   for (const key in result.data) {
    //     methods.setValue(key, result.data[`${key}`]);
    //   }
    // }
    for (const key in rowData) {
      if (key !== 'destinationIP' && key !== 'destinationPort' && key !== 'departureIP') {
        if (!isNull(rowData[`${key}`])) {
          methods.setValue(key, rowData[`${key}`]);
        }
      }
    }
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      setDestinationIPList(rowData.destinationIP);
      setDestinationPortList(rowData.destinationPort);
      setDepartureIPList(rowData.departureIP);
      setIsUpdate(true);
    });
  };

  // 신규 데이터 저장
  const insertData = async (data) => {
    const requestDate = { ...data, destinationIPList, destinationPortList, departureIPList };
    console.log(requestDate);

    // const result = await apiCall(codeApi.insertData, { ...data });
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 등록되었습니다.';
    //   else message = '코드정보 등록에 실패하였습니다.';
    //   openModal({
    //     message,
    //     close: false,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getList();
    //     },
    //   });
    // }
    // setIsUpdate(false);
  };
  // 변경 데이터 저장
  const updateData = async (data) => {
    const requestDate = { ...data, destinationIPList, destinationPortList, departureIPList };
    console.log(requestDate);

    // const result = await apiCall(codeApi.updateData, data);
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 수정되었습니다.';
    //   else message = '코드정보 수정에 실패하였습니다.';
    //   openModal({
    //     message,
    //     close: false,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getList();
    //     },
    //   });
    // }
  };
  // 목적지IP 엔터 이벤트
  const handleKeyDownDestinationIP = (keyEvent) => {
    if (keyEvent.code == 'Enter' && !destinationIPList.includes(keyEvent.target.value)) {
      if (destinationIPList && keyEvent.target.value !== undefined) {
        setDestinationIPList((prev) => [...prev, keyEvent.target.value]);
      }
    }
  };
  // 목적지IP 클릭 이벤트
  const handleClickDestinationIP = (flag, item) => {
    setObjectModalParams({ flag: flag, id: item });
    setObjectModalOpen(true);
  };
  // 목적지IP 삭제 이벤트
  const handleDeleteDestinationIP = (item) => {
    const filteredItems =
      destinationIPList && destinationIPList.filter((_destinationIP) => _destinationIP !== item);
    setDestinationIPList(filteredItems);
  };

  // 목적지Port 엔터 이벤트
  const handleKeyDownDestinationPort = (keyEvent) => {
    if (keyEvent.code == 'Enter' && !destinationPortList.includes(keyEvent.target.value)) {
      if (destinationPortList && keyEvent.target.value !== undefined) {
        setDestinationPortList((prev) => [...prev, keyEvent.target.value]);
      }
    }
  };
  // 목적지Port 클릭 이벤트
  const handleClickDestinationPort = (item) => {
    console.log('목적지Port 클릭');
    setPortModalParams({ flag: flag, id: item });
    setPortModalOpen(true);
  };
  // 목적지Port 삭제 이벤트
  const handleDeleteDestinationPort = (item) => {
    const filteredItems =
      destinationPortList &&
      destinationPortList.filter((_destinationPort) => _destinationPort !== item);
    setDestinationPortList(filteredItems);
  };

  // 출발지IP 엔터 이벤트
  const handleKeyDownDepartureIP = (keyEvent) => {
    if (keyEvent.code == 'Enter' && !departureIPList.includes(keyEvent.target.value)) {
      if (departureIPList && keyEvent.target.value !== undefined) {
        setDepartureIPList((prev) => [...prev, keyEvent.target.value]);
      }
    }
  };
  // 출발지IP 클릭 이벤트
  const handleClickDepartureIP = (item) => {
    // console.log('출발지IP 클릭');
    setObjectModalParams({ flag: flag, id: item });
    setObjectModalOpen(true);
  };
  // 출발지IP 삭제 이벤트
  const handleDeleteDepartureIP = (item) => {
    const filteredItems =
      departureIPList && departureIPList.filter((_departureIP) => _departureIP !== item);
    setDepartureIPList(filteredItems);
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="md"
        fullWidth
        callBack={methods.handleSubmit(flag === 'insert' ? insertData : updateData)}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title="스트리밍 정책 상세"
        // title={`스트리밍 정책 ${flag === 'insert' ? '작성' : '수정'}`}
      >
        <FormProvider {...methods}>
          <form id="policyModal">
            <Typography variant="h5">기본 정보</Typography>
            <GridItem
              container
              direction="row"
              divideColumn={3}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': {
                  maxWidth: '150px',
                  minWidth: '150px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              <LabelInput
                type="select"
                label="정책방향"
                name="policyDirection"
                list={[
                  { value: 'IN', label: 'IN-BOUND' },
                  { value: 'OUT', label: 'OUT-BOUND' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="정책명"
                name="policyName"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="설명"
                name="description"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                type="select"
                label="서비스 매소드"
                name="serviceMethod"
                list={[
                  { value: 'SNMP', label: 'SNMP' },
                  { value: 'ICMP', label: 'ICMP' },
                  { value: 'AH', label: 'AH' },
                  { value: 'ESP', label: 'ESP' },
                  { value: 'FTP', label: 'FTP' },
                  { value: 'SFTP', label: 'SFTP' },
                  { value: 'HTTP', label: 'HTTP' },
                  { value: 'HTTPS', label: 'HTTPS' },
                  { value: 'RTSP', label: 'RTSP' },
                  { value: 'nICMP', label: 'nICMP' },
                  { value: 'nDNS', label: 'nDNS' },
                  { value: 'nAH', label: 'nAH' },
                  { value: 'nESP', label: 'nESP' },
                  { value: 'nFTP', label: 'nFTP' },
                  { value: 'nSFTP', label: 'nSFTP' },
                  { value: 'nHTTP', label: 'nHTTP' },
                  { value: 'nHTTPS', label: 'nHTTPS' },
                  { value: 'nRTSP', label: 'nRTSP' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="시스템그룹"
                name="systemGroup"
                list={[{ value: 'AuthGuard', label: 'AuthGuard' }]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="가상출발지IP"
                name="virtualDepartureIP"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
            </GridItem>
            <Typography
              variant="h5"
              sx={{
                mt: '14px',
              }}
            >
              객체 정보
            </Typography>
            <GridItem
              container
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': { maxWidth: '300px', minWidth: '300px' },
              }}
            >
              <LabelInput
                requiredMask
                label="목적지IP"
                name="destinationIP"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
                onKeyDown={(e) => handleKeyDownDestinationIP(e)}
              />
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                flexWrap="wrap"
                sx={{
                  padding: '6px',
                }}
              >
                {destinationIPList.map((item, index) => (
                  <Stack key={index} direction="row">
                    <Button
                      key={index}
                      variant="contained"
                      onClick={() => handleClickDestinationIP('update', item)}
                      sx={{
                        maxHeight: '22px',
                        minWidth: '100px',
                        backgroundColor: '#00BCD4',
                        marginBottom: '4px',
                        marginLeft: '4px',
                      }}
                    >
                      {item}
                    </Button>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteDestinationIP(item)}
                      sx={{
                        maxHeight: '22px',
                      }}
                    >
                      <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <LabelInput
                requiredMask
                label="목적지Port"
                name="destinationPort"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
                onKeyDown={(e) => handleKeyDownDestinationPort(e)}
              />
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                flexWrap="wrap"
                sx={{
                  padding: '6px',
                }}
              >
                {destinationPortList.map((item, index) => (
                  <Stack key={index} direction="row">
                    <Button
                      key={index}
                      variant="contained"
                      onClick={() => handleClickDestinationPort(item)}
                      sx={{
                        maxHeight: '22px',
                        minWidth: '100px',
                        backgroundColor: '#5C6BC0',
                        marginBottom: '4px',
                        marginLeft: '4px',
                      }}
                    >
                      {item}
                    </Button>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteDestinationPort(item)}
                      sx={{
                        maxHeight: '22px',
                      }}
                    >
                      <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <LabelInput
                requiredMask
                label="출발지IP"
                name="departureIP"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
                onKeyDown={(e) => handleKeyDownDepartureIP(e)}
              />
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                flexWrap="wrap"
                sx={{
                  padding: '6px',
                }}
              >
                {departureIPList.map((item, index) => (
                  <Stack key={index} direction="row">
                    <Button
                      key={index}
                      variant="contained"
                      onClick={() => handleClickDepartureIP(item)}
                      sx={{
                        maxHeight: '22px',
                        minWidth: '100px',
                        backgroundColor: '#BA68C8',
                        marginBottom: '4px',
                        marginLeft: '4px',
                      }}
                    >
                      {item}
                    </Button>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteDepartureIP(item)}
                      sx={{
                        maxHeight: '22px',
                      }}
                    >
                      <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {objectModalOpen && (
        <ObjectModal
          alertOpen={objectModalOpen}
          setModalOpen={setObjectModalOpen}
          modalParams={objectModalParams}
        />
      )}
      {portModalOpen && (
        <PortModal
          alertOpen={portModalOpen}
          setModalOpen={setPortModalOpen}
          modalParams={portModalParams}
        />
      )}

      {/* {console.log('정책상세 화면로딩... ')} */}
    </>
  );
}

PolicyModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyModal;
