// libraries
import { useCallback, useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Button, IconButton, Stack } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Replay } from '@mui/icons-material';
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
import policyDestinationApi from '@api/indirectLink/policyDestinationApi';

const temp_serviceMethod = [
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
];

const temp_logRecordYn = [
  { value: '1', label: 'DB 기록' },
  { value: '2', label: 'File 기록' },
  { value: '3', label: 'Log 기록' },
  { value: '4', label: 'TEXT 기록' },
];

const temp_useYn = [
  { value: '1', label: '미사용' },
  { value: '2', label: '사용' },
];

const temp_system = [
  { value: '1', label: '외부시스템01' },
  { value: '2', label: '내부시스템01' },
];

const temp_destinationClassification = [
  { value: '1', label: '업무망' },
  { value: '2', label: '인터넷망' },
];

const temp_data = [
  {
    activeYn: 'Y',
    system: 'E001',
    destinationIP: '192.168.3.50',
    destinationPortFrom: '443',
    destinationPortTo: '443',
    ipCheckLength: '32',
    destinationClassification: '업무망',
    serviceMethod: 'HTTPS',
    portDescription: '인프라 정책',
    logDescription: 'DB기록',
    rxtxCheckTime: 0,
    monitoringYn: '감시',
    permissionAmount: 0,
    mesureTime: 0,
    limitTime: 0,
    option: '',
    filter: '',
    useYn: '미사용',
  },
  {
    activeYn: 'N',
    system: 'I001',
    destinationIP: '192.168.3.50',
    destinationPortFrom: '801',
    destinationPortTo: '801',
    ipCheckLength: '32',
    destinationClassification: '업무망',
    serviceMethod: 'HTTPS',
    portDescription: '인프라 정책',
    logDescription: 'DB기록',
    rxtxCheckTime: 0,
    monitoringYn: '감시',
    permissionAmount: 0,
    mesureTime: 0,
    limitTime: 0,
    option: '',
    filter: '',
    useYn: '미사용',
  },
];

function DestinationPolicyList() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  policyDestinationApi.axios = instance;
  // api 호출 함수.
  const [apiCall] = useApi();

  // 목적지 정책 목록 상태값
  const [policyDestinationList, setPolicyDestinationList] = useState(temp_data);
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: policyDestinationApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 조회영역 확장여부 상태값
  const [searchOpenFlag, setSearchOpenFlag] = useState(true);
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    system: '',
    destinationIP: '',
    destinationPortFrom: '',
    destinationClassification: '',
    serviceMethod: '',
    logRecordYN: '',
    monitoringYN: '',
    option: '',
    filter: '',
    useYn: '',
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
    // 컬럼정보 재구성
    const makeColumns = (columns) => {
      const gridColumns = columns.map((column) => {
        switch (column.accessor) {
          case 'activeYn':
            column.Cell = (props) => {
              return renderUseYNCell(props, column);
            };
            break;
          default:
            break;
        }
        return column;
      });
      setColumns(gridColumns);
    };
    // 테이블, 컬럼정보 응답처리
    const responseGridInfo = (p_gridInfo) => {
      // 컬럼정보 상태값 변경
      makeColumns(p_gridInfo.columns);
      // 테이블정보 상태값 변경
      setGridInfo((prev) => {
        return { ...prev, listInfo: p_gridInfo.listInfo };
      });
      // 검색조건 변경
      setParameters({ ...parameters, size: p_gridInfo.listInfo.size });
    };
    // 정책현황 목록 응답처리
    const responsePolicyDestinationList = (p_policyDestinationList) => {
      setGridInfo((prev) => {
        return { ...prev, total: 1 };
      });
    };
    // 초기화 함수
    const init = async () => {
      // 테이블, 컬럼정보 요청
      const gridInfo = await HsLib.getGridInfo('DestinationList', policyDestinationApi);
      // 정책현황 목록 요청

      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // 정책현황 목록 응답처리
        responsePolicyDestinationList();
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

  // 사용여부 컬럼 생성
  const renderUseYNCell = useCallback(({ row: { original } }) => {
    return (
      <>
        <Stack direction="column" alignItems="center" justifyContent="center" spacing={0.5}>
          {original.activeYn === 'Y' && (
            <Button
              variant="contained"
              sx={{
                minHeight: '22px !important',
                maxHeight: '22px !important',
                width: '80px',
                backgroundColor: '#64B5F6',
              }}
            >
              Active
            </Button>
          )}
          {original.activeYn !== 'Y' && (
            <Button
              variant="contained"
              sx={{
                minHeight: '22px !important',
                maxHeight: '22px !important',
                width: '80px',
                backgroundColor: '#B71C1C',
              }}
            >
              Inactive
            </Button>
          )}
        </Stack>
      </>
    );
  }, []);
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
            label="목적지Port (From)"
            name="destinationPortFrom"
            value={parameters.destinationPortFrom}
            onChange={changeParameters}
          />
          <LabelInput
            type="select"
            label="목적지 구분"
            name="destinationClassification"
            value={parameters.destinationClassification}
            onChange={changeParameters}
            list={temp_destinationClassification}
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
              type="select"
              label="서비스 매소드"
              name="serviceMethod"
              value={parameters.serviceMethod}
              onChange={changeParameters}
              list={temp_serviceMethod}
            />
            <LabelInput
              type="select"
              label="Log 기록여부"
              name="logRecordYN"
              value={parameters.logRecordYN}
              onChange={changeParameters}
              list={temp_logRecordYn}
            />
            <LabelInput
              type="select"
              label="모니터링 여부"
              name="monitoringYN"
              value={parameters.monitoringYN}
              onChange={changeParameters}
              list={[
                { value: '1', label: '감시' },
                { value: '2', label: '미감시' },
              ]}
            />
            <LabelInput
              label="옵션"
              name="option"
              value={parameters.option}
              onChange={changeParameters}
            />
            <LabelInput
              label="필터"
              name="filter"
              value={parameters.filter}
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
          columns={columns}
          data={policyDestinationList}
          setData={setPolicyDestinationList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

DestinationPolicyList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DestinationPolicyList;
