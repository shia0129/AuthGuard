import TimeGroupStatus from '@components/hss/sslswg/policy/policyDetailManage/timeGroupStatus';
import TimeStatus from '@components/hss/sslswg/policy/policyDetailManage/timeStatus';
import Layout from '@components/layouts';
import TabTheme from '@components/modules/tab/TabTheme';
import { useState } from 'react';

const tabList = [
  {
    label: '스케줄 그룹',
    value: 'timeGroupStatus',
  },
  {
    label: '스케줄',
    value: 'timeStatus',
  },
];

function TimeManage() {
  const [tabValues, setTabValues] = useState('timeStatus');

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
      {tabValues === 'timeGroupStatus' && <TimeGroupStatus />}
      {tabValues === 'timeStatus' && <TimeStatus />}
    </>
  );
}

TimeManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default TimeManage;
