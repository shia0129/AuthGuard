// libraries
import { useEffect, useState,useRef } from 'react';
import { Button, IconButton, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Replay } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import ReactTable from '@components/modules/table/ReactTable';
import SearchInput from '@components/modules/input/SearchInput';
import Transitions from '@components/@extended/Transitions';
// functions
import columnListApi from '@api/system/columnListApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import useInput from '@modules/hooks/useInput';
import useAccess from '@modules/hooks/useAccess';
import useApi from '@modules/hooks/useApi';

function ColumnList() {
  // theme 객체(테마)
  const theme = useTheme();
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  columnListApi.axios = instance;
  // api 호출 함수, openModal 함수
  const [apiCall, openModal, apiAllCall] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();
  // 권한반환 함수(상태값반환 Hook사용)
  const { insert, update } = useAccess();
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    listCode: '',
    cellHead: '',
    cellName: '',
    cellType: '',
    attributeType: '',
  });
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 추가컬럼정보 상태값
  const [addColumn, setAddColumn] = useState({});
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: columnListApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 컬럼 목록 상태값
  const [columnList, setColumnList] = useState([]);
  // 변경한 목록 상태값
  const [updateList, setUpdateList] = useState([]);
  // 삭제 목록 상태값
  const [deleteList, setDeleteList] = useState([]);
  // ATTRIBUTE타입 목록 상태값
  const [attributeTypeData, setAttributeTypeData] = useState([]);
  // 셀타입 목록 상태값
  const [typeData, setTypeData] = useState([]);
  // 검색조건영역 확장/축소 여부 상태값
  const [searchOpenFlag, setSearchOpenFlag] = useState(false);
  // const [file, setFile] = useState();
  // const [addAlertOpen, setAddAlertOpen] = useState(false);
  // Side effect Hook
  const useEffect_0001 = useRef(false);
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
    return () => source.cancel();
  }, []);
  // 초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보
    const gridInfo = await HsLib.getGridInfo('CellList', columnListApi, openModal);
    if (gridInfo) {
      const columnList = await apiCall(columnListApi.getColumnList, {
        ...parameters,
        size: gridInfo.listInfo.size,
      });
      // 셀타입
      const typeRequest = apiCall(columnListApi.getTypeList, { codeType: 'CELL_TYPE' });
      // ATTRIBUTE타입
      const attributeRequest = apiCall(columnListApi.getTypeList, { codeType: 'ATTRIBUTE_TYPE' });
      // Promise All Request.
      const [typeResult, attributeResult] = await apiAllCall([typeRequest, attributeRequest]);
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // 코드목록 응답처리
        responseColumnList(columnList);
        // 셀타입, ATTRIBUTE타입 응답처리
        responseSearchSelectList(typeResult, attributeResult);
      });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    // 컬럼정보 상태값 변경
    setColumns(p_gridInfo.columns);
    // 추가컬럼정보 상태값 변경
    setAddColumn(p_gridInfo.addColumn);
    // 테이블정보 상태값 변경
    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });
    // 검색조건 변경
    setParameters({ ...parameters, size: p_gridInfo.listInfo.size });
  };
  // 컬럼목록 응답처리
  const responseColumnList = (p_columnList) => {
    if (p_columnList.status === 200) {
      setDeleteList([]);
      setGridInfo((prev) => {
        return { ...prev, total: p_columnList.data.totalElements };
      });
      setColumnList(p_columnList.data.content);
      setUpdateList(p_columnList.data.content);
      // excel(columns, result.data.resultData);
    }
  };
  // 컬럼목록만 출력
  const getColumnList = async (parameters) => {
    const result = await apiCall(columnListApi.getColumnList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (parameters.resetParameters) {
          resetParameters();
        }
        // 코드목록 응답처리
        responseColumnList(result);
      });
    }
  };
  // 셀타입, ATTRIBUTE타입 응답처리
  const responseSearchSelectList = (p_typeResult, p_attributeResult) => {
    // 셀타입 목록 상태값 변경
    if (p_typeResult && p_typeResult.status === 200) {
      const resultData = p_typeResult.data.resultData.map((item) => ({
        key: item.id,
        value: item.codeValue,
        label: item.codeDesc,
      }));
      setTypeData(resultData);
    }
    // ATTRIBUTE타입 목록 상태값 변경
    if (p_typeResult && p_attributeResult.status === 200) {
      const resultData = p_attributeResult.data.resultData.map((item) => ({
        key: item.id,
        value: item.codeValue,
        label: item.codeDesc,
      }));
      setAttributeTypeData(resultData);
    }
  };
  // 검색조건영역 확장/축소 버튼 클릭 이벤트
  const handleClick = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };
  // (row)추가버튼 클릭 이벤트
  const handleAddColumnButtonClick = () => {
    // 맨위로 컬럼 추가
    const column = { id: HsLib.getId(columnList), ...addColumn };
    setColumnList([column, ...columnList]);
    setUpdateList([column, ...columnList]);
  };
  // 저장버튼 클릭 이벤트
  const handleInsertButtonClick = async () => {
    let validation = HsLib.checkValidity(updateList, columns, openModal);
    if (validation) return;
    const result = await apiCall(columnListApi.insertColumnList, updateList);
    if (result.status === 200) {
      setDeleteList([]);
      openModal({
        message: '저장되었습니다.',
        onConfirm: async () => {
          getColumnList(parameters);
          const gridInfo = await HsLib.getGridInfo('CellList', columnListApi);
          setColumns(gridInfo.columns);
        },
      });
    }
  };
  // 삭제버튼 클릭 이벤트
  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteColumnList,
      });
    } else {
      openModal({
        message: `삭제할 컬럼을 우선 선택해 주십시오.`,
      });
    }
  };
  // 컬럼정보 삭제
  const deleteColumnList = async () => {
    const result = await apiCall(
      columnListApi.deleteColumnList,
      deleteList.map((item) => item.id),
    );
    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 삭제되었습니다.`,
        onConfirm: () => {
          getColumnList(parameters);
          setDeleteList([]);
        },
      });
    }
  };
  // const fileUpload = async () => {
  //   const result = await columnListApi.fileUpload(parameters, file);
  // };
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getColumnList(parameters)}>
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
              label="리스트 코드"
              name="listCode"
              value={parameters.listCode}
              onChange={changeParameters}
              onKeyDown={(e) => {
                e.key === 'Enter' ? getColumnList(parameters) : '';
              }}
            />

            <LabelInput
              label="Head"
              name="cellHead"
              value={parameters.cellHead}
              onChange={changeParameters}
            />

            <LabelInput
              label="컬럼 명"
              name="cellName"
              value={parameters.cellName}
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
                type="select"
                label="ATTRIBUTE 타입"
                name="attributeType"
                value={parameters.attributeType}
                onChange={changeParameters}
                list={attributeTypeData}
              />
              <LabelInput
                type="select"
                label="타입"
                name="cellType"
                value={parameters.cellType}
                onChange={changeParameters}
                list={typeData}
              />
            </GridItem>
          </Transitions>
        </SearchInput>
        <GridItem item directionHorizon="space-between">
          <ButtonSet
            type="custom"
            options={[
              {
                label: '추가',
                callBack: handleAddColumnButtonClick,
                variant: 'outlined',
                color: 'secondary',
                role: 'insert',
              },
              {
                label: '저장',
                callBack: handleInsertButtonClick,
                variant: 'outlined',
                color: 'secondary',
                sx: { display: !insert && !update && 'none' },
              },
              {
                label: '삭제',
                callBack: handleDeleteButtonClick,
                variant: theme.palette.mode === 'dark' ? 'contained' : 'outlined',
                color: 'secondary',
                role: 'delete',
              },
            ]}
          />

          {/* <Button 
            size="small"
            variant="contained"
            color="primary"
            onClick={async () => {
              const result = await columnListApi.excel(parameters);

              let name = decodeURI(
                result.headers['content-disposition'].split('filename=')[1],
              ).replace(/\+/g, ' '); // 파일 이름 추출.
              name = name.substring(1, name.length - 1);
              const contentType = result.headers['content-type']; // 파일 cotent-type

              const blob = new Blob([result.data], { type: contentType + ';charset=utf-8' }); // 파일 정보로 blob 객체 생성.
              FileSaver.saveAs(blob, name); // 브라우저 파일 다운로드
            }}
          /> */}

          {/* <FileInput file={file} setFile={setFile} />
          <Button size="small" variant="contained" color="primary" onClick={fileUpload}>
            Upload
          </Button> */}

          <Stack direction="row" spacing={1.25}>
            {/* <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => setAddAlertOpen(true)}
            >
              <UploadOutlined /> &nbsp; 엑셀 업로드
            </Button> */}
            <Stack direction="row" alignItems="center" spacing={1.3}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => {
                  // resetParameters();
                  getColumnList({ resetParameters: true });
                }}
              >
                <Replay />
              </Button>
              <ButtonSet
                type="search"
                options={[
                  {
                    label: intl.formatMessage({ id: 'btn-reset' }),
                    callBack: () => {
                      resetParameters();
                    },
                  },
                  {
                    label: intl.formatMessage({ id: 'btn-search' }),
                    callBack: () => getColumnList(parameters),
                    color: 'primary',
                    variant: 'contained',
                  },
                ]}
              />
            </Stack>
          </Stack>
        </GridItem>
        <GridItem item sx={{ width: '100%', height: '100%' }}>
          <ReactTable
            listFuncName="getColumnList"
            columns={columns}
            data={columnList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setColumnList}
            setUpdateData={setUpdateList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            setParameters={setParameters}
            parameters={unControlRef}
          />
        </GridItem>
      </GridItem>
      {/* <ExcelUploadPopup
        alertOpen={addAlertOpen}
        setAlertOpen={setAddAlertOpen}
        excelUpload={fileUpload}
        api={columnListApi}
      /> */}
      {/* {console.log('컬럼관리 화면로딩... ')} */}
    </>
  );
}

ColumnList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ColumnList;
