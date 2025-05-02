import SiteGroupStatus from '@components/hss/sslswg/policy/policyDetailManage/siteGroupStatus';
import SiteStatus from '@components/hss/sslswg/policy/policyDetailManage/siteStatus';
import Layout from '@components/layouts';
import TabTheme from '@components/modules/tab/TabTheme';
import { useRouter } from 'next/router';
import { useEffect, useState,useRef } from 'react';

const tabList = [
  {
    label: '사이트 그룹',
    value: 'siteGroupStatus',
  },
  {
    label: '사이트',
    value: 'siteStatus',
  },
];

function SiteManage() {
  const router = useRouter();
  const { tab } = router.query;
  const [tabValues, setTabValues] = useState(tab || 'siteStatus');
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
      {tabValues === 'siteGroupStatus' && <SiteGroupStatus />}
      {tabValues === 'siteStatus' && <SiteStatus />}
    </>
  );
}

SiteManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SiteManage;
