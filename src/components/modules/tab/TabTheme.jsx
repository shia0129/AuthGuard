// Project import
import MainCard from '@components/mantis/MainCard';

// MUI
import { Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import PropTypes from 'prop-types';

function TabPanel({ children, value, index }) {
  return (
    value === index && (
      <MainCard sx={{ borderRadius: '0 !important', borderTop: '0 !important' }}>
        {children}
      </MainCard>
    )
  );
}

/**
 *
 * Tab 함수 컴포넌트
 * @param {String} tabsValue tabs의 value값.
 * @param {String} variant 탭 하단 바 표시기능.
 * @param {String} scrollButtons 스크롤 버튼 방지.
 * @param {Function} onChange 값 변화 시 동작 커스텀 함수
 * @param {Boolean} tabOutline true 일경우 새로운 디자인 적용.
 * @param {Object} tabsOptions tabs 설정 정보.
 * @param {Array} tabList tab의 value 값.
 * @param {String} crudFlag crud 상태 값.
 * @param {Array} hiddenList crudFlag 에 따라 보여지는 값.
 */

function TabTheme({
  tabsValue,
  variant = 'scrollable',
  scrollButtons = 'auto',
  onChange = null,
  tabOutline = false,
  tabsOptions,
  tabList = [],
  children,
  // crudFlag,
  // hiddenList = [],
}) {
  const theme = useTheme();
  return (
    <>
      <Tabs
        value={tabsValue}
        variant={variant}
        scrollButtons={scrollButtons}
        onChange={onChange}
        sx={{
          ...(tabOutline && {
            boxShadow: `inset 0 -1px 0 0px ${theme.palette.primary.main}`,
            '& .Mui-selected': {
              borderTop: `1px solid ${theme.palette.primary.main}`,
              borderBottom: `1px solid ${theme.palette.grey[0]}`,
              backgroundColor: theme.palette.grey[0],
              boxShadow: `0 -1px 0 1px ${theme.palette.primary.main}`,
              zIndex: '9',
              borderRight: `1px solid ${theme.palette.grey[0]}`,
              ':nth-of-type(1)': { borderLeft: `1px solid ${theme.palette.primary.main}` },
            },
            '& span': { display: 'none' },
          }),
        }}
        {...tabsOptions}
      >
        {tabList &&
          tabList.map((data, index) => (
            <Tab
              key={index}
              label={data.label}
              value={data.value}
              sx={{
                ...(tabOutline && {
                  color: theme.palette.grey[400],
                  borderTop: `1px solid ${theme.palette.grey[300]}`,
                  borderBottom: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: '0',
                  borderRight: `1px solid ${theme.palette.grey[300]}`,
                  ':nth-of-type(1)': { borderLeft: `1px solid ${theme.palette.grey[300]}` },
                }),
              }}
            />
          ))}
        {/* {crudFlag !== 'insert' &&
          hiddenList &&
          hiddenList.map((data, index) => (
            <Tab
              key={index}
              label={data.label}
              value={data.value}
              sx={
                tabOutline && {
                  color: theme.palette.grey[400],
                  borderTop: `1px solid ${theme.palette.grey[300]}`,
                  borderBottom: `solid 1px ${theme.palette.primary.main}`,
                  boxShadow: `0 -2px 0 1px ${theme.palette.grey[300]}`,
                  borderRadius: '0',
                  ':nth-of-type(1)': { borderLeft: `1px solid ${theme.palette.grey[300]}` },
                }
              }
            />
          ))} */}
      </Tabs>

      {Array.isArray(children) ? (
        children.map((child, index) => (
          <TabPanel key={index} value={tabsValue} index={index}>
            {child}
          </TabPanel>
        ))
      ) : children ? (
        <TabPanel value={tabsValue} index={tabsValue}>
          {children}
        </TabPanel>
      ) : null}
    </>
  );
}

TabTheme.propTypes = {
  /**
   * 현재 선택된 Tab 값.
   */
  tabsValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Tab 표시 방식.
   * - **scrollable: Tab bar에 가로 스크롤을 허용**
   * - **fullWidth: 사용 가능한 모든 공간을 사용 (모바일 환경)**
   * - **standard**: 기본.
   */
  variant: PropTypes.oneOf(['scrollable', 'fullWidth', 'standard']),
  /**
   * Tab 스크롤 버튼 동작 방식.
   * - **auto**: 모든 항목이 표시되지 않으면, 스크롤 버튼 표시.
   * - **true**: 항상 스크롤 버튼 표시.
   * - **false**: 스크롤 버튼을 표시하지 않음.
   */
  scrollButtons: PropTypes.oneOf(['auto', true, false]),
  /**
   * Tab 변경 이벤트 핸들러.
   */
  onChange: PropTypes.func,
  /**
   * 특정 디자인 적용 여부.
   */
  tabOutline: PropTypes.bool,
  /**
   * MUI 전용 Tabs API 정보 객체.
   * - [Tabs 속성](https://mui.com/material-ui/api/tabs/)
   */
  tabsOptions: PropTypes.object,
  /**
   * Tab 목록 정보 객체 배열.
   */
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
  /**
   * 선택된 Tab value에 따라 표시 될 컴포넌트.
   * - **자식 컴포넌트가 여러 개인 경우, tabsValue를 숫자 0부터 설정.**
   */
  children: PropTypes.any,
};

export default TabTheme;
