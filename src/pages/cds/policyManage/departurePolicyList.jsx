// libraries
import { useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Button, IconButton, Stack } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Replay } from '@mui/icons-material';
import moment from 'moment';
import _ from 'lodash';

// components
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import Transitions from '@components/@extended/Transitions';

// functions
import useInput from '@modules/hooks/useInput';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import policyDepartureApi from '@api/indirectLink/policyDepartureApi';
import policyDestinationApi from '@api/indirectLink/policyDestinationApi';

const temp_system = [
  { value: '1', label: '외부시스템01' },
  { value: '2', label: '내부시스템01' },
];

const temp_useYn = [
  { value: '1', label: '미사용' },
  { value: '2', label: '사용' },
];

const temp_workClassification = [
  { value: '1', label: '매일' },
  { value: '2', label: '시간 설정' },
  { value: '3', label: '기간 설정' },
];

const temp_workTime = [{ value: '1', label: '시간선택' }];

const temp__time_workTime = [
  { value: '1', label: '일요일' },
  { value: '2', label: '월요일' },
  { value: '3', label: '화요일' },
  { value: '4', label: '수요일' },
  { value: '5', label: '목요일' },
  { value: '6', label: '금요일' },
  { value: '7', label: '토요일' },
  { value: 'temp', label: '사용불가' },
];

const temp_mainData = [
  {
    system: '내부시스템01',
    destinationIP: '10.113.113.31',
    serviceMethod: '-',
    destinationPort: '45000',
    portDescription: 'GW-31-45010',
    option: '',
    filter: '',
    useYn: '미사용',
  },
];

const temp_subData = [
  {
    departureIP: '50.50.50.60',
    departureIpCheckLength: 10,
    macAddress: '-',
    workClassification: '-',
    workStartTime: moment().format('YYYY-MM-DD HH:mm'),
    workEndTime: moment().add(2, 'h').format('YYYY-MM-DD HH:mm'),
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().add(1, 'day').format('YYYY-MM-DD'),
    description: '',
    useYn: '사용',
  },
];

function DeparturePolicyList() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  policyDestinationApi.axios = instance;
  policyDepartureApi.axios = instance;
  // api 호출 함수.
  const [apiCall] = useApi();

  // 목적지 정책 목록 상태값
  const [policyDestinationList, setPolicyDestinationList] = useState(temp_mainData);
  // 출발지 정책 목록 상태값
  const [policyDepartureList, setPolicyDepartureList] = useState(temp_subData);
  // 조회영역 확장여부 상태값
  const [searchOpenFlag, setSearchOpenFlag] = useState(true);
  // 컬럼정보 상태값
  const [mainColumns, setMainColumns] = useState([]);
  // 테이블정보 상태값
  const [mainGridInfo, setMainGridInfo] = useState({
    api: policyDestinationApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 컬럼정보 상태값
  const [subColumns, setSubColumns] = useState([]);
  // 테이블정보 상태값
  const [subGridInfo, setSubGridInfo] = useState({
    api: policyDepartureApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    system: '',
    destinationIP: '',
    destinationPort: '',
    portDescription: '',
    departureIP: '',
    useYn: '',
    workClassification: '',
    workTime: '',
    startData: moment(),
    endData: moment(),
  });
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 테이블, 컬럼정보 응답처리
    const responseGridInfo = (p_gridInfo, setColumns, setGridInfo) => {
      // 컬럼정보 상태값 변경
      setColumns(p_gridInfo.columns);
      // 테이블정보 상태값 변경
      setGridInfo((prev) => {
        return { ...prev, listInfo: p_gridInfo.listInfo };
      });
      // 검색조건 변경
      setParameters({ ...parameters, size: p_gridInfo.listInfo.size });
    };
    //  목록 응답처리
    const responseList = (p_list, setGridInfo) => {
      setGridInfo((prev) => {
        return { ...prev, total: 1 };
      });
    };
    // 초기화 함수
    const init = async () => {
      // 테이블, 컬럼정보 요청
      const mainGridInfo = await HsLib.getGridInfo('DepartureList', policyDestinationApi);
      const subGridInfo = await HsLib.getGridInfo('DepartureList2', policyDepartureApi);

      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(mainGridInfo, setMainColumns, setMainGridInfo);
        // 목적지 정책 목록 응답처리
        responseList(null, setMainGridInfo);

        // 테이블, 컬럼정보 응답처리
        responseGridInfo(subGridInfo, setSubColumns, setSubGridInfo);
        // 출발지 정책 목록 응답처리
        responseList(null, setSubGridInfo);
      });
    };
    // 초기화 함수
    init();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, []);

  // 검색조건영역 확장/축소 버튼 클릭 이벤트
  const handleClickSearchOpen = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };

  const handleChangeWorkClassification = (event) => {
    const { value, name } = event.target;
    changeParameters(event);
    // 작업구분 값 변경 시 마다 작업시간 선택 값 초기화.
    setParameters({
      ...parameters,
      workTime: '',
      startData: moment(),
      endData: moment(),
      [name]: value,
    });
  };

  return (
    <GridItem spacing={2} container direction="column">
      <SearchInput>
        <GridItem
          container
          divideColumn={4}
          spacing={2}
          sx={{
            pr: 5,
            '& .text': { maxWidth: '150px', minWidth: '150px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <LabelInput
            type="select"
            label="시스템"
            name="system"
            value={parameters.system}
            onChange={changeParameters}
            list={temp_system}
          />
          <LabelInput
            label="목적지IP"
            name="destinationIP"
            value={parameters.destinationIP}
            onChange={changeParameters}
          />
          <LabelInput
            label="목적지Port"
            name="destinationPort"
            value={parameters.destinationPort}
            onChange={changeParameters}
          />
          <LabelInput
            label="포트 설명"
            name="portDescription"
            value={parameters.portDescription}
            onChange={changeParameters}
          />
        </GridItem>
        <IconButton
          aria-label="delete"
          size="small"
          sx={{
            position: 'absolute',
            right: 10,
            top: '15px',
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
          onClick={handleClickSearchOpen}
        >
          {searchOpenFlag ? <UpOutlined fontSize="small" /> : <DownOutlined fontSize="small" />}
        </IconButton>
        <Transitions type="collapse" in={searchOpenFlag}>
          <GridItem
            container
            divideColumn={4}
            spacing={2}
            sx={{
              pt: 2,
              pr: 5,
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              label="출발지 IP"
              name="departureIP"
              value={parameters.departureIP}
              onChange={changeParameters}
            />
            <LabelInput
              type="select"
              label="사용여부"
              name="useYn"
              value={parameters.useYn}
              onChange={changeParameters}
              list={temp_useYn}
            />
            <LabelInput
              type="select"
              label="작업구분"
              name="workClassification"
              value={parameters.workClassification}
              onChange={handleChangeWorkClassification}
              list={temp_workClassification}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              colSpan={parameters.workTime ? 2 : 1}
            >
              <LabelInput
                type="select"
                disabled={!parameters.workClassification && true}
                label="작업시간"
                name="workTime"
                value={parameters.workTime}
                onChange={changeParameters}
                list={parameters.workClassification === '2' ? temp__time_workTime : temp_workTime}
              />
              {parameters.workClassification &&
                parameters.workTime &&
                parameters.workTime !== 'temp' && (
                  <>
                    <LabelInput
                      type={parameters.workClassification !== '3' ? 'time1' : 'dateTime'}
                      name="startData"
                      value={parameters.startData}
                      onChange={changeParameters}
                      sx={{ width: '200px' }}
                    />
                    &nbsp;&nbsp;&nbsp;~
                    <LabelInput
                      type={parameters.workClassification !== '3' ? 'time1' : 'dateTime'}
                      name="endData"
                      value={parameters.endData}
                      onChange={changeParameters}
                      sx={{ width: '200px' }}
                    />
                  </>
                )}
            </Stack>
          </GridItem>
        </Transitions>
      </SearchInput>

      <GridItem item directionHorizon="end" spacing={1.3}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Button color="secondary" variant="outlined" size="small">
            <Replay />
          </Button>
          <ButtonSet
            type="search"
            options={[
              { label: '초기화', callBack: resetParameters },
              {
                label: '검색',
              },
              {
                label: '엑셀',
                color: 'secondary',
                variant: 'outlined',
              },
            ]}
          />
        </Stack>
      </GridItem>
      <GridItem item>
        <ReactTable
          listFuncName="getPolicyDestinationList"
          columns={mainColumns}
          data={policyDestinationList}
          setData={setPolicyDestinationList}
          gridInfo={mainGridInfo}
          setGridInfo={setMainGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
          sx={{
            height: '300px',
          }}
        />
      </GridItem>
      <GridItem item>
        <ReactTable
          listFuncName="getPolicyDepartureList"
          columns={subColumns}
          data={policyDepartureList}
          setData={setPolicyDepartureList}
          gridInfo={subGridInfo}
          setGridInfo={setSubGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

DeparturePolicyList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DeparturePolicyList;
