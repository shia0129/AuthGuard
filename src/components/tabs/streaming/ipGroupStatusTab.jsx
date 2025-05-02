// libraries
import { useState, useEffect,useRef } from 'react';
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
import ObjectGroupModal from '@components/modal/streaming/objectGroupModal';
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
      objectName: '객체명',
      ipAddress: [
        '내부망 인프라0',
        '내부망 인프라1',
        '내부망 인프라2',
        '내부망 인프라3',
        '내부망 인프라4',
        '내부망 인프라5',
        '내부망 인프라6',
      ],
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

function IpGroupStatusTab({ tabParams, accordionExpand, setAccordionExpand, setTabParams }) {
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
    objectName: '',
    description: '',
  });
  // Modal팝업 오픈여부 상태값
  const [objectGroupModalOpen, setObjectGroupModalOpen] = useState(false);
  // Modal팝업 파라미터 상태값
  const [objectGroupModalParams, setObjectGroupModalParams] = useState({});
  // IP그룹 목록 상태값
  const [ipGroupStatusList, setIpGroupStatusList] = useState([]);
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
  // 초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보
    const gridInfo = await HsLib.getGridInfo('IpGroupStatus', codeApi);
    if (gridInfo) {
      // IP그룹 목록 요청
      // const dataList = await apiCall(codeApi.getIpGroupStatusList, {
      //   ...parameters,
      //   sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      //   size: gridInfo.listInfo.size,
      // });
      const dataList = gridData_01;
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // IP그룹 목록 응답처리
        responseIpGroupStatusList(dataList);
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
  // IP그룹 목록 응답처리
  const responseIpGroupStatusList = (p_ipGroupStatusList) => {
    setGridInfo((prev) => {
      return { ...prev, total: p_ipGroupStatusList.totalElements };
    });
    setIpGroupStatusList(p_ipGroupStatusList.content);
  };
  // IP그룹 목록만 출력
  const getIpGroupStatusList = async (parameters) => {
    // const result = await apiCall(codeApi.getIpGroupStatusList, parameters);
    // if (result.status === 200) {
    //   // 일괄 변경처리
    //   unstable_batchedUpdates(() => {
    //     if (!parameters) {
    //       resetParameters();
    //     }
    //     // IP그룹 목록 응답처리
    //     responseIpGroupStatusList(result);
    //   });
    // }
  };
  // 그리드 클릭 이벤트
  const handleGridClick = (event, cell, row) => {
    if (cell.column.id !== 'ipAddress') {
      handleInsertUpdateButtonClick('update', cell.row.original);
    }
  };
  // 저장버튼 클릭, 코드구분 클릭 이벤트
  const handleInsertUpdateButtonClick = (flag, rowData) => {
    setObjectGroupModalParams({ flag: flag, rowData: rowData });
    setObjectGroupModalOpen(true);
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
  //         getIpGroupStatusList();
  //       },
  //     });
  //   }
  // };
  // IP 클릭 이벤트
  const handleClickIpAddress = (item) => {
    unstable_batchedUpdates(() => {
      setAccordionExpand({ ...accordionExpand, panel1: false, panel2: true, panel3: false });
      setTabParams({ searchName: item });
    });
    setTimeout(() => {
      window.location.href = '#panel2d-header';
    }, 500);
  };
  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'location':
          column.Cell = (props) => {
            return renderLocationCell(props, column);
          };
          break;
        case 'ipAddress':
          column.Cell = (props) => {
            return renderIpAddressCell(props, column);
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
  // IP 컬럼 생성
  const renderIpAddressCell = useCallback(({ row: { original } }) => {
    return (
      <>
        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" flexWrap="wrap">
          {original.ipAddress.map((item, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleClickIpAddress(item)}
              color="info"
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
          ))}
        </Stack>
      </>
    );
  }, []);
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getIpGroupStatusList(parameters)}>
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
                callBack: () => handleInsertUpdateButtonClick('insert', ''),
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
                getIpGroupStatusList();
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
                  callBack: () => getIpGroupStatusList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>

        <GridItem item>
          <ReactTable
            listFuncName="getIpGroupStatusList"
            columns={columns}
            data={ipGroupStatusList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setIpGroupStatusList}
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
      {objectGroupModalOpen && (
        <ObjectGroupModal
          alertOpen={objectGroupModalOpen}
          setModalOpen={setObjectGroupModalOpen}
          modalParams={objectGroupModalParams}
          getIpGroupStatusList={getIpGroupStatusList}
        />
      )}
      {/* {console.log('IP그룹 화면로딩... ')} */}
    </>
  );
}

IpGroupStatusTab.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default IpGroupStatusTab;
