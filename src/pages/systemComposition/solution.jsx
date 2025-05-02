// libraries
import { useState, useEffect,useRef } from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useCallback } from 'react';
import { Link } from '@mui/material';
// components
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import SolutionModal from '@components/modal/systemComposition/solutionModal';
// functions
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import useInput from '@modules/hooks/useInput';
import useApi from '@modules/hooks/useApi';
import solutionApi from '@api/systemComposition/solutionApi';
import portInfoManageApi from '@api/systemComposition/portInfoManageApi';
import FileSaver from 'file-saver';

function Solution() {
  const { instance, source } = AuthInstance();

  solutionApi.axios = instance;
  portInfoManageApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 솔루션 환경 설정 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    systemSeq: '',
    tag: '',
    tagValue: '',
    tagDesc: '',
  });

  // 추가 Modal팝업 오픈여부 상태값
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  // Modal팝업 수정 여부 상태값
  const [updateFlag, setUpdateFlag] = useState(false);
  // Modal에 전달될 id값
  const [solutionId, setSolutionId] = useState('');

  // 시스템 그룹 값
  const [systemGroupSeqList, setSystemGroupSeqList] = useState([]);

  // 컬럼 정보
  const [columns, setColumns] = useState([]);
  // 리스트 목록 상태값
  const [solutionList, setSolutionList] = useState([]);
  // 삭제 목록 상태값
  const [deleteList, setDeleteList] = useState([]);

  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: solutionApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('SolutionList', solutionApi);

    if (gridInfo) {
      // 조건검색 시스템 콤보데이터 조회
      const systemGroupCombo = await apiCall(portInfoManageApi.getSystemGroupSeqList);

      const seqList = systemGroupCombo?.data.map((item) => {
        const data = {
          label: item.label,
          value: item.value,
        };
        return data;
      });

      setSystemGroupSeqList(seqList);

      // 리스트에 있는 시스템 컬럼
      const groupColumn = gridInfo.columns.find(
        (column) => column.accessor === 'systemSeq' && column,
      );

      if (groupColumn) {
        groupColumn.valueOptions = seqList;
      }

      setColumns(gridInfo.columns);
      makeColumns(gridInfo.columns);
    }

    setGridInfo((prev) => {
      return { ...prev, listInfo: gridInfo.listInfo };
    });

    setParameters({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });

    await getSolutionList({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });
  };

  const getSolutionList = useCallback(async (parameters) => {
    // 정상, 에러 응답 수신.
    const result = await apiCall(solutionApi.getSolutionList, parameters);

    if (result.status === 200) {
      setDeleteList([]);
      setGridInfo((prev) => {
        return { ...prev, total: result.data.totalElements };
      });
      setSolutionList(result.data.content);
    }
  }, []);

  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'tag':
          column.Cell = (props) => {
            // TAG 컬럼 생성
            return reunderServicePortDescCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };

  const reunderServicePortDescCell = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => handleEditButtonClick(original.id)}
      >
        {original.tag}
      </Link>
    );
  }, []);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();

    return () => source.cancel();
  }, []);

  // 추가버튼 클릭 이벤트
  const handleInsertButtonClick = () => {
    setInsertModalOpen(true);
    setUpdateFlag(false);
    setSolutionId('');
  };

  // TAG 클릭 이벤트
  const handleEditButtonClick = (id) => {
    setInsertModalOpen(true);
    setUpdateFlag(true);
    setSolutionId(id);
  };

  // 삭제버튼 클릭 이벤트
  const handleDeleteButtonClick = async () => {
    let deleteIdList = [];

    deleteList.map((data) => {
      deleteIdList.push(data.id);
    });

    const result = await apiCall(solutionApi.deleteSolutionList, deleteIdList);
    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 삭제되었습니다.`,
        onConfirm: () => {
          setDeleteList([]);
          getSolutionList();
        },
      });
    }
  };

  // 엑셀버튼 클릭 이벤트
  const handleExcelButtonClick = async () => {
    const result = await apiCall(solutionApi.getSolutionExcelList);
    let name = decodeURI(result.headers['content-disposition'].split('filename=')[1]).replace(
      /\+/g,
      ' ',
    ); // 파일 이름 추출.
    name = name.substring(1, name.length - 1); // 파일명 뒤에붙은 _제거
    const contentType = result.headers['content-type']; // 파일 cotent-type
    const blob = new Blob([result.data], { type: contentType + ';charset=utf-8' }); // 파일 정보로 blob 객체 생성.
    FileSaver.saveAs(blob, name); // 브라우저 파일 다운로드
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
            label="시스템"
            name="systemSeq"
            type="select"
            list={systemGroupSeqList}
            value={parameters.systemSeq}
            onChange={changeParameters}
          />

          <LabelInput label="TAG" name="tag" value={parameters.tag} onChange={changeParameters} />
          <LabelInput
            label="Value"
            name="tagValue"
            value={parameters.tagValue}
            onChange={changeParameters}
          />
          <LabelInput
            label="변수설명"
            name="tagDesc"
            value={parameters.tagDesc}
            onChange={changeParameters}
          />
        </GridItem>
      </SearchInput>

      <GridItem item directionHorizon="space-between">
        <ButtonSet
          type="custom"
          options={[
            {
              label: '추가',
              callBack: handleInsertButtonClick,
              variant: 'outlined',
              role: 'insert',
            },
            {
              label: '삭제',
              callBack: handleDeleteButtonClick,
              color: 'secondary',
              variant: 'outlined',
              role: 'delete',
            },
            {
              label: '엑셀',
              callBack: handleExcelButtonClick,
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
              resetParameters();
              getSolutionList();
            }}
          >
            <Replay />
          </Button>
          <ButtonSet
            type="search"
            options={[
              {
                label: '초기화',
                callBack: resetParameters,
              },
              {
                label: '검색',
                callBack: () => getSolutionList(parameters),
              },
            ]}
          />
        </Stack>
      </GridItem>
      <GridItem item container direction="row" sx={{ flexWrap: 'nowrap' }} columnSpacing={0}>
        <GridItem item xs sx={{ minWidth: 0 }}>
          <ReactTable
            listFuncName="getSolutionList"
            columns={columns}
            data={solutionList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setSolutionList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            parameters={unControlRef}
            setParameters={setParameters}
          />
        </GridItem>
      </GridItem>
      {insertModalOpen && (
        <SolutionModal
          alertOpen={insertModalOpen}
          setModalOpen={setInsertModalOpen}
          comboList={systemGroupSeqList}
          updateFlag={updateFlag}
          id={solutionId}
          getSolutionList={getSolutionList}
        />
      )}
    </GridItem>
  );
}

Solution.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Solution;
