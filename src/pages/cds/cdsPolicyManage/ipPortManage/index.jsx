import IpGroupStatus from '@components/cds/cdsPolicyManage/ipPortManage/tabs/ipGroupStatus';
import IpStatus from '@components/cds/cdsPolicyManage/ipPortManage/tabs/ipStatus';
import PortStatus from '@components/cds/cdsPolicyManage/ipPortManage/tabs/portStatus';
import Layout from '@components/layouts';
import TabTheme from '@components/modules/tab/TabTheme';
import { setParameters } from '@modules/redux/reducers/ipStatus';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const tabList = [
  {
    label: 'IP 그룹 현황',
    value: 'ipGroup',
  },
  {
    label: 'IP 현황',
    value: 'ipStatus',
  },
  {
    label: 'Port 현황',
    value: 'portStatus',
  },
];

function IpPortManage() {
  const dispatch = useDispatch();
  const [tabValues, setTabValues] = useState('ipGroup');

  const handleIpClick = (item) => {
    setTabValues('ipStatus');
    dispatch(setParameters({ name: item, page: 0, ipLength: '', hostType: '', location: '' }));
  };

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
      {tabValues === 'ipGroup' && <IpGroupStatus />}
      {tabValues === 'ipStatus' && <IpStatus />}
      {tabValues === 'portStatus' && <PortStatus />}
    </>
  );
}

IpPortManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default IpPortManage;
