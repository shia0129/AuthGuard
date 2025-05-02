// libraries
import { useState, useEffect,useRef} from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';
import { Typography } from '@mui/material';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import PortModal from '@components/modal/streaming/portModal';
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
      objectName: 'http-alt[8080]',
      portNumber: '8080',
      description: 'HTTP Alternate (see port 80)',
    },
    {
      objectName: 'postgresql[5432]',
      portNumber: '5432',
      description: 'PostgreSQL Database',
    },
    {
      objectName: 'ms-wbt-server[3389]',
      portNumber: '3389',
      description: 'MS WBT Server',
    },
    {
      objectName: 'mysql[3306]',
      portNumber: '3306',
      description: 'MySQL',
    },
    {
      objectName: 'ncube-lm[1521]',
      portNumber: '1521',
      description: 'nCube License Manager',
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

function PortStatusTab(tabParams) {
  // 파라미터
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
  // Port팝업 오픈여부 상태값
  const [portModalOpen, setPortModalOpen] = useState(false);
  // Port팝업 파라미터 상태값
  const [portModalParams, setPortModalParams] = useState({});
  // Port현황 목록 상태값
  const [portStatusList, setPortStatusList] = useState([]);
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
    const gridInfo = await HsLib.getGridInfo('PortStatusList', codeApi);
    if (gridInfo) {
      // Port현황 목록 요청
      // const dataList = await apiCall(codeApi.getPortStatusList, {
      //   ...parameters,
      //   sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      //   size: gridInfo.listInfo.size,
      // });
      const dataList = gridData_01;

      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // Port현황 목록 응답처리
        responsePortStatusList(dataList);
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
  // Port현황 목록 응답처리
  const responsePortStatusList = (p_portStatusList) => {
    setGridInfo((prev) => {
      return { ...prev, total: p_portStatusList.totalElements };
    });
    setPortStatusList(p_portStatusList.content);
  };
  // Port현황 목록만 출력
  const getPortStatusList = async (parameters) => {
    const result = await apiCall(codeApi.getPortStatusList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (!parameters) {
          resetParameters();
        }
        // Port현황 목록 응답처리
        responsePortStatusList(result);
      });
    }
  };
  // 그리드 클릭 이벤트
  const handleGridClick = (event, cell, row) => {
    handleButtonClickInsertUpdate('update', cell.row.original.objectName);
  };
  // 추가버튼, 그리드 클릭 이벤트
  const handleButtonClickInsertUpdate = (flag, item) => {
    setPortModalParams({ flag: flag, id: item });
    setPortModalOpen(true);
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
  //         getPortStatusList();
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
  // 위치 컬럼 생성
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
        <SearchInput onSearch={() => getPortStatusList(parameters)}>
          <GridItem
            container
            divideColumn={3}
            spacing={2}
            sx={{
              pr: 5,
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              label="객체명"
              name="objectName"
              inputProps={{ maxLength: 32 }}
              value={parameters.objectName}
              onChange={changeParameters}
            />
            <LabelInput
              label="Port"
              name="portNumber"
              inputProps={{ maxLength: 32 }}
              value={parameters.portNumber}
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
                getPortStatusList();
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
                  callBack: () => getPortStatusList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>

        <GridItem item>
          <ReactTable
            listFuncName="getPortStatusList"
            columns={columns}
            data={portStatusList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setPortStatusList}
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
      {portModalOpen && (
        <PortModal
          alertOpen={portModalOpen}
          setModalOpen={setPortModalOpen}
          modalParams={portModalParams}
        />
      )}
      {/* {console.log('Port현황 화면로딩... ')} */}
    </>
  );
}

PortStatusTab.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PortStatusTab;
