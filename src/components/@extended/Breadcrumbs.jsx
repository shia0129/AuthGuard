import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

// material-ui
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, IconButton, Stack, Typography } from '@mui/material';

// project imports
import MainCard from '@components/mantis/MainCard';
import { iconMap } from '@modules/common/menuParser';
import { setSelectedCollapse } from '@modules/redux/reducers/menu';

// assets
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import useConfig from '@modules/hooks/useConfig';

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({
  card,
  divider = true,
  maxItems,
  rightAlign,
  separator,
  title,
  titleBottom,
  sx,
  ...others
}) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const isMountedRef = useRef(false);
  const [main, setMain] = useState([]);
  const [item, setItem] = useState(null);

  const { menuItem: { items } } = useSelector((state) => state.menu);
  const { fullSizeFlag, onChangeFullSizeFlag } = useConfig();

  const currentPath = router.pathname;

  const getCollapse = (menu, mainArr = []) => {
    try {
      const urlList = menu.url.split('/').filter((url) => url);
      const sameEl = menu.url.split('/').filter((url) => url && currentPath.split('/').includes(url));

      if (sameEl.length === urlList.length) mainArr.push(menu);

      if (menu.children) {
        menu.children.forEach((child) => {
          const urlList = child.url.split('/').filter((url) => url);
          const sameEl = child.url.split('/').filter((url) => url && currentPath.split('/').includes(url));

          if (child.type === 'collapse') {
            getCollapse(child, mainArr);
          } else if (child.type === 'item' && child.breadcrumbs !== false) {
            let urlMatch = false;
            if (sameEl.length >= urlList.length - 1) {
              let preUrl = '/';
              for (let i = 0; i < urlList.length - 1; i++) {
                preUrl += `${urlList[i]}/`;
              }
              let regexp = new RegExp(`^${preUrl}${child.subUrlRegex}$`, 'gi');
              urlMatch = regexp.test(currentPath);
            }
            if (urlMatch) {
              if (!mainArr.find((data) => data.menuCode === menu.menuCode)) mainArr.push(menu);
              setItem(child);
            }
          }
        });
      }

      if (mainArr.length > 0) {
        setMain(mainArr);
        dispatch(setSelectedCollapse({ selectedCollapse: mainArr[0].url }));
      }
    } catch (error) {
      console.error("Breadcrumbs 오류 발생:", error);
    }
  };
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  useEffect(() => {
   if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    isMountedRef.current = true;
    setMain([]);
    setItem(null);
  }, [currentPath]);

  useEffect(() => {
   if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (!isMountedRef.current) return;
    try {
      if (Array.isArray(items)) {
        items.forEach((menu) => getCollapse(menu));
      }
    } catch (error) {
      console.error("useEffect 실행 중 오류 발생:", error);
    }
  }, [currentPath, items]);

  // 아이콘 및 스타일 지정
  const SeparatorIcon = separator;
  const separatorIcon = separator ? (
    <SeparatorIcon style={{ fontSize: '0.75rem', marginTop: 2 }} />
  ) : (
    '/'
  );

  let mainContent = main.map((depth) => (
    <Typography key={depth.menuCode} variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
      {depth.label}
    </Typography>
  ));

  let itemTitle = item ? item.label : '';
  let ItemIcon = item ? iconMap(item.icon) : null;

  let itemContent = item && (
    <Typography variant="subtitle1" color="textPrimary">
      <Stack direction="row" alignItems="center">
        {itemTitle}
      </Stack>
    </Typography>
  );

  return (
    <MainCard
      border={card}
      sx={card === false ? { mb: 3, bgcolor: 'transparent', ...sx } : { mb: 3, ...sx }}
      {...others}
      content={card}
      shadow="none"
    >
      <Grid container direction={rightAlign ? 'row' : 'column'} justifyContent={rightAlign ? 'space-between' : 'flex-start'} alignItems={rightAlign ? 'center' : 'flex-start'} spacing={1}>
        {title && !titleBottom && (
          <Grid item xs={6}>
            <Stack spacing={1} direction="row">
              {ItemIcon ? <ItemIcon /> : null}
              <Typography variant="h2">{itemTitle}</Typography>
            </Stack>
          </Grid>
        )}
        <Grid xs={6} item container justifyContent="flex-end" alignItems="center">
          <Grid item>
            <Stack direction="row" spacing={2}>
              <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
                {mainContent}
                {itemContent}
              </MuiBreadcrumbs>

              <IconButton
                size="small"
                sx={{ height: '20px', width: '20px' }}
                onClick={() => onChangeFullSizeFlag(!fullSizeFlag)}
              >
                {fullSizeFlag ? <FullscreenIcon fontSize="small" /> : <FullscreenExitIcon fontSize="small" />}
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
    </MainCard>
  );
};

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  divider: PropTypes.bool,
  maxItems: PropTypes.number,
  rightAlign: PropTypes.bool,
  separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  title: PropTypes.bool,
  titleBottom: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Breadcrumbs;
