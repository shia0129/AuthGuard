import PatternGroupStatus from '@components/hss/sslswg/policy/policyDetailManage/patternGroupStatus';
import PatternStatus from '@components/hss/sslswg/policy/policyDetailManage/patternStatus';
import Layout from '@components/layouts';
import TabTheme from '@components/modules/tab/TabTheme';
import { useRouter } from 'next/router';
import { useEffect, useState,useRef } from 'react';

const tabList = [
  {
    label: '패턴 그룹',
    value: 'patternGroupStatus',
  },
  {
    label: '패턴',
    value: 'patternStatus',
  },
];

function PatternManage() {
  const router = useRouter();
  const { tab } = router.query;
  const [tabValues, setTabValues] = useState(tab || 'patternStatus');
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
      {tabValues === 'patternGroupStatus' && <PatternGroupStatus />}
      {tabValues === 'patternStatus' && <PatternStatus />}
    </>
  );
}

PatternManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PatternManage;
