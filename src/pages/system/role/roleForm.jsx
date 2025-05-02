import { useState, useEffect,useRef } from 'react';
import { useRouter } from 'next/router';
import { AuthInstance } from '@modules/axios';
import { FormProvider, useForm } from 'react-hook-form';

//Project import
import Layout from '@components/layouts';
import roleApi from '@api/system/roleApi';
import MainCard from '@components/mantis/MainCard';
import useApi from '@modules/hooks/useApi';
import LabelInput from '@components/modules/input/LabelInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import ConfirmPop from '@components/modules/popover/ConfirmPop';
import menuApi from '@api/system/menuApi';

const recursiveMenu = ({ list, roleArr }) => {
  list.map((data) => {
    if (data.type === 'item') roleArr.push({ value: data.menuId, label: data.menuName });
    else if (data.children.length !== 0) recursiveMenu({ list: data.children, roleArr });
  });
};
function RoleForm() {
  const { instance, source } = AuthInstance();

  roleApi.axios = instance;
  menuApi.axios = instance;

  const router = useRouter();

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  const { flag, id } = router.query;

  const methods = useForm({
    defaultValues: {
      roleName: '',
      roleCode: '',
      menuId: '',
    },
  });
  const [isUpdate, setIsUpdate] = useState(true);

  const [menuList, setMenuList] = useState([]);

  // PopOver 엘리먼트
  const [popTarget, setPopTarget] = useState(null);

  // 정보 변경후 리턴 페이지 주소
  const returnUrl = '/system/role/roleList';
  // 서버 리턴 후 메시지 처리 변수.
  let resultMessage;
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const getMenuList = async () => {
      const resultMenuList = await apiCall(menuApi.getMenuList, {
        useYn: 'Y',
        isMenu: false,
      });
      if (resultMenuList.status === 200) {
        const roleArr = [];
        recursiveMenu({ list: resultMenuList.data.menuList, roleArr });

        setMenuList(roleArr);
      }
    };
    getMenuList();

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
    if (flag === 'update') {
      const getRoleDetails = async () => {
        const result = await apiCall(roleApi.getRoleDetails, id);
        if (result.status === 200) {
          for (const key in result.data) {
            methods.setValue(key, result.data[`${key}`]);
          }
        }
      };
      getRoleDetails();
      setIsUpdate(true);
    }
    return () => {
      source.cancel();
    };
  }, [flag, id]);

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
        onConfirm: () => router.push(returnUrl),
      });
    }
  };

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
        onConfirm: () => router.push(returnUrl),
      });
    }
  };

  return (
    <MainCard
      title={`롤 ${flag === 'insert' ? '작성' : '수정'}`}
      border={false}
      className="tableCard"
      sx={{ width: '700px' }}
    >
      <FormProvider {...methods}>
        <form
          id="roleForm"
          onSubmit={methods.handleSubmit(flag === 'insert' ? insertRole : updateRole)}
        >
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
          <GridItem item directionHorizon="end" sx={{ mt: 1 }}>
            <ButtonSet
              options={[
                {
                  label: '저장',
                  callBack: (event) => setPopTarget(event.currentTarget),
                  role: flag,
                  color: 'primary',
                },
                {
                  label: '취소',
                  callBack: () => router.push(returnUrl),
                },
              ]}
            />
          </GridItem>
          <ConfirmPop name="roleForm" anchorEl={popTarget} anchorChange={setPopTarget} />
        </form>
      </FormProvider>
    </MainCard>
  );
}

RoleForm.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default RoleForm;
