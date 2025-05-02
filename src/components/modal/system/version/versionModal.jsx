// libraries
import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/material/styles';
import { GppGood, GppBad, Info } from '@mui/icons-material';
import { Stack, Typography, Tooltip } from '@mui/material';
import { unstable_batchedUpdates } from 'react-dom';
import moment from 'moment';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Label from '@components/modules/label/Label';
import PopUp from '@components/modules/common/PopUp';
// functions
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useConfirmModal from '@modules/hooks/useConfirmModal';
import versionApi from '@api/system/versionApi';
import preferencesApi from '@api/system/preferencesApi';
import { isNull } from 'lodash';
// Form 초기값 선언
const initInfos = {
  userId: '',
  userName: '',
  startUseDate: '',
  endUseDate: '',
  userPermissionId: '',
  allowIpYn: '',
  allowIpAddress: '',
  deleteYn: '',
};
function VersionModal({ open, setOpen }) {
  // Axios 인트턴스(Http통신)
  const { instance } = AuthInstance();
  versionApi.axios = instance;
  preferencesApi.axios = instance;
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
  }, []);
  // 초기화 함수
  const init = async () => {
    // 관리자권한 정보 요청
    const versionDetail = await apiCall(versionApi.getVersionDetail);
    if (versionDetail.status === 200) {
      setAdminInfos(versionDetail.data);
    }
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
              label="제품명"
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
              label="세부버전"
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
            <Label label="구성요소" labelBackgroundFlag>
              <GridItem
                container
                item
                columnSpacing={1}
                sx={{
                  '.CMM-gi-grid': {
                    paddingLeft: '0px !important',
                  },
                }}
              >
                <Label
                  label="SGServer"
                  labelBackgroundFlag
                  data={adminInfos?.sgServer}
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
                  label="WebManager"
                  labelBackgroundFlag
                  data={adminInfos?.webManager}
                  dataTooltipFlag={false}
                  boxSx={{
                    label: {
                      margin: '0 auto !important',
                      display: 'block !important',
                    },
                  }}
                />
              </GridItem>
            </Label>
          </GridItem>
        </form>
        {/* </FormProvider> */}
      </PopUp>
      {/* {console.log('VERSION팝업 화면로딩... ')} */}
    </>
  );
}

VersionModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default VersionModal;
