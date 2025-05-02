import { useSelector } from 'react-redux';

// material-ui
import { Box } from '@mui/material';

// project import
import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const menuList = useSelector((state) => state.menu.menuItem.items);

  return (
    <Box sx={{ '& > ul:first-of-type': { mt: 0 } }}>
      {menuList?.map((item) => (
        <NavGroup key={item.menuId} item={item} />
      ))}
    </Box>
  );
};

export default Navigation;
