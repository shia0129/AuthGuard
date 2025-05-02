// libraries
import { useState, useEffect,useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// components
import Layout from '@components/layouts';
// functions
import ChangePasswordModal from '@components/modal/hss/common/accountManage/changePasswordModal';
import useApi from '@modules/hooks/useApi';
import adminApi from '@api/system/adminApi';
import { AuthInstance } from '@modules/axios';

function EmptyPage() {
  const { data: session, status, update: sessionUpdate } = useSession();
  const { push } = useRouter();
  const [apiCall, openModal] = useApi();
  // Axios 인트턴스(Http통신)
  const { instance } = AuthInstance();
  adminApi.axios = instance;

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 초기화 함수
    init();
  }, []);
  // 초기화 함수
  const init = async () => {
    // 선택된 관리자 정보 요청
    // const adminListDetail = await apiCall(adminApi.getAdminListDetail, id);
    // console.log(adminListDetail);
    // // 관리자권한 정보 요청
    // const adminPermissionList = await apiCall(adminApi.getAdminPermissionList);
    // // 패스워드규칙 요청
    // const passwordRulesList = await apiCall(preferencesApi.getPreferences, {
    //   configType: 'PASSWORD',
    // });
    // // 일괄 변경처리
    // if (adminListDetail.status === 200) {
    //   unstable_batchedUpdates(() => {
    //     // 선택된 관리자 정보 응답처리
    //     responseAdminListDetail(adminListDetail);
    //     // 관리자권한 응답처리
    //     responseAdminPermissionList(adminPermissionList);
    //     // 패스워드규칙 응답처리
    //     responsePasswordRulesList(passwordRulesList);
    //   });
    // }
    // 선택된 관리자 정보 요청
    // const adminListDetail = await apiCall(adminApi.getAdminListDetail, id);
    // console.log(adminListDetail);

    // push(session.user.firstPage);
    // console.log(session.user.userSeq);
    // 선택된 관리자 정보 요청
    
    const hsssessionid = session?.user.hsssessionid;
    const { data }  = await apiCall(
      adminApi.getAdminListDetail,
      { id:session.user.userSeq, hsssessionid:hsssessionid }
    );

    if (data.defaultPasswordYn === 'N') {
      // if (session.user.firstPage !== null) {
      // console.log(session.user.userSeq);
      // 선택된 관리자 정보 요청
      // const adminListDetail = await apiCall(adminApi.getAdminListDetail, session.user.userSeq);
      // console.log(adminListDetail);
      // await push('/common/emptyPage');
      push(session.user.firstPage);
      sessionUpdate({ isPasswordUpdate: true });
    } else if (!data?.errorYn) {
      setChangePasswordOpen(true);
    }
  };
  return (
    <>
      {changePasswordOpen && (
        <ChangePasswordModal
          open={changePasswordOpen}
          setOpen={setChangePasswordOpen}
          parent={'emptyPage'}
        />
      )}
    </>
  );
}

EmptyPage.getLayout = function getLayout(page) {
  return <Layout variant="blank">{page}</Layout>;
};

export default EmptyPage;
