// libraries
import { AuthInstance } from '@modules/axios';
import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
// components
import PopUp from '@components/modules/common/PopUp';
import ButtonSet from '@components/modules/button/ButtonSet';
import useConfirmModal from '@modules/hooks/useConfirmModal';
import useApi from '@modules/hooks/useApi';
import powerApi from '@api/hss/common/systemManage/powerApi';
import Loader from '@components/mantis/Loader';

function PowerModal({ open, setOpen, type = 'self' }) {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  powerApi.axios = instance;
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // 확인 팝업
  const openConfirmModal = useConfirmModal();
  const [isLoading, setIsLoading] = useState(false);
  // Form 객체(초기값 할당)
  const methods = useForm();
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    return () => {
      source.cancel();
    };
  }, []);

  const handlePowerAction = async (action) => {
    setIsLoading(true);

    const apiMethod = action === 'shutdown' ? powerApi.shutdown : powerApi.reboot;
    const result = await apiCall(apiMethod);

    setIsLoading(false);

    if (result.status === 200) {
      const message = action === 'shutdown' ? '장비가 종료됩니다.' : '장비가 재시작됩니다.';
      openModal({
        message,
        onConfirm: () => {
          signOut({ callbackUrl: '/common/login' });
        },
      });
    } else {
      const message =
        action === 'shutdown' ? '장비 종료에 실패하였습니다.' : '장비 재시작에 실패하였습니다.';
      openModal({
        message,
        onConfirm: () => {
          closeModal(true);
        },
      });
    }
  };

  const openActionConfirmModal = (action) => {
    openConfirmModal({
      message: action === 'shutdown' ? '장비를 종료하시겠습니까?' : '장비를 재시작하시겠습니까?',
      confirmButtonText: action === 'shutdown' ? '종료' : '재시작',
      target: 'powerControlForm',
      methods,
      onConfirm: () => handlePowerAction(action),
    });
  };

  // 닫기
  const closeModal = (result = false) => {
    setOpen(result);
  };

  // JSX
  return (
    <PopUp
      title="전원 관리"
      alertOpen={open}
      closeAlert={closeModal}
      maxWidth="xs"
      fullWidth
      disableCancel
      disableConfirm
      sx={
        type === 'others'
          ? {
              '& .MuiDialog-container': {
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '450px',
                },
              },
            }
          : {}
      }
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="powerControlForm" onSubmit={methods.handleSubmit(() => {})}>
          <ButtonSet
            sx={{ mt: 2, justifyContent: 'center' }}
            options={[
              {
                label: '장비 종료',
                callBack: () => openActionConfirmModal('shutdown'),
              },
              {
                label: '장비 재시작',
                callBack: () => openActionConfirmModal('reboot'),
              },
            ]}
          />
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default PowerModal;
