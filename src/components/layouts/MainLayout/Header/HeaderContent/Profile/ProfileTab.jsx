import PropTypes from 'prop-types';
import { useState } from 'react';
import { useRouter } from 'next/router';
// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { LogoutOutlined, KeyOutlined, ToolOutlined } from '@ant-design/icons';
import ChangePasswordModal from '@components/modal/hss/common/accountManage/changePasswordModal';
import VersionModal from '@components/modal/hss/common/versionManage/versionModal';
import PowerModal from '@components/modal/hss/common/powerManage/powerModal';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({
  changePasswordOpen,
  setChangePasswordOpen,
  versionOpen,
  setVersionOpen,
  powerOpen,
  setPowerOpen,
  handleLogout,
}) => {
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton
        onClick={() => {
          setChangePasswordOpen(true);
        }}
      >
        <ListItemIcon>
          <KeyOutlined />
        </ListItemIcon>
        <ListItemText primary="비밀번호 변경" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          setVersionOpen(true);
        }}
      >
        <ListItemIcon>
          <ToolOutlined />
        </ListItemIcon>
        <ListItemText primary="VERSION" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          setPowerOpen(true);
        }}
      >
        <ListItemIcon>
          <ToolOutlined />
        </ListItemIcon>
        <ListItemText primary="전원 관리" />
      </ListItemButton>

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="로그아웃" />
      </ListItemButton>

      {changePasswordOpen && (
        <ChangePasswordModal open={changePasswordOpen} setOpen={setChangePasswordOpen} />
      )}

      {powerOpen && <PowerModal open={powerOpen} setOpen={setPowerOpen} />}

      {versionOpen && <VersionModal open={versionOpen} setOpen={setVersionOpen} />}
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func,
};

export default ProfileTab;
