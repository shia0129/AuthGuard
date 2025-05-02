import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, List, Typography } from '@mui/material';

// project import
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import { AuthInstance } from '@modules/axios';
// import preferencesApi from '@api/system/preferencesApi';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const theme = useTheme();
  const menu = useSelector((state) => state.menu);
  // preferencesApi.axios = AuthInstance();

  const { drawerOpen, topMenuUseYn } = menu;

  const navCollapse =
    topMenuUseYn === 'Y' ? (
      item.children?.map((menuItem) => {
        switch (menuItem.type) {
          case 'collapse':
            return <NavCollapse key={menuItem.url} menu={menuItem} level={1} />;
          case 'item':
            return <NavItem key={menuItem.url} item={menuItem} level={1} />;
          default:
            return (
              <Typography key={menuItem.url} variant="h6" color="error" align="center">
                Fix - Group Collapse or Items
              </Typography>
            );
        }
      })
    ) : (
      <NavCollapse key={item.url} menu={item} level={1} />
    );

  if (!item.label.includes('(hidden)'))
    return (
      <List
        subheader={
          topMenuUseYn === 'Y' &&
          item.label &&
          drawerOpen && (
            <Box sx={{ pl: 3 }}>
              <Typography
                variant="subtitle2"
                color={theme.palette.mode === 'dark' ? 'textSecondary' : 'text.secondary'}
              >
                {item.label}
              </Typography>
              {item.caption && (
                <Typography variant="caption" color="secondary">
                  {item.caption}
                </Typography>
              )}
            </Box>
          )
        }
        sx={{ mt: topMenuUseYn === 'Y' && drawerOpen && item.label ? 1.5 : 0, py: 0, zIndex: 0 }}
      >
        {navCollapse}
      </List>
    );
  else return null;
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
