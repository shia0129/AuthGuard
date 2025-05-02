import SrcIpGroupStatus from '@components/hss/sslswg/policy/policyDetailManage/srcIpGroupStatus';
import SrcIpStatus from '@components/hss/sslswg/policy/policyDetailManage/srcIpStatus';
import Layout from '@components/layouts';
import TabTheme from '@components/modules/tab/TabTheme';
import { useRouter } from 'next/router';
import { useEffect, useState,useRef } from 'react';

const tabList = [
  {
    label: '출발지IP 그룹',
    value: 'srcIpGroupStatus',
  },
  {
    label: '출발지IP',
    value: 'srcIpStatus',
  },
];

function SrcIpManage() {
  const router = useRouter();
  const { tab } = router.query;
  const [tabValues, setTabValues] = useState(tab || 'srcIpStatus');
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (tab && tabList.some((t) => t.value === tab)) {
      setTabValues(tab);
    }
  }, [tab]);

  return (
    <>
      <TabTheme
        tabsValue={tabValues}
        onChange={(_, newValue) => {
          setTabValues(newValue);
        }}
        tabOutline
        tabList={tabList}
      />
      {tabValues === 'srcIpGroupStatus' && <SrcIpGroupStatus />}
      {tabValues === 'srcIpStatus' && <SrcIpStatus />}
    </>
  );
}

SrcIpManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SrcIpManage;
