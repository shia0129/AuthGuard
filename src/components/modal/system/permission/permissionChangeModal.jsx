// libraries
import { useState, useCallback, useEffect,useRef } from 'react';
// components
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import PopUp from '@components/modules/common/PopUp';
// functions
import HsLib from '@modules/common/HsLib';
import permissionApi from '@api/system/permissionApi';
import useApi from '@modules/hooks/useApi';

function PermissionChangeModal({
  open,
  close,
  parameters,
  resetParameters,
  changeParameters,
  checkList,
  setCheckList,
  callBack,
}) {
  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();
  // 권한 목록(Select박스) 상태값
  const [rankList, setRankList] = useState([]);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 권한 목록(Select박스) 출력
    const getPermissionRankList = async () => {
      const { userPermissionId } = await HsLib.getTokenPayload();
      const result = await apiCall(permissionApi.getPermissionRankList, { userPermissionId });
      if (result.status === 200) setRankList(result.data);
    };
    getPermissionRankList();
  }, []);
  // 선택된 사용자의 권한 변경
  const updateUserPermission = useCallback(async () => {
    let checkListId = [];
    if (checkList.length !== 0) {
      checkList.map((checkData) => {
        checkListId.push(checkData.id);
      });
    }
    const result = await apiCall(permissionApi.updateUserPermission, {
      adminList: checkListId,
      changeUserPermissionId: parameters.changePermissionId,
    });
    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 처리되었습니다.`,
        onConfirm: () => callBack(parameters),
      });
      setCheckList([]);
      resetParameters();
      return true;
    }
  }, [parameters, callBack]);
  // JSX
  return (
    <PopUp
      title="사용자 권한 변경"
      alertOpen={open}
      closeAlert={close}
      callBack={updateUserPermission}
    >
      <LabelInput
        direction="row"
        type="select"
        size="small"
        name="changePermissionId"
        value={parameters.changePermissionId}
        onChange={changeParameters}
        list={rankList}
      />
    </PopUp>
  );
}

PermissionChangeModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PermissionChangeModal;
