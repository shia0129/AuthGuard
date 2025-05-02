// libraries
import { useCallback, useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Replay } from '@mui/icons-material';
import { Button, Stack, Link } from '@mui/material';

// components
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import TaskModal from '@sub/system-manage/settings/TaskModal';

// functions
import { AuthInstance } from '@modules/axios';
import taskApi from '@api/system-manage/taskApi';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';
import HsLib from '@modules/common/HsLib';
import systemGroupApi from '@api/systemComposition/systemGroupApi';

const aggreGateRender = (leafValues) => {
  let message = '';
  const firstValues = leafValues[0];
  const array = leafValues.filter((value) => value !== firstValues);
  message = firstValues;

  if (array.length !== 0) {
    array.forEach((element) => {
      message += element;
    });
    return message;
  }
  return message;
};

function Task() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  taskApi.axios = instance;
  systemGroupApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall] = useApi();

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    systemId: '',
    taskId: '',
    name: '',
    description: '',
  });

  // 테스크 목록 상태값
  const [taskList, setTaskList] = useState([]);

  // 검색 조건 시스템 목록 상태값
  const [systemList, setSystemList] = useState([]);

  // Modal팝업 오픈여부 상태값
  const [open, setOpen] = useState(false);
  // Modal팝업 파라미터 상태값
  const [modalParams, setModalParams] = useState({});
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: taskApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
    columns: [],
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 초기화 함수
    const init = async () => {
      // 테이블, 컬럼정보 요청
      const gridInfo = await HsLib.getGridInfo('TaskList', taskApi);

      const systemInfoResult = await apiCall(systemGroupApi.getSystemInfoList);

      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (systemInfoResult.status === 200) {
          setSystemList(
            systemInfoResult.data.content.map((systemInfo) => ({
              label: systemInfo.systemName,
              value: systemInfo.systemId,
            })),
          );
        }
        // 테스크 타입 select 값 설정.
        const taskTypeColumn = gridInfo.columns.find((column) => column.accessor === 'taskType');
        taskTypeColumn.valueOptions = taskTypeColumn.valueOptions.map((item) => ({
          ...item,
          label: item.value,
        }));
        setColumns(
          gridInfo.columns.map((column) =>
            column.accessor === 'name' || column.accessor === 'description'
              ? {
                  ...column,
                  aggregate: aggreGateRender,
                  Aggregated: ({ value }) => value,
                  isAggregateGroup: true,
                  disableGroupBy: true,
                }
              : column.accessor === 'taskName'
              ? { ...column, Cell: reunderTaskNameCell }
              : column,
          ),
        );

        // 테이블정보 상태값 변경
        setGridInfo((prev) => ({ ...prev, listInfo: gridInfo.listInfo }));
        // 검색조건 변경
        setParameters({ ...parameters, size: gridInfo.listInfo.size });
        // 테스크 목록 조회
        getTaskList({ ...parameters, size: gridInfo.listInfo.size });
      });
    };

    init();

    return () => {
      source.cancel();
    };
  }, []);

  const getTaskList = async (parameter) => {
    const result = await apiCall(taskApi.getTaskList, parameter);

    if (result.status === 200) {
      unstable_batchedUpdates(() => {
        setGridInfo((prev) => ({ ...prev, total: result.data.totalElements }));
        setTaskList(result.data.content);
      });
    }
  };

  // 추가버튼, 역할명 클릭 이벤트
  const handleInsertUpdateButtonClick = (flag, systemTaskList) => {
    setModalParams({ flag, systemTaskList });
    setOpen(true);
  };

  // Task Name 컬럼 생성
  const reunderTaskNameCell = useCallback(({ value, row: { leafRows } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() =>
          handleInsertUpdateButtonClick(
            'update',
            leafRows.map((leaf) => ({ ...leaf.original })),
          )
        }
      >
        {value}
      </Link>
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
            name="systemId"
            value={parameters.systemId}
            onChange={changeParameters}
            list={systemList}
          />
          <LabelInput
            label="Task 관리ID"
            name="taskId"
            value={parameters.taskId}
            onChange={changeParameters}
          />
          <LabelInput
            label="Task 명칭"
            name="name"
            value={parameters.name}
            onChange={changeParameters}
          />
          <LabelInput
            label="설명"
            name="description"
            value={parameters.description}
            onChange={changeParameters}
          />
        </GridItem>
      </SearchInput>
      <GridItem item directionHorizon="space-between">
        <ButtonSet
          options={[
            {
              label: '추가',
              callBack: () => handleInsertUpdateButtonClick('insert'),
              variant: 'outlined',
              role: 'insert',
            },
          ]}
        />

        <Stack direction="row" alignItems="center" spacing={1.3}>
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={() => {
              getTaskList();
            }}
          >
            <Replay />
          </Button>
          <ButtonSet
            type="search"
            options={[
              { label: '초기화', callBack: resetParameters },
              {
                label: '검색',
                callBack: () => getTaskList(parameters),
              },
            ]}
          />
        </Stack>
      </GridItem>
      <GridItem item>
        <ReactTable
          listFuncName="getTaskList"
          columns={columns}
          data={taskList}
          setData={setTaskList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
          groupBy={['taskName']}
        />
      </GridItem>
      {open && (
        <TaskModal
          open={open}
          setOpen={setOpen}
          modalParams={modalParams}
          getTaskList={getTaskList}
        />
      )}
    </GridItem>
  );
}

Task.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Task;
