// libraries
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState,useRef } from 'react';
// components
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
// functions
import useApi from '@modules/hooks/useApi';
import groupApi from '@api/system/groupApi';
function GroupModal({
  alertOpen,
  setModalOpen,
  modalParams,
  groupList = [],
  deleteYnCodeList,
  groupDivisionCodeList,
  getGroupList,
}) {
  // 파라미터
  const { flag, id } = modalParams;
  // API 호출 함수
  const [apiCall, openModal] = useApi();

  const [pGroupList, setPgroupList] = useState(
    groupList.map((group) => ({ label: group.groupName, value: group.id })),
  );
  // 서버 리턴 후 메시지 처리 변수
  let resultMessage;
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      groupName: '',
      groupPid: '',
      groupDivision: '',
      deleteYn: '',
    },
  });
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    
    if (flag === 'update' && id) {
      const getGroupDetails = async () => {
        const result = await apiCall(groupApi.getGroupDetails, id);
        // 조회 정보 set.
        if (result.status === 200) {
          for (const key in result.data) {
            methods.setValue(key, result.data[`${key}`]);
          }

          const groupDivision = result.data.groupDivision;

          // 부모그룹 목록 저장, 현재 선택한 그룹을 제외하고 그룹 구분이 일치하는 그룹 목록 생성.
          setPgroupList(
            groupList
              .filter((group) => group.groupDivision === groupDivision && group.id !== id)
              .map((group) => ({ label: group.groupName, value: group.id })),
          );
        }
      };

      getGroupDetails();
    }
  }, []);

  
  // 입력한 그룹정보 저장
  const insertGroup = async (data) => {
    const result = await apiCall(groupApi.insertGroup, data);
    if (result.status === 200) {
      if (result.data === 1) {
        resultMessage = '롤 정보가 등록 되었습니다.';
      } else {
        resultMessage = '롤 정보 등록에 실패하였습니다.';
      }
      openModal({
        message: resultMessage,
        onConfirm: () => {
          setModalOpen(false);
          getGroupList();
        },
      });
    }
  };
  // 입력한 그룹정보 수정
  const updateGroup = async (data) => {
    const result = await apiCall(groupApi.updateGroup, data);
    if (result.status === 200) {
      if (result.data === 1) {
        resultMessage = '롤 정보가 수정 되었습니다.';
      } else {
        resultMessage = '롤 정보 수정에 실패하였습니다.';
      }
      openModal({
        message: resultMessage,
        onConfirm: () => {
          setModalOpen(false);
          getGroupList();
        },
      });
    }
  };
  // Select박스 변경 이벤트
  const handleChange = ({ value, name }) => {
    // 그룹 구분값이 변경되면, 부모 그룹 목록 선택값 초기화.
    if (methods.getValues(name) !== value) methods.setValue('groupPid', '');
    // 부모 그룹 목록 저장, 현재 선택한 그룹을 제외하고 select에서 선택한 그룹 구분과 일치하는 그룹 목록 생성.
    setPgroupList(
      groupList
        .filter((group) => group.groupDivision === value && group.id !== id)
        .map((group) => ({ label: group.groupName, value: group.id })),
    );
    return value;
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="sm"
        fullWidth
        callBack={methods.handleSubmit(flag === 'insert' ? insertGroup : updateGroup)}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title={`그룹 ${flag === 'insert' ? '추가' : '수정'}`}
      >
        <FormProvider {...methods}>
          <form id="groupModal">
            <GridItem
              container
              borderFlag
              divideColumn={1}
              sx={{
                '& .text': { maxWidth: '180px', minWidth: '180px' },
                '.inputBox': { width: '310px' },
              }}
            >
              <LabelInput required label="그룹명" name="groupName" labelBackgroundFlag />
              <LabelInput
                required
                type="select"
                label="그룹 구분"
                name="groupDivision"
                list={groupDivisionCodeList}
                labelBackgroundFlag
                onHandleChange={handleChange}
              />
              <LabelInput
                type="select"
                label="부모그룹"
                name="groupPid"
                list={pGroupList}
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="삭제여부"
                name="deleteYn"
                list={deleteYnCodeList}
                labelBackgroundFlag
              />
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('그룹추가/수정 화면로딩... ')} */}
    </>
  );
}

export default GroupModal;
