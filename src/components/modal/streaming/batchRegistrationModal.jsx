// libraries
import { useState, useEffect ,useRef} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { unstable_batchedUpdates } from 'react-dom';
import { Typography, Divider } from '@mui/material';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
// functions
import { AuthInstance } from '@modules/axios';
import codeApi from '@api/system/codeApi';
import { isNull } from 'lodash';
function BatchRegistrationModal({ alertOpen, setModalOpen, modalParams, getCodeList }) {
  // 파라미터
  const { flag, id } = modalParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      location: '',
      objectName: '',
      division: '',
      ipBandwidth: '',
      ipAddress: '',
      dnatIP: '',
      dnatPort: '',
      description: '',
    },
  });
  // 수정팝업여부 상태값
  const [isUpdate, setIsUpdate] = useState(true);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
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
    // if (flag === 'update') {
    getDetails();
    // }
  };
  // 선택된 상세값 출력
  const getDetails = async () => {
    // const result = await apiCall(codeApi.getDetails, id);
    // if (result.status === 200) {
    //   for (const key in result.data) {
    //     methods.setValue(key, result.data[`${key}`]);
    //   }
    // }
    const detailData_01 = {
      system: '1',
      destinationIP: '',
      destinationPortFrom: '',
      destinationPortTo: '',
      ipCheckLength: '32',
      destinationClassification: '1',
      serviceMethod: '',
      portDescription: '',
      logRecordYN: '1',
      checkTime: '0',
      monitoringYN: '1',
      allowance: '0',
      measurementTime: '0',
      limitTime: '0',
      sessionEndTime: '0',

      departureIP: '',
      departureIPInspectionLength: '32',
      departureMacAddress: '',
      workday: '1',
      workStartTime: '',
      workEndTime: '24',
      description: '',
    };

    for (const key in detailData_01) {
      if (!isNull(detailData_01[`${key}`])) {
        methods.setValue(key, detailData_01[`${key}`]);
      }
    }
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      setIsUpdate(true);
    });
  };

  // 신규 데이터 저장
  const insertData = async (data) => {
    // const result = await apiCall(codeApi.insertData, { ...data });
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 등록되었습니다.';
    //   else message = '코드정보 등록에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getCodeList();
    //     },
    //   });
    // }
    // setIsUpdate(false);
  };
  // 변경 데이터 저장
  const updateData = async (data) => {
    // const result = await apiCall(codeApi.updateData, data);
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 수정되었습니다.';
    //   else message = '코드정보 수정에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getCodeList();
    //     },
    //   });
    // }
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
        title="목적지 IP, Port 일괄등록"
      >
        <FormProvider {...methods}>
          <form id="batchRegistrationModal">
            <Typography variant="h5">목적지 정책 정보</Typography>
            <GridItem
              container
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
              }}
            >
              <LabelInput
                type="select"
                label="시스템"
                name="system"
                list={[
                  { value: '1', label: '외부시스템01' },
                  { value: '2', label: '내부시스템01' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="목적지 IP"
                name="destinationIP"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="목적지 Port (Form)"
                name="destinationPortFrom"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="목적지 Port (To)"
                name="destinationPortTo"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="IP Check Length"
                name="ipCheckLength"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                type="select"
                label="목적지 구분"
                name="destinationClassification"
                list={[
                  { value: '1', label: '업무망' },
                  { value: '2', label: '인터넷망' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                type="select"
                label="Service Method"
                name="serviceMethod"
                list={[
                  { value: '1', label: 'SNMP' },
                  { value: '2', label: 'ICMP' },
                  { value: '3', label: 'AH' },
                  { value: '4', label: 'ESP' },
                  { value: '5', label: 'FTP' },
                  { value: '6', label: 'SFTP' },
                  { value: '7', label: 'HTTP' },
                  { value: '8', label: 'HTTPS' },
                  { value: '9', label: 'RTSP' },
                  { value: '10', label: 'nICMP' },
                  { value: '11', label: 'nDNS' },
                  { value: '12', label: 'nAH' },
                  { value: '13', label: 'nESP' },
                  { value: '14', label: 'nFTP' },
                  { value: '15', label: 'nSFTP' },
                  { value: '16', label: 'nHTTP' },
                  { value: '17', label: 'nHTTPS' },
                  { value: '18', label: 'nRTSP' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="포트 사용 설명"
                name="portDescription"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                type="select"
                label="Log 기록여부"
                name="logRecordYN"
                list={[
                  { value: '1', label: 'DB 기록' },
                  { value: '2', label: 'File 기록' },
                  { value: '3', label: 'Log 기록' },
                  { value: '4', label: 'TEXT 기록' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="Rx/Tx check Time (Sec)"
                name="checkTime"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                type="select"
                label="모니터링 여부"
                name="monitoringYN"
                list={[
                  { value: 'Y', label: '감시' },
                  { value: 'N', label: '미감시' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="허용량 (Byte)"
                name="allowance"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="측정시간 (Sec)"
                name="measurementTime"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="제한시간 (Sec)"
                name="limitTime"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="세션종료 (Sec)"
                name="sessionEndTime"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
            </GridItem>
            <Divider
              sx={{
                mt: 2,
                borderStyle: 'dashed',
                borderTopWidth: '1px',
                borderBottomWidth: '1px',
              }}
            />
            <Typography
              variant="h5"
              sx={{
                mt: '17px',
              }}
            >
              출발지 정책 정보
            </Typography>
            <GridItem
              container
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
              }}
            >
              <LabelInput
                required
                label="출발지 IP"
                name="departureIP"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
                maskOptions={{ type: 'ipv4' }}
              />
              <LabelInput
                required
                label="출발지IP 검사길이"
                name="departureIPInspectionLength"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="출발지 Mac Address"
                name="departureMacAddress"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
                maskOptions={{ type: 'mac' }}
              />
              <LabelInput
                type="select"
                label="작업요일"
                name="workday"
                list={[
                  { value: '1', label: '매일' },
                  { value: '2', label: '기간설정' },
                ]}
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="작업시작"
                name="workStartTime"
                type="time1"
                views={['hours', 'minutes', 'seconds']}
                inputFormat="HH:mm:ss"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="작업종료"
                type="time1"
                name="workEndTime"
                views={['hours', 'minutes', 'seconds']}
                inputFormat="HH:mm:ss"
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
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('목적지 IP, Port 일괄등록" 화면로딩... ')} */}
    </>
  );
}

BatchRegistrationModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BatchRegistrationModal;
