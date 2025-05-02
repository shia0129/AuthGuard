import { useEffect, useState, useRef } from 'react';
import Layout from '@components/layouts';
import MainCard from '@components/mantis/MainCard';
import GridItem from '@components/modules/grid/GridItem';
import { Button, Typography } from '@mui/material';
import useApi from '@modules/hooks/useApi';
import { FormProvider, useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import useConfirmModal from '@modules/hooks/useConfirmModal';
// import defaultCertApi from '@api/hss/common/systemManage/defaultCertApi';
import { AuthInstance } from '@modules/axios';
import Loader from '@components/mantis/Loader';

function DefaultCertManage() {
  const { instance, source } = AuthInstance();
  // defaultCertApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const openConfirmModal = useConfirmModal();
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm();
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    return () => {
      source.cancel();
    };
  }, []);

  const handleSubmitDefaultCertConfig = async () => {
    setIsLoading(true);

    // const result = await apiCall(defaultCertApi.defaultCert);

    // setIsLoading(false);

    // if (result.status === 200) {
    //   const message = '설정 초기화를 시작합니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       signOut({ callbackUrl: '/common/login' });
    //     },
    //   });
    // } else {
    //   const message = '설정 초기화에 실패하였습니다.';
    //   openModal({
    //     message,
    //   });
    // }
  };

  const openActionConfirmModal = () => {
    openConfirmModal({
      message: '설정 초기화를 하시겠습니까?',
      confirmButtonText: '확인',
      methods,
      onConfirm: () => handleSubmitDefaultCertConfig(),
    });
  };

  return (
    <>
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        {/* <form>
          <GridItem divideColumn={1} spacing={2}>
            <MainCard>
              <Typography lineHeight={2.5} color="textPrimary" component="div">
                <strong style={{ color: '#d32f2f' }}>설정 초기화</strong>를 진행하면 현재의 모든
                사용자 설정이 기본값으로 되돌아갑니다.
                <br />이 작업은 <strong style={{ color: '#d32f2f' }}>취소할 수 없으며</strong>, 설정
                초기화 후에는 시스템 <strong>재시작이 필요합니다</strong>.
                <br />
                <strong>초기화를 진행하시겠습니까?</strong>
              </Typography>
            </MainCard>
            <GridItem item directionHorizon="end">
              <Button variant="contained" onClick={openActionConfirmModal}>
                초기화
              </Button>
            </GridItem>
          </GridItem>
        </form> */}
      </FormProvider>
    </>
  );
}

DefaultCertManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DefaultCertManage;
