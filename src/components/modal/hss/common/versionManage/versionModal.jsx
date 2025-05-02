// libraries
import { useEffect, useState, useRef } from 'react';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import Label from '@components/modules/label/Label';
import PopUp from '@components/modules/common/PopUp';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import versionApi from '@api/hss/common/systemManage/versionApi';
// Form 초기값 선언
function VersionModal({ open, setOpen }) {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  versionApi.axios = instance;
  // API 호출 함수
  const [apiCall] = useApi();
  // 관리자 정보 상태값
  const [adminInfos, setAdminInfos] = useState(null);
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

    return () => {
      source.cancel();
    };
  }, []);
  // 초기화 함수
  const init = async () => {
    // 관리자권한 정보 요청
    const versionDetail = await apiCall(versionApi.getVersionDetail);
    setAdminInfos(versionDetail);
  };
  // JSX
  return (
    <>
      <PopUp maxWidth="sm" fullWidth alertOpen={open} closeAlert={setOpen} title={`VERSION`}>
        {/* <FormProvider {...methods}> */}
        <form id="versionInfo">
          <GridItem
            container
            item
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '155px', minWidth: '155px' },
              '.inputBox': { maxWidth: '155px', minWidth: '155px' },
            }}
          >
            <Label
              label="OS명"
              labelBackgroundFlag
              data={adminInfos?.productName}
              dataTooltipFlag={false}
              boxSx={{
                label: {
                  margin: '0 auto !important',
                  display: 'block !important',
                  alignItems: 'center',
                },
              }}
            />
            <Label
              label="버전"
              labelBackgroundFlag
              data={adminInfos?.detailVersion}
              dataTooltipFlag={false}
              boxSx={{
                label: {
                  margin: '0 auto !important',
                  display: 'block !important',
                  alignItems: 'center',
                },
              }}
            />
          </GridItem>
        </form>
      </PopUp>
    </>
  );
}

VersionModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default VersionModal;
