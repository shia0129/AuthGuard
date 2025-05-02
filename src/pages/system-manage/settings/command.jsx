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
import CommandModal from '@sub/system-manage/settings/CommandModal';

// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import commandApi from '@api/system-manage/commandApi';
import useInput from '@modules/hooks/useInput';
import HsLib from '@modules/common/HsLib';
import systemGroupApi from '@api/systemComposition/systemGroupApi';
import codeApi from '@api/system/codeApi';

function Command() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  commandApi.axios = instance;
  systemGroupApi.axios = instance;
  codeApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    systemId: '',
    command: '',
    groupCommand: '',
    commandType: '',
  });

  // 명령어 목록 상태값
  const [commandList, setCommandList] = useState([]);

  // 검색 조건 시스템 목록 상태값
  const [systemList, setSystemList] = useState([]);

  // 검색 조건 명령어 구분 목록 상태값
  const [commandTypeList, setCommandTypeList] = useState([]);

  // 삭제 목록 상태값
  const [deleteList, setDeleteList] = useState([]);

  // Modal팝업 오픈여부 상태값
  const [open, setOpen] = useState(false);
  // Modal팝업 파라미터 상태값
  const [modalParams, setModalParams] = useState({});
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: commandApi,
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
      const gridInfo = await HsLib.getGridInfo('CommandList', commandApi);

      // 검색 조건 시스템 목록 조회.
      const systemInfoResult = await apiCall(systemGroupApi.getSystemInfoList);

      // 검색 조건 명령어 구분 목록 조회.
      const commandTypeResult = await apiCall(codeApi.getComboInfo, 'COMMAND_TYPE');

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
        if (commandTypeResult.status === 200) {
          setCommandTypeList(
            commandTypeResult.data.resultData.map((commandType) => ({
              label: commandType.codeDesc,
              value: commandType.codeValue,
            })),
          );
        }
        makeColumns(gridInfo.columns);
        setColumns(gridInfo.columns);

        // 테이블정보 상태값 변경
        setGridInfo((prev) => ({ ...prev, listInfo: gridInfo.listInfo }));
        // 검색조건 변경
        setParameters({ ...parameters, size: gridInfo.listInfo.size });

        // 명령어 목록 조회
        getCommandList({ ...parameters, size: gridInfo.listInfo.size });
      });
    };

    init();

    return () => {
      source.cancel();
    };
  }, []);

  const getCommandList = async (parameter) => {
    const result = await apiCall(commandApi.getCommandList, parameter);

    if (result.status === 200) {
      unstable_batchedUpdates(() => {
        setGridInfo((prev) => ({ ...prev, total: result.data.totalElements }));
        setCommandList(result.data.content);
      });
    }
  };

  const deleteCommand = async () => {
    const result = await apiCall(commandApi.deleteCommand, deleteList);

    if (result.status === 200) {
      let message = `${result.data}건이 삭제되었습니다.`;

      if (result.data === 0) message = '데이터 삭제에 실패하였습니다.';
      openModal({
        message,
        onConfirm: () => {
          setDeleteList([]);
          getCommandList(parameters);
        },
      });
    }
  };
  // 추가버튼, 역할명 클릭 이벤트
  const handleInsertUpdateButtonClick = (flag, data) => {
    setModalParams({ flag, data });
    setOpen(true);
  };

  // 삭제 버튼 클릭 이벤트
  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteCommand,
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
        case 'systemName':
          column.Cell = (props) => {
            // 역할명 컬럼 생성
            return reunderSystemName(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    // 컬럼정보 상태값 변경
    setColumns(gridColumns);
  };
  // 역할명 컬럼 생성
  const reunderSystemName = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => handleInsertUpdateButtonClick('update', original)}
      >
        {original.systemName}
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
            label="명령어"
            name="command"
            value={parameters.command}
            onChange={changeParameters}
          />
          <LabelInput
            label="그룹 명령어"
            name="groupCommand"
            value={parameters.groupCommand}
            onChange={changeParameters}
          />
          <LabelInput
            type="select"
            label="구분"
            name="commandType"
            value={parameters.commandType}
            onChange={changeParameters}
            list={commandTypeList}
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
            {
              label: '삭제',
              callBack: handleDeleteButtonClick,
              color: 'secondary',
              variant: 'outlined',
              role: 'delete',
            },
          ]}
        />

        <Stack direction="row" alignItems="center" spacing={1.3}>
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
            ]}
          />
        </Stack>
      </GridItem>
      <GridItem item>
        <ReactTable
          listFuncName="getTaskList"
          columns={columns}
          checkList={deleteList}
          onChangeChecked={setDeleteList}
          data={commandList}
          setData={setCommandList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
      {open && (
        <CommandModal
          open={open}
          setOpen={setOpen}
          modalParams={{ ...modalParams, systemList, commandTypeList }}
          getCommandList={getCommandList}
        />
      )}
    </GridItem>
  );
}

Command.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Command;
