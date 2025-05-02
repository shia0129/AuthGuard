import { useMemo, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';

// project import
import ThemeLayout from './ThemeLayout';
import ThemeMode from './ThemeMode';
import ColorScheme from './ColorScheme';
import ThemeWidth from './ThemeWidth';
import ThemeFont from './ThemeFont';
import MainCard from '@components/mantis/MainCard';
import IconButton from '@components/@extended/IconButton';
import AnimateButton from '@components/@extended/AnimateButton';
import SimpleBar from '@components/third-party/SimpleBar';
import useConfig from '@modules/hooks/useConfig';
import ThemeLocale from './ThemeLocale';
import ThemeQuickMenu from './ThemeQuickMenu';

// assets
import {
  LayoutOutlined,
  HighlightOutlined,
  BorderInnerOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  FontColorsOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { ShortcutOutlined, PaletteOutlined, BorderLeftOutlined } from '@mui/icons-material';
import { InsertRowAboveOutlined } from '@ant-design/icons';
import MenuThemeMode from './MenuThemeMode';
import ThemeTable from './ThemeTable';
// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  const {
    container,
    fontFamily,
    mode,
    menuMode,
    tableMode,
    presetColor,
    miniDrawer,
    themeDirection,
    i18n,
  } = useConfig();

  const simpleBarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  // eslint-disable-next-line
  const themeLayout = useMemo(() => <ThemeLayout />, [miniDrawer, themeDirection]);
  // eslint-disable-next-line
  const themeMode = useMemo(() => <ThemeMode />, [mode]);
  // eslint-disable-next-line
  const themeColor = useMemo(() => <ColorScheme />, [presetColor]);
  // eslint-disable-next-line
  const themeWidth = useMemo(() => <ThemeWidth />, [container]);
  // eslint-disable-next-line
  const themeFont = useMemo(() => <ThemeFont />, [fontFamily]);
  // Locale 설정
  const themeLocale = useMemo(() => <ThemeLocale />, [i18n]);
  // 바로가기 메뉴 설정
  const themeQuickMenu = useMemo(() => <ThemeQuickMenu setOpen={setOpen} />, []);
  // 메뉴 테마 모드 설정
  const themeMenuMode = useMemo(() => <MenuThemeMode />, [menuMode]);
  // 테이블 모드 설정
  const themeTableMode = useMemo(() => <ThemeTable />, [tableMode]);
  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.100';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.0';

  const handleReCalculateHeight = () => {
    if (simpleBarRef.current) simpleBarRef.current.recalculate();
  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          color="secondary"
          variant="light"
          size="large"
          sx={{
            color: 'text.primary',
            bgcolor: open ? iconBackColorOpen : iconBackColor,
            '&:hover': {
              bgcolor: iconBackColorOpen,
            },
          }}
          onClick={handleToggle}
          aria-label="settings toggler"
        >
          <AnimateButton type="rotate">
            <SettingOutlined />
          </AnimateButton>
        </IconButton>
      </Box>
      <Drawer
        sx={{
          zIndex: 2001,
        }}
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 340,
          },
        }}
      >
        {open && (
          <MainCard
            title="웹 환경설정"
            sx={{
              border: 'none',
              borderRadius: 0,
              height: '100vh',
              '& .MuiCardHeader-root': {
                p: '16px',
                minHeight: '60px !important',
                color: mode !== 'dark' && menuMode === 'dark' ? 'white' : 'grey.900',
                bgcolor:
                  mode !== 'dark' &&
                  (menuMode === 'dark' ? '#1E232E' : menuMode === 'gray' && '#F3F4F9'),
                '& .MuiTypography-root': { fontSize: '1rem' },
              },
            }}
            content={false}
            secondary={
              <IconButton
                shape="rounded"
                size="small"
                onClick={handleToggle}
                sx={{
                  color: mode !== 'dark' && menuMode === 'dark' ? 'white' : 'grey.600',
                  '&:hover': {
                    color: mode !== 'dark' && menuMode === 'dark' ? 'white' : 'grey.900',
                    bgcolor: 'primary.lighter',
                  },
                }}
              >
                <CloseCircleOutlined style={{ fontSize: '1.15rem' }} />
              </IconButton>
            }
          >
            <SimpleBar
              ref={simpleBarRef}
              sx={{
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              <Box
                sx={{
                  height: 'calc(100vh - 64px)',
                  '& .MuiAccordion-root': {
                    borderColor: theme.palette.divider,
                    '& .MuiAccordionSummary-root': {
                      bgcolor: 'transparent',
                      flexDirection: 'row',
                      pl: 1,
                    },
                    '& .MuiAccordionDetails-root': {
                      border: 'none',
                    },
                    '& .Mui-expanded': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <Accordion
                  sx={{ borderTop: 'none' }}
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <LayoutOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          레이아웃
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          레이아웃을 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeLayout}</AccordionDetails>
                </Accordion>
                <Accordion
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{
                          bgcolor: 'primary.lighter',
                          '& svg': {
                            fontSize: '1.1rem',
                          },
                        }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <BorderLeftOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          메뉴 테마 모드
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          좌측 메뉴 테마를 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMenuMode}</AccordionDetails>
                </Accordion>
                <Accordion
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <HighlightOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          테마 모드
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          테마를 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMode}</AccordionDetails>
                </Accordion>
                <Accordion
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <BorderInnerOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          레이아웃 넓이
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          레이아웃 넓이를 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeWidth}</AccordionDetails>
                </Accordion>
                <Accordion
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <InsertRowAboveOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          테이블 모드
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          테이블 모드를 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeTableMode}</AccordionDetails>
                </Accordion>
                <Accordion
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <FontColorsOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          폰트
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          폰트를 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeFont}</AccordionDetails>
                </Accordion>
                <Accordion
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <TranslationOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Locale
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Locale을 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeLocale}</AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{ borderBottom: 'none' }}
                  TransitionProps={{
                    onExited: handleReCalculateHeight,
                    onEntered: handleReCalculateHeight,
                  }}
                >
                  <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{
                          bgcolor: 'primary.lighter',
                          '& svg': {
                            fontSize: '1.1rem',
                          },
                        }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <ShortcutOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          바로가기 메뉴
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          바로가기 메뉴를 선택해주세요.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeQuickMenu}</AccordionDetails>
                </Accordion>

                {process.env.NODE_ENV === 'development' && (
                  <Accordion
                    sx={{ borderBottom: 'none' }}
                    TransitionProps={{
                      onExited: handleReCalculateHeight,
                      onEntered: handleReCalculateHeight,
                    }}
                  >
                    <AccordionSummary aria-controls="panel7d-content" id="panel7d-header">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <IconButton
                          disableRipple
                          color="primary"
                          sx={{
                            bgcolor: 'primary.lighter',
                            '& svg': {
                              fontSize: '1.1rem',
                            },
                          }}
                          onClick={handleToggle}
                          aria-label="settings toggler"
                        >
                          <PaletteOutlined />
                        </IconButton>
                        <Stack>
                          <Typography variant="subtitle1" color="textPrimary">
                            웹 테마 변경
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            전체 웹 색상 테마 변경 (개발모드 전용)
                          </Typography>
                        </Stack>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>{themeColor}</AccordionDetails>
                  </Accordion>
                )}
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};

export default Customization;
