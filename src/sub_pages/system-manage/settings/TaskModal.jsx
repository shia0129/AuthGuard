// libraries
import { useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';

// components
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack, Typography, Button } from '@mui/material';
// functions
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import systemGroupApi from '@api/systemComposition/systemGroupApi';
import codeApi from '@api/system/codeApi';
import taskApi from '@api/system-manage/taskApi';

function TaskModal({
  open,
  setOpen,
  modalParams = { flag: 'insert', systemTaskListid: [] },
  getTaskList,
}) {
  // 파라미터
  const { flag, systemTaskList } = modalParams;

  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  taskApi.axios = instance;
  systemGroupApi.axios = instance;
  codeApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal, apiAllCall] = useApi();

  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      taskName: '',
      name: '',
      description: '',
      systemTaskList: [],
    },
  });

  // 서버 리턴 후 메시지 처리 변수
  let resultMessage;

  // 시스템 정보 목록
  const [systemList, setSystemList] = useState([]);

  // 테스크 타입 콤포 목록
  const [taskTypeList, setTaskTypeList] = useState([]);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 시스템 목록 및 테스크 타입 목록 생성.
    const getComboList = async () => {
      const systemTypeRequest = apiCall(codeApi.getComboInfo, 'SYSTEM_TYPE');
      const taskTypeRequest = apiCall(codeApi.getComboInfo, 'TASK_TYPE');

      const [systemTypeResult, taskTypeResult] = await apiAllCall([
        systemTypeRequest,
        taskTypeRequest,
      ]);
      const systemInfoResult = await apiCall(systemGroupApi.getSystemInfoList);

      if (
        systemTypeResult.status === 200 &&
        systemInfoResult.status === 200 &&
        taskTypeResult.status === 200
      ) {
        // 시스템 정보 생성.
        const systemList = [];

        systemTypeResult.data.resultData.forEach((system) => {
          systemList.push({
            systemName: system.codeDesc,
            systemGroupId: system.id,
            systemGroupValue: system.codeValue,
            list: systemInfoResult.data.content
              .filter((systemInfo) => systemInfo.systemType === system.codeValue)
              .map((systemInfo) => ({ label: systemInfo.systemName, value: systemInfo.systemId })),
          });
        });

        unstable_batchedUpdates(() => {
          setSystemList(systemList);
          setTaskTypeList(
            taskTypeResult.data.resultData.map((taskType) => ({
              label: taskType.codeValue,
              value: taskType.codeValue,
            })),
          );
        });
      }
    };
    getComboList();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    // 선택 테스크 정보 SET.
    if (flag === 'update' && systemTaskList) {
      methods.setValue('systemTaskList', systemTaskList);
      // 공통 정보 추출.
      ['taskName', 'name', 'description'].forEach((list) => {
        if (systemTaskList.length !== 0 && systemTaskList[0]) {
          methods.setValue(list, systemTaskList[0][`${list}`]);
        }
      });
    }

    return () => {
      methods.reset();
    };
  }, []);

  const saveTask = async (data) => {
    // 시스템 별 테스크 정보.
    const systemTaskList = data.systemTaskList;

    // 공통 데이터 추출.
    delete data.systemTaskList;

    const result = await apiCall(
      taskApi.saveTask,
      systemTaskList.map((systemTask) => ({
        ...systemTask,
        ...data,
        flag: flag === 'insert' ? 'I' : 'U',
      })),
    );

    if (result.status === 200) {
      if (result.data >= 1) {
        resultMessage = `테스크 정보가 ${flag === 'insert' ? '등록' : '수정'} 되었습니다.`;
      } else {
        resultMessage = `테스크 정보 ${flag === 'insert' ? '등록' : '수정'}에 실패하였습니다.`;
      }
      openModal({
        message: resultMessage,
        onConfirm: () => {
          setOpen(false);
          getTaskList();
        },
      });
    }
  };

  const deleteTask = async () => {
    const result = await apiCall(taskApi.deleteTask, systemTaskList);

    if (result.status === 200) {
      if (result.data >= 1) {
        resultMessage = '테스크 정보가 삭제 되었습니다.';
      } else {
        resultMessage = '테스크 정보 삭제에 실패하였습니다.';
      }
      openModal({
        message: resultMessage,
        onConfirm: () => {
          setOpen(false);
          getTaskList();
        },
      });
    }
  };

  const handleDeleteButtonEvent = () => {
    openModal({
      message: '테스크를 삭제하시겠습니까?',
      onConfirm: () => {
        deleteTask();
      },
    });
  };
  return (
    <PopUp
      maxWidth="lg"
      fullWidth
      callBack={methods.handleSubmit(saveTask)}
      alertOpen={open}
      closeAlert={setOpen}
      title={`테스크 ${flag === 'insert' ? '생성' : '수정'}`}
      actionComponent={
        flag === 'update' && (
          <Button color="secondary" variant="outlined" onClick={handleDeleteButtonEvent}>
            삭제
          </Button>
        )
      }
    >
      <FormProvider {...methods}>
        <form>
          <Stack spacing={1}>
            <Typography>공통 정보</Typography>
            <GridItem
              container
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                '& .text': { maxWidth: '180px !important', minWidth: '180px !important' },
                '.inputBox': { width: '310px' },
              }}
            >
              <LabelInput
                required
                typingCheck
                maxLength={64}
                label="Task Name"
                name="taskName"
                labelBackgroundFlag
              />
              <LabelInput
                required
                typingCheck
                maxLength={64}
                label="Task 명칭"
                name="name"
                labelBackgroundFlag
              />
              <LabelInput
                typingCheck
                maxLength={128}
                label="설명"
                name="description"
                labelBackgroundFlag
              />
            </GridItem>

            <GridItem container divideColumn={2}>
              {systemList.map((system, index) => {
                return (
                  <Stack spacing={1} key={system.systemGroupId}>
                    <Typography>{system.systemName}</Typography>

                    <GridItem
                      container
                      direction="row"
                      divideColumn={1}
                      borderFlag
                      sx={{
                        '& .text': { maxWidth: '180px !important', minWidth: '180px !important' },
                        '.inputBox': { width: '310px' },
                      }}
                    >
                      <LabelInput
                        required
                        type="select"
                        label="시스템"
                        name={`systemTaskList.${index}.systemId`}
                        labelBackgroundFlag
                        list={system.list}
                      />
                      <LabelInput
                        required
                        typingCheck
                        maxLength={8}
                        label="Task 관리 ID"
                        name={`systemTaskList.${index}.taskId`}
                        labelBackgroundFlag
                      />
                      <LabelInput
                        required
                        label="Master Channel"
                        name={`systemTaskList.${index}.masterChannel`}
                        labelBackgroundFlag
                        onlyNumber
                        typingCheck
                      />
                      <LabelInput
                        required
                        label="Slave Channel"
                        name={`systemTaskList.${index}.slaveChannel`}
                        labelBackgroundFlag
                        onlyNumber
                        typingCheck
                      />
                      <LabelInput
                        required
                        label="Max Count"
                        name={`systemTaskList.${index}.maxCount`}
                        labelBackgroundFlag
                        onlyNumber
                        typingCheck
                      />
                      <LabelInput
                        required
                        type="select"
                        label="Task type"
                        name={`systemTaskList.${index}.taskType`}
                        labelBackgroundFlag
                        list={taskTypeList}
                      />
                      <LabelInput
                        required
                        typingCheck
                        maxLength={256}
                        label="파라미터"
                        name={`systemTaskList.${index}.parameter`}
                        labelBackgroundFlag
                      />
                    </GridItem>
                  </Stack>
                );
              })}
            </GridItem>
          </Stack>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default TaskModal;
