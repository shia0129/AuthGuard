// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import PopUp from '@components/modules/common/PopUp';
import { FormProvider, useForm } from 'react-hook-form';
// functions
import codeApi from '@api/system/codeApi';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import { useEffect, useState ,useRef} from 'react';
import portInfoManageApi from '@api/systemComposition/portInfoManageApi';
import { Typography } from '@mui/material';

function PortInfoInsertModal({
  alertOpen,
  setModalOpen,
  columns,
  oriData,
  updateFlag,
  searchData,
  getPortInfoList,
}) {
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  portInfoManageApi.axios = instance;

  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();

  // 콤보 데이터
  const [systemSeqData, setSystemSeqData] = useState([]);
  const [serviceModeData, setServiceModeData] = useState([]);
  const [serviceTypeData, setServiceTypeData] = useState([]);
  const [jobWeekData, setJobWeekData] = useState([]);
  const [jobTypeData, setJobTypeData] = useState([]);
  const [jobConfirmTypeData, setJobConfirmTypeData] = useState([]);
  const [logRecordTypeData, setLogRecordTypeData] = useState([]);
  const [monitoringYnData, setMonitoringYnData] = useState([]);

  const methods = useForm({
    defaultValues: {
      systemSeq: '',
      inPort: '',
      servicePortDesc: '',
      serviceMode: '',
      inIp: '',
      inIpLength: '',
      outIp: '',
      outPort: '',
      serviceType: '',
      jobWeek: '',
      jobStartTime: '',
      jobEndTime: '',
      jobType: '',
      jobConfirmType: '',
      logRecordType: '',
      timeout: '',
      monitoringYn: '',
    },
  });

  // columns 에 accessor 검색해서 valueOptions 꺼내넣기
  const init = (columns) => {
    let value = '';

    columns?.map((item) => {
      if (item.accessor === 'systemSeq') {
        value = item.valueOptions;
        setSystemSeqData(value);
      } else if (item.accessor === 'serviceMode') {
        value = item.valueOptions;
        setServiceModeData(value);
      } else if (item.accessor === 'jobWeek') {
        value = item.valueOptions;
        setJobWeekData(value);
      } else if (item.accessor === 'serviceType') {
        value = item.valueOptions;
        setServiceTypeData(value);
      } else if (item.accessor === 'jobType') {
        value = item.valueOptions;
        setJobTypeData(value);
      } else if (item.accessor === 'jobConfirmType') {
        value = item.valueOptions;
        setJobConfirmTypeData(value);
      } else if (item.accessor === 'logRecordType') {
        value = item.valueOptions;
        setLogRecordTypeData(value);
      } else if (item.accessor === 'monitoringYn') {
        value = item.valueOptions;
        setMonitoringYnData(value);
      }
    });

    // 수정상태일 경우에만 데이터 넣어주기
    if (updateFlag) {
      const filterData = oriData.filter((data) => data.id === searchData);

      for (const key in filterData[0]) {
        if (filterData[0][`${key}`] === null) {
          methods.setValue(key, '');
        } else {
          methods.setValue(key, filterData[0][`${key}`]);
        }
      }
    }
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init(columns);
  }, []);

  const doSave = async (data) => {
    if (updateFlag) {
      data['status'] = 'U';
    } else {
      data['status'] = 'I';
    }

    let result = '';

    if (oriData.length === 0) {
      // 기존데이터가 없고 신규등록할 경우
      result = await apiCall(portInfoManageApi.savePortInfoList, [data]);
    } else {
      // 기존데이터가 있는데
      if (updateFlag) {
        // 수정인경우 기존동일데이터는 지워주기
        const filterData = oriData.filter((data) => data.id !== searchData);
        result = await apiCall(portInfoManageApi.savePortInfoList, [...filterData, data]);
      } else {
        result = await apiCall(portInfoManageApi.savePortInfoList, [...oriData, data]);
      }
    }

    let message;
    if (result.status === 200) {
      if (result.data > 0) {
        message = '저장되었습니다.';
      }
      openModal({
        message,
        onConfirm: () => {
          setModalOpen(false);
          getPortInfoList();
        },
      });
    }
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      callBack={methods.handleSubmit(doSave)}
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      title={`포트정보 추가`}
    >
      <Typography variant="h5" sx={{ color: 'red', mb: 1 }}>
        * IP는 000.000.000.000 형식으로 입력
      </Typography>
      <FormProvider {...methods}>
        <form id="portInfo" onSubmit={methods.handleSubmit(doSave)}>
          <GridItem
            container
            item
            divideColumn={3}
            borderFlag
            sx={{
              '& .text': { maxWidth: '155px', minWidth: '155px' },
              '.inputBox': { width: '100%' },
            }}
          >
            <LabelInput
              required
              type="select"
              label="시스템"
              name="systemSeq"
              list={systemSeqData}
              labelBackgroundFlag
            />

            <LabelInput required label="Incomming Port" name="inPort" labelBackgroundFlag />
            <LabelInput required label="포트설명" name="servicePortDesc" labelBackgroundFlag />
            <LabelInput
              required
              type="select"
              name="serviceMode"
              label="서비스처리"
              list={serviceModeData}
              labelBackgroundFlag
            />
            <LabelInput required label="Incomming IP" name="inIp" labelBackgroundFlag />
            <LabelInput
              required
              label="Incomming IP 검사길이"
              name="inIpLength"
              labelBackgroundFlag
            />
            <LabelInput label="Outgoing IP" name="outIp" labelBackgroundFlag />
            <LabelInput label="Outgoing Port" name="outPort" labelBackgroundFlag />
            <LabelInput
              required
              label="서비스구분"
              type="select"
              name="serviceType"
              list={serviceTypeData}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="작업요일"
              name="jobWeek"
              list={jobWeekData}
              labelBackgroundFlag
            />
            <LabelInput label="작업시작시간" name="jobStartTime" labelBackgroundFlag />
            <LabelInput label="작업종료시간" name="jobEndTime" labelBackgroundFlag />
            <LabelInput
              required
              type="select"
              label="작업진행구분"
              name="jobType"
              list={jobTypeData}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="작업승인구분"
              name="jobConfirmType"
              list={jobConfirmTypeData}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="Log기록여부"
              name="logRecordType"
              list={logRecordTypeData}
              labelBackgroundFlag
            />
            <LabelInput required label="Timeout" name="timeout" labelBackgroundFlag />
            <LabelInput
              required
              type="select"
              label="모니터링 여부"
              name="monitoringYn"
              list={monitoringYnData}
              labelBackgroundFlag
            />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

PortInfoInsertModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PortInfoInsertModal;
