import { DashboardOutlined } from '@ant-design/icons';
import {
  PeopleAlt,
  ListAlt,
  Info,
  Handyman,
  Menu,
  ManageAccounts,
  DataObject,
  RateReview,
  DashboardCustomize,
  Lan,
  WorkspacePremium,
  Group,
  SettingsApplications,
  AccountTree,
  Groups,
  DriveFileMove,
  DataThresholding,
  MarkAsUnread,
  AllInbox,
  SettingsInputAntenna,
  Troubleshoot,
  PendingActions,
  ChromeReaderMode,
  ScreenSearchDesktop,
  SnippetFolder,
  SystemUpdateAlt,
  PestControl,
  Settings,
  Cast,
  DynamicForm,
  DisplaySettings,
  AdminPanelSettings,
  HistoryEdu,
  ManageSearch,
  Language,
  CoPresent,
  PersonOff,
  Download,
  NotificationsActive,
  Policy,
  Approval,
  Filter,
  Route,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { createElement } from 'react';

const icons = {
  CoPresent,
  Language,
  ManageSearch,
  HistoryEdu,
  AdminPanelSettings,
  DisplaySettings,
  DynamicForm,
  Cast,
  Settings,
  PestControl,
  SystemUpdateAlt,
  SnippetFolder,
  ScreenSearchDesktop,
  ChromeReaderMode,
  PendingActions,
  Troubleshoot,
  SettingsInputAntenna,
  AllInbox,
  MarkAsUnread,
  DataThresholding,
  DriveFileMove,
  DashboardOutlined,
  ListAlt,
  Info,
  Handyman,
  Menu,
  ManageAccounts,
  DataObject,
  RateReview,
  DashboardCustomize,
  Lan,
  WorkspacePremium,
  Group,
  PeopleAlt,
  SettingsApplications,
  AccountTree,
  Groups,
  PersonOff,
  Download,
  NotificationsActive,
  Policy,
  Approval,
  Filter,
  Route,
};

const iconMap = (name) => {
  return icons[`${name}`] ? icons[`${name}`] : null;
};

const parseMenuIcon = (list) => {
  list.map((data) => {
    if (data.icon) data.icon = iconMap(data.icon);
    if (data.children) {
      parseMenuIcon(data.children);
    }
  });
};

const iconListGenerate = () => {
  return Object.keys(icons).reduce(
    (iconList, icon) => [
      ...iconList,
      {
        value: icon,
        label: (
          <Stack direction="row" alignItems="center">
            {createElement(icons[`${icon}`], {
              style: { marginRight: '0.5rem', fontSize: '1rem' },
            })}
            {icon}
          </Stack>
        ),
      },
    ],
    [],
  );
};

export { parseMenuIcon, iconMap, iconListGenerate };
