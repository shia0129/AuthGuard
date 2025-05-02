import Layout from "@components/layouts";
import { AuthInstance } from "@modules/axios";
import HsLib from "@modules/common/HsLib";
import useApi from "@modules/hooks/useApi";
import { useEffect, useState,useRef } from "react";
import { useForm } from "react-hook-form";
import { Tab, Tabs, Tooltip } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled, useTheme } from "@mui/styles";
import useConfirmModal from "@modules/hooks/useConfirmModal";
import adminApi from "@api/system/adminApi";
import deptListApi from "@api/system/deptListApi";
import { TabContext } from "@mui/lab";
import DeptInfoTab from "./deptInfoTab";
import OtherApproveTab from "./otherApproveTab";

const initInfos = {
  userId: '',
  userName: '',
  startUseDate: '',
  endUseDate: '',
  userPermissionId: '',
  deleteYn: '',
};

function DeptEditPopup() {

  const { instance } = AuthInstance();
  deptListApi.axios = instance;

  // tab 클릭 이벤트 함수
  const [tabValue, setTabValue] = useState(0);

  const methods = useForm({
    defaultValues: initInfos,
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 팝업 사이즈 조절
    HsLib.windowResize(1290, 565);

    init();
  }, []);

  const init = async () => {};

  return (
    <>
        <Tabs value={tabValue}
              indicatorColor="primary"
              onChange={(event, newValue) => {
                setTabValue(newValue);
              }}
              aria-label="dept info detail"
              variant="scrollable">
          <Tab label="부서정보" />
          <Tab label="겸직자관리" />
        </Tabs>
        <DeptInfoTab value={tabValue} index={0} />
        <OtherApproveTab value={tabValue} index={1} />
    </>
  );
}

DeptEditPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="popup" title="부서정보 수정">
      {page}
    </Layout>
  );
};

export default DeptEditPopup;
