// libraries
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Tabs, Tab } from '@mui/material';
// components
import Layout from '@components/layouts';
import Page from '@components/mantis/Page';
import Permission from '@components/tabs/permission/Permission';
import Users from '@components/tabs/permission/Users';
function PermissionTab() {
  // Router Hook(페이지 이동, 쿼리 파라미터 처리)
  const router = useRouter();
  // 쿼리 파라미터 처리
  const { flag, id, rank } = router.query;
  // 선택된 탭 상태값
  const [selectedTab, setSelectedTab] = useState('permissionForm');
  // 탭 변경 이벤트
  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
    router.push({
      pathname: `/system/permission/${newValue}`,
      query: {
        flag,
        id,
        rank,
      },
    });
  };
  // JSX
  return (
    <Page>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: 'calc(100% + 48px)',
          position: 'relative',
          left: '-24px',
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{ marginLeft: '25px', '& span.MuiTabs-indicator': { height: '3px' } }}
        >
          <Tab label="권한" value="permissionForm" />
          {flag !== 'insert' && <Tab label="사용자" value="users" />}
        </Tabs>
      </Box>
      <Box sx={{ mt: 1 }}>
        {selectedTab === 'permissionForm' && <Permission flag={flag} permissionId={id} />}
        {selectedTab === 'users' && <Users permissionId={id} rank={rank} />}
      </Box>
    </Page>
  );
}

PermissionTab.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export default PermissionTab;
