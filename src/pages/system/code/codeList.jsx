// libraries
import { useState, useEffect,useRef } from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Stack, IconButton } from '@mui/material';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';
import { Link } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import CodeModal from '@components/modal/system/code/codeModal';
import Transitions from '@components/@extended/Transitions';
// functions
import codeApi from '@api/system/codeApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import useInput from '@modules/hooks/useInput';
import useApi from '@modules/hooks/useApi';
import commonApi from '@api/common/commonApi';
import useConfig from '@modules/hooks/useConfig';
function CodeList() {
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
    codeType: '',
    codeDesc: '',
    codeValue: '',
    defaultYn: '',
    userId: '',
  });
  // Modal팝업 오픈여부 상태값
  const [modalOpen, setModalOpen] = useState(false);
  // Modal팝업 파라미터 상태값
  const [modalParams, setModalParams] = useState({});
  // 코드 목록 상태값
  const [codeList, setCodeList] = useState([]);
  // 코드구분 목록 상태값
  const [codeInfoList, setCodeInfoList] = useState([]);
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
  const [searchOpenFlag, setSearchOpenFlag] = useState(false);
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
    const gridInfo = await HsLib.getGridInfo('CodeList', codeApi);
    if (gridInfo) {
      // 코드목록 요청
      const codeList = await apiCall(codeApi.getCodeList, {
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
      // 코드타입 요청
      const codeType = await apiCall(codeApi.getCodeTypeList);
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // 코드목록 응답처리
        responseCodeList(codeList, codeType);
      });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    // 컬럼정보 재구성
    makeColumns(p_gridInfo.columns);
    // 컬럼정보 상태값 변경
    // setColumns(p_gridInfo.columns);
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
  // 코드목록 응답처리
  const responseCodeList = (p_codeList, p_codeType) => {
    const codeArr = [];
    if (p_codeList.status === 200 && p_codeType.status === 200) {
      p_codeType.data.map((data) => {
        const { codeType, codeTypeName } = data;
        codeArr.push({ value: codeType, label: codeTypeName });
      });
      setGridInfo((prev) => {
        return { ...prev, total: p_codeList.data.totalElements };
      });
      setCodeList(p_codeList.data.content);
      setCodeInfoList(codeArr);
    }
  };
  // 코드목록만 출력
  const getCodeList = async (parameters) => {
    const result = await apiCall(codeApi.getCodeList, parameters);

    const resultCodeType = await apiCall(codeApi.getCodeTypeList);

    if (result.status === 200 && resultCodeType.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (!parameters) {
          resetParameters();
        }
        // 코드목록 응답처리
        responseCodeList(result, resultCodeType);
      });
    }
  };
  // 검색조건영역 확장/축소 버튼 클릭 이벤트
  const handleClick = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };
  // 저장버튼 클릭, 코드구분 클릭 이벤트
  const handleInsertUpdateButtonClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };
  // 삭제버튼 클릭 이벤트
  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteCode,
      });
    } else {
      openModal({
        message: `삭제할 항목을 먼저 선택해주세요.`,
      });
    }
  };
  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'codeTypeName':
          column.Cell = (props) => {
            return reunderCodeTypeNameCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };
  // 코드정보 삭제
  const deleteCode = async () => {
    const result = await apiCall(
      codeApi.deleteCode,
      deleteList.map((item) => item.id),
    );

    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 삭제되었습니다.`,
        onConfirm: () => {
          setDeleteList([]);
          getCodeList();
        },
      });
    }
  };
  // 코드구분 컬럼 생성
  const reunderCodeTypeNameCell = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => handleInsertUpdateButtonClick('update', original.id)}
      >
        {original.codeTypeName}
      </Link>
    );
  }, []);
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getCodeList(parameters)}>
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
              label={intl.formatMessage({ id: 'code-type' })}
              name="codeType"
              value={parameters.codeType}
              onChange={changeParameters}
              list={codeInfoList}
            />

            <LabelInput
              label={intl.formatMessage({ id: 'code-desc' })}
              name="codeDesc"
              inputProps={{ maxLength: 32 }}
              value={parameters.codeDesc}
              onChange={changeParameters}
            />

            <LabelInput
              label={intl.formatMessage({ id: 'code-register' })}
              name="userId"
              value={parameters.userId}
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
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                pt: 2,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '200px', minWidth: '200px' },
              }}
            >
              <LabelInput
                label={intl.formatMessage({ id: 'code-value' })}
                name="codeValue"
                inputProps={{ maxLength: 32 }}
                value={parameters.codeValue}
                onChange={changeParameters}
              />
              <LabelInput
                type="select"
                label={intl.formatMessage({ id: 'code-default-yn' })}
                name="defaultYn"
                value={parameters.defaultYn}
                onChange={changeParameters}
                list={[
                  { value: 'Y', label: '사용' },
                  { value: 'N', label: '미사용' },
                ]}
              />
            </GridItem>
          </Transitions>
        </SearchInput>

        <GridItem item directionHorizon="space-between">
          <ButtonSet
            options={[
              {
                label: intl.formatMessage({ id: 'btn-add' }),
                callBack: () => handleInsertUpdateButtonClick('insert', ''),
                // callBack: handleInsertButtonClick,
                variant: 'outlined',
                // role: 'insert',
              },
              {
                label: intl.formatMessage({ id: 'btn-delete' }),
                callBack: handleDeleteButtonClick,
                color: 'secondary',
                variant: 'outlined',
                // role: 'delete',
              },
            ]}
          />

          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                getCodeList();
                // resetParameters();
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
                  callBack: () => getCodeList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>

        <GridItem item>
          <ReactTable
            listFuncName="getCodeList"
            columns={columns}
            data={codeList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setCodeList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            parameters={unControlRef}
            setParameters={setParameters}
          />
        </GridItem>
      </GridItem>
      {modalOpen && (
        <CodeModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          getCodeList={getCodeList}
        />
      )}
      {/* {console.log('코드관리 화면로딩... ')} */}
    </>
  );
}

CodeList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default CodeList;
