import AccountGroup from '@components/hss/common/accountManage/accountGroup';
import Account from '@components/hss/common/accountManage/account';

import Layout from '@components/layouts';
import TabTheme from '@components/modules/tab/TabTheme';
import { useState } from 'react';

const tabList = [
  {
    label: '계정 그룹',
    value: 'accountGroup',
  },
  {
    label: '계정',
    value: 'account',
  },
];

function AccountManage() {
  const [tabValues, setTabValues] = useState('account');

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
      {tabValues === 'accountGroup' && <AccountGroup />}
      {tabValues === 'account' && <Account />}
    </>
  );
}

AccountManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AccountManage;
