// libraries
import { useState, useEffect,useRef } from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Stack, IconButton } from '@mui/material';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';
import { Typography } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import Transitions from '@components/@extended/Transitions';
import ObjectModal from '@components/modal/streaming/objectModal';
// functions
import codeApi from '@api/system/codeApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import useInput from '@modules/hooks/useInput';
import useApi from '@modules/hooks/useApi';
import commonApi from '@api/common/commonApi';
import useConfig from '@modules/hooks/useConfig';

const gridData_01 = {
  content: [
    {
      location: '업무망',
      objectName: '내부망 인프라',
      division: 'IPv4',
      ipBandwidth: '32',
      ipAddress: '192.168.3.50',
      dnatIP: '',
      dnatPort: '-',
      description: '',
    },
  ],
  pageable: {
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    pageNumber: 0,
    pageSize: 10,
    unpaged: false,
    paged: true,
  },
  last: false,
  totalElements: 1,
  totalPages: 1,
  size: 10,
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  first: true,
  numberOfElements: 10,
  empty: false,
};

function IpStatusTab(tabParams) {
  const { searchName } = tabParams.tabParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  commonApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    location: '',
    objectName: searchName,
    division: '',
    ipBandwidth: '',
    ipAddress: '',
    dnatIP: '',
    dnatPort: '',
    description: '',
  });
  // 객체팝업 오픈여부 상태값
  const [objectModalOpen, setObjectModalOpen] = useState(false);
  // 객체팝업 파라미터 상태값
  const [objectModalParams, setObjectModalParams] = useState({});
  // IP현황 목록 상태값
  const [ipStatusList, setIpStatusList] = useState([]);
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: codeApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 삭제 목록 상태값
  const [deleteList, setDeleteList] = useState([]);
  // 조회영역 확장여부 상태값
  const [searchOpenFlag, setSearchOpenFlag] = useState(true);
  // Locale 값(전역데이터 접근(Context Hook))
  const { i18n } = useConfig();
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 초기화 함수
    init();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, [i18n]);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    // 검색조건 변경
    setParameters({
      ...parameters,
      objectName: searchName,
    });
    // Clean-up
    return () => {
      source.cancel();
    };
  }, [tabParams]);
  // 초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보
    const gridInfo = await HsLib.getGridInfo('IpStatusList', codeApi);
    if (gridInfo) {
      // IP현황 목록 요청
      // const dataList = await apiCall(codeApi.getIpStatusList, {
      //   ...parameters,
      //   sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      //   size: gridInfo.listInfo.size,
      // });
      const dataList = gridData_01;
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // IP현황 목록 응답처리
        responseIpStatusList(dataList);
      });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    // 컬럼정보 재구성
    makeColumns(p_gridInfo.columns);
    // 테이블정보 상태값 변경
    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });
    // 검색조건 변경
    setParameters({
      ...parameters,
      sort: `${p_gridInfo.listInfo.sortColumn ?? ''},${p_gridInfo.listInfo.sortDirection ?? ''}`,
      size: p_gridInfo.listInfo.size,
    });
  };
  // IP현황 목록 응답처리
  const responseIpStatusList = (p_ipStatusList) => {
    setGridInfo((prev) => {
      return { ...prev, total: p_ipStatusList.totalElements };
    });
    setIpStatusList(p_ipStatusList.content);
  };
  // IP현황 목록만 출력
  const getIpStatusList = async (parameters) => {
    // const result = await apiCall(codeApi.getIpStatusList, parameters);
    // if (result.status === 200) {
    //   // 일괄 변경처리
    //   unstable_batchedUpdates(() => {
    //     if (!parameters) {
    //       resetParameters();
    //     }
    //     // IP현황 목록 응답처리
    //     responseIpStatusList(result);
    //   });
    // }
  };
  // 검색조건영역 확장/축소 버튼 클릭 이벤트
  const handleClick = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };
  // 그리드 클릭 이벤트
  const handleGridClick = (event, cell, row) => {
    handleButtonClickInsertUpdate('update', cell.row.original.objectName);
  };
  // 추가 버튼 클릭 이벤트
  const handleButtonClickInsertUpdate = (flag, item) => {
    setObjectModalParams({ flag: flag, id: item });
    setObjectModalOpen(true);
  };
  // 삭제버튼 클릭 이벤트
  const handleButtonClickDelete = () => {
    // if (deleteList.length !== 0) {
    //   openModal({
    //     message: `${deleteList.length}건을 삭제하시겠습니까?`,
    //     onConfirm: deleteCode,
    //   });
    // } else {
    //   openModal({
    //     message: `삭제할 항목을 먼저 선택해주세요.`,
    //   });
    // }
  };
  // 정보 삭제
  // const deleteCode = async () => {
  //   const result = await apiCall(
  //     codeApi.deleteCode,
  //     deleteList.map((item) => item.id),
  //   );

  //   if (result.status === 200) {
  //     openModal({
  //       message: `${result.data}건이 삭제되었습니다.`,
  //       onConfirm: () => {
  //         setDeleteList([]);
  //         getIpStatusList();
  //       },
  //     });
  //   }
  // };
  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'location':
          column.Cell = (props) => {
            return renderLocationCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };
  // 코드구분 컬럼 생성
  const renderLocationCell = useCallback(({ row: { original } }) => {
    return (
      <>
        <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1.25}>
          <Typography variant="h6" sx={{ color: '#66BB6A' }}>
            {original.location}
          </Typography>
        </Stack>
      </>
    );
  }, []);
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getIpStatusList(parameters)}>
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
              label="위치"
              name="location"
              value={parameters.location}
              onChange={changeParameters}
              list={[
                { value: '1', label: '업무망' },
                { value: '2', label: '인터넷망' },
              ]}
            />
            <LabelInput
              label="객체명"
              name="objectName"
              inputProps={{ maxLength: 32 }}
              value={parameters.objectName}
              onChange={changeParameters}
            />
            <LabelInput
              type="select"
              label="구분"
              name="division"
              value={parameters.division}
              onChange={changeParameters}
              list={[
                { value: '1', label: 'URL' },
                { value: '2', label: 'IPv4' },
              ]}
            />
            <LabelInput
              label="IP 대역"
              name="ipBandwidth"
              inputProps={{ maxLength: 32 }}
              value={parameters.ipBandwidth}
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
            onClick={handleClick}
          >
            {searchOpenFlag ? <UpOutlined fontSize="small" /> : <DownOutlined fontSize="small" />}
          </IconButton>

          <Transitions type="collapse" in={searchOpenFlag}>
            <GridItem
              container
              divideColumn={4}
              spacing={2}
              sx={{
                pr: 5,
                pt: 2,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '200px', minWidth: '200px' },
              }}
            >
              <LabelInput
                label="IP"
                name="ipAddress"
                inputProps={{ maxLength: 32 }}
                value={parameters.ipAddress}
                onChange={changeParameters}
              />
              <LabelInput
                label="DNAT IP"
                name="dnatIP"
                inputProps={{ maxLength: 32 }}
                value={parameters.dnatIP}
                onChange={changeParameters}
              />
              <LabelInput
                label="DNAT PORT"
                name="dnatPort"
                inputProps={{ maxLength: 32 }}
                value={parameters.dnatPort}
                onChange={changeParameters}
              />
              <LabelInput
                label="설명"
                name="description"
                inputProps={{ maxLength: 32 }}
                value={parameters.description}
                onChange={changeParameters}
              />
            </GridItem>
          </Transitions>
        </SearchInput>

        <GridItem item directionHorizon="space-between">
          <ButtonSet
            options={[
              {
                label: intl.formatMessage({ id: 'btn-add' }),
                callBack: () => handleButtonClickInsertUpdate('insert', ''),
                variant: 'outlined',
              },
              {
                label: intl.formatMessage({ id: 'btn-delete' }),
                callBack: handleButtonClickDelete,
                color: 'secondary',
                variant: 'outlined',
              },
            ]}
          />

          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                getIpStatusList();
              }}
            >
              <Replay />
            </Button>
            <ButtonSet
              type="search"
              options={[
                { label: intl.formatMessage({ id: 'btn-reset' }), callBack: resetParameters },
                {
                  label: intl.formatMessage({ id: 'btn-search' }),
                  callBack: () => getIpStatusList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>

        <GridItem item>
          <ReactTable
            listFuncName="getIpStatusList"
            columns={columns}
            data={ipStatusList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setIpStatusList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            parameters={unControlRef}
            setParameters={setParameters}
            sx={{
              '.CMM-rt-tableArea-reactRow': {
                height: 'auto',
              },
              '.CMM-rt-rowArea-tableCell': {
                alignItems: 'center',
                alignContent: 'center',
              },
              '.CMM-rt-scrollerArea-tableContainer': {
                height: 'center',
                alignContent: 'center',
              },
            }}
            onClick={handleGridClick}
          />
        </GridItem>
      </GridItem>
      {objectModalOpen && (
        <ObjectModal
          alertOpen={objectModalOpen}
          setModalOpen={setObjectModalOpen}
          modalParams={objectModalParams}
        />
      )}
      {/* {console.log('IP현황 화면로딩... ')} */}
    </>
  );
}

IpStatusTab.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default IpStatusTab;
