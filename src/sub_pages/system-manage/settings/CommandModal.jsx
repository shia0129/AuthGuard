// libraries
import { FormProvider, useForm } from 'react-hook-form';
import { isNull } from 'lodash';

// components
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';

// functions
import commandApi from '@api/system-manage/commandApi';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import { useEffect,useRef } from 'react';

function CommandModal({
  open,
  setOpen,
  modalParams = { flag: 'insert', systemList: [], commandTypeList: [] },
  getCommandList,
}) {
  // 파라미터
  const { flag, systemList, commandTypeList, data } = modalParams;
  const { instance, source } = AuthInstance();
  commandApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      systemId: '',
      command: '',
      groupCommand: '',
      commandType: '',
      taskName: '',
      description: '',
    },
  });

  // 서버 리턴 후 메시지 처리 변수
  let resultMessage;
  const useEffect_0001 = useRef(false);
  // 수정인 경우,
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (flag === 'update' && data) {
      for (let key in data) {
        if (!isNull(data[`${key}`])) {
          methods.setValue(key, data[`${key}`]);
        }
      }
    }
    return () => {
      source.cancel();
    };
  }, []);

  const saveCommand = async (data) => {
    const result = await apiCall(commandApi.saveCommand, {
      ...data,
      flag: flag === 'insert' ? 'I' : 'U',
    });

    if (result.status === 200) {
      if (result.data >= 1) {
        resultMessage = `커맨드 정보가 ${flag === 'insert' ? '등록' : '수정'} 되었습니다.`;
      } else {
        resultMessage = `커맨드 정보 ${flag === 'insert' ? '등록' : '수정'}에 실패하였습니다.`;
      }
      openModal({
        message: resultMessage,
        onConfirm: () => {
          setOpen(false);
          getCommandList();
        },
      });
    }
  };
  return (
    <PopUp
      maxWidth="sm"
      fullWidth
      callBack={methods.handleSubmit(saveCommand)}
      alertOpen={open}
      closeAlert={setOpen}
      title={`명령어 ${flag === 'insert' ? '생성' : '수정'}`}
    >
      <FormProvider {...methods}>
        <form id="roleModal">
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
              name="systemId"
              list={systemList}
              labelBackgroundFlag
            />
            <LabelInput
              required
              typingCheck
              maxLength={4}
              label="명령어"
              name="command"
              placeholder="명령어"
              labelBackgroundFlag
            />
            <LabelInput
              required
              typingCheck
              maxLength={4}
              label="그룹 명령어"
              name="groupCommand"
              placeholder="그룹 명령어"
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="명령어 구분"
              name="commandType"
              list={commandTypeList}
              labelBackgroundFlag
            />
            <LabelInput
              required
              typingCheck
              maxLength={64}
              label="테스크 명칭"
              name="taskName"
              placeholder="테스크 명칭"
              labelBackgroundFlag
            />
            <LabelInput
              typingCheck
              maxLength={128}
              label="설명"
              name="description"
              placeholder="설명"
              labelBackgroundFlag
            />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default CommandModal;
