// libraries
import { useState, useEffect,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import menuApi from '@api/system/menuApi';
import roleApi from '@api/system/roleApi';
import { isNull } from 'lodash';
function RoleModal({ alertOpen, setModalOpen, modalParams, getRoleList }) {
  // 파라미터
  const { flag, id } = modalParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  roleApi.axios = instance;
  menuApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      roleName: '',
      roleCode: '',
      menuId: '',
    },
  });
  // 서버 리턴 후 메시지 처리 변수
  let resultMessage;
  // 수정팝업여부 상태값
  const [isUpdate, setIsUpdate] = useState(true);
  // 메뉴정보 상태값
  const [menuList, setMenuList] = useState([]);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 메뉴정보 출력
    getMenuList();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, []);
  // 메뉴정보 출력
  const getMenuList = async () => {
    const resultMenuList = await apiCall(menuApi.getMenuList, {
      useYn: 'Y',
      isMenu: false,
    });
    if (resultMenuList.status === 200) {
      const roleArr = [];
      // 메뉴리스트 생성(재귀함수)
      recursiveMenu({ list: resultMenuList.data.menuList, roleArr });
      setMenuList(roleArr);
      // 변경모드 세팅
      if (flag === 'update') {
        // 선택된 역할상세 출력
        await getRoleDetails();
        setIsUpdate(true);
      }
    }
  };
  // 선택된 역할상세 출력
  const getRoleDetails = async () => {
    const result = await apiCall(roleApi.getRoleDetails, id);
    if (result.status === 200) {
      for (const key in result.data) {
        if (!isNull(result.data[`${key}`])) {
          methods.setValue(key, result.data[`${key}`]);
        }
      }
    }
  };
  // 메뉴리스트 생성(재귀함수)
  const recursiveMenu = ({ list, roleArr }) => {
    list.map((data) => {
      if (data.type === 'item') roleArr.push({ value: data.menuId, label: data.menuName });
      else if (data.children.length !== 0) recursiveMenu({ list: data.children, roleArr });
    });
  };
  // 입력한 역할정보 저장
  const insertRole = async (data) => {
    const result = await apiCall(roleApi.insertRole, data);
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
          getRoleList();
        },
      });
    }
  };
  // 변경한 역할정보 저장
  const updateRole = async (data) => {
    const result = await apiCall(roleApi.updateRole, data);
    if (result.status === 200) {
      if (result.data === 1) {
        resultMessage = '롤 정보가 수정되었습니다.';
      } else {
        resultMessage = '롤 정보 수정에 실패하였습니다.';
      }
      openModal({
        message: resultMessage,
        onConfirm: () => {
          setModalOpen(false);
          getRoleList();
        },
      });
    }
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="sm"
        fullWidth
        callBack={methods.handleSubmit(flag === 'insert' ? insertRole : updateRole)}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title={`롤 ${flag === 'insert' ? '작성' : '수정'}`}
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
                label="메뉴 명"
                name="menuId"
                disabled={!isUpdate}
                list={menuList}
                labelBackgroundFlag
              />
              <LabelInput
                typingCheck
                onlyNumber
                required
                maxLength={1}
                label="롤 코드"
                name="roleCode"
                disabled={!isUpdate}
                placeholder="롤 코드"
                labelBackgroundFlag
              />
              <LabelInput
                typingCheck
                required
                maxLength={50}
                label="롤 명칭"
                name="roleName"
                disabled={!isUpdate}
                placeholder="롤 명칭"
                labelBackgroundFlag
              />
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('롤수정 화면로딩... ')} */}
    </>
  );
}

RoleModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default RoleModal;
