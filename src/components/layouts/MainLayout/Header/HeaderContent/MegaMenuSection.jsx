import { useRef, useState } from 'react';

// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  CardMedia,
  ClickAwayListener,
  Grid,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
// project import
import MainCard from '@components/mantis/MainCard';
import Dot from '@components/@extended/Dot';
import IconButton from '@components/@extended/IconButton';
import Transitions from '@components/@extended/Transitions';
import { drawerWidth } from 'src/config';

// assets
import { WindowsOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const backgroundVector = '/assets/images/mega-menu/back.svg';
const Reader = '/assets/images/mega-menu/reader.svg';

// ==============================|| HEADER CONTENT - MEGA MENU SECTION ||============================== //

const makeMenuList = (menuList, level, setOpen) => {
  return menuList.map((menu) => {
    return (
      <List
        key={menu.menuId}
        component="nav"
        sx={{
          ml: 2 * level,
          '.css-1ua9cuz-MuiListSubheader-root': { position: 'relative' },
          '.css-11uayp4-MuiListSubheader-root': { position: 'relative' },
        }}
        subheader={
          <ListSubheader>
            <Typography variant="subtitle1" color={level === 0 ? 'textPrimary' : 'textSecondary'}>
              {menu.label}
            </Typography>
          </ListSubheader>
        }
      >
        {menu.children.map((child) =>
          child.children.length === 0 ? (
            <NextLink
              key={child.menuId}
              href={child.url}
              style={{
                textDecoration: 'none',
                color: 'black',
              }}
              passHref
            >
              <ListItemButton
                disableRipple
                component={Link}
                sx={{ ml: 2 * level }}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <Dot size={7} color="secondary" variant="outlined" />
                </ListItemIcon>
                <ListItemText primary={child.label} />
              </ListItemButton>
            </NextLink>
          ) : (
            makeMenuList([child], level + 1, setOpen)
          ),
        )}
      </List>
    );
  });
};

const MegaMenuSection = () => {
  const theme = useTheme();
  const topMenuItems = useSelector((state) => state.menu.menuItem.topItems);

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.100';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.0';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75, pb: 0 }}>
      <IconButton
        size="large"
        color="secondary"
        variant="light"
        sx={{
          color: 'text.primary',
          bgcolor: open ? iconBackColorOpen : iconBackColor,
          '&:hover': {
            bgcolor: iconBackColorOpen,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <WindowsOutlined />
      </IconButton>
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-180, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                minWidth: 750,
                width: {
                  md: `calc(100vw - 100px)`,
                  lg: `calc(100vw - ${drawerWidth + 100}px)`,
                  xl: `calc(100vw - ${drawerWidth + 140}px)`,
                },
                maxWidth: 1024,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <Grid container>
                    <Grid
                      item
                      md={4}
                      sx={{
                        background: `url(${backgroundVector}), linear-gradient(183.77deg, ${theme.palette.primary.main} 11.46%, ${theme.palette.primary[700]} 100.33%)`,
                      }}
                    >
                      <Box sx={{ p: 4.5, pb: 3, height: '100%' }}>
                        <Stack
                          sx={{ color: 'background.paper', height: '100%' }}
                          justifyContent="space-between"
                        >
                          <Stack>
                            <Typography variant="h2" sx={{ fontSize: '1.875rem', mb: 1 }}>
                              전체 메뉴
                            </Typography>
                            <Typography variant="h6">접근하고자 하는 메뉴를 선택하세요.</Typography>
                          </Stack>
                          <CardMedia
                            component="img"
                            src={Reader}
                            alt="Reader"
                            sx={{ width: 300, mt: 5 }}
                          />
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid item md={8}>
                      <OverlayScrollbarsComponent>
                        <Box
                          sx={{
                            p: 4,
                            maxHeight: 500,
                            '& .MuiList-root': {
                              pb: 0,
                            },
                            '& .MuiListSubheader-root': {
                              p: 0,
                              pb: 1.5,
                            },
                            '& .MuiListItemButton-root': {
                              p: 0.5,
                              '&:hover': {
                                background: 'transparent',
                                '& .MuiTypography-root': {
                                  color: 'primary.main',
                                },
                              },
                            },
                          }}
                        >
                          <GridItem container divideColumn={topMenuItems.length} rowSpacing={2}>
                            {makeMenuList(topMenuItems, 0, setOpen)}
                          </GridItem>
                        </Box>
                      </OverlayScrollbarsComponent>
                    </Grid>
                  </Grid>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default MegaMenuSection;
