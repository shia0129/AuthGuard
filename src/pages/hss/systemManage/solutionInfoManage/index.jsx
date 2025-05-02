// import _ from 'lodash';
// import Layout from '@components/layouts';
// import GridItem from '@components/modules/grid/GridItem';
// import useApi from '@modules/hooks/useApi';
// import { useSession } from 'next-auth/react';
// import { AuthInstance } from '@modules/axios';
// import { useEffect, useState, useRef } from 'react';
// import { unstable_batchedUpdates } from 'react-dom';
// import { useIntl } from 'react-intl';
// import Loader from '@components/mantis/Loader';
// import TabTheme from '@components/modules/tab/TabTheme';
// import ButtonSet from '@components/modules/button/ButtonSet';
// import { Stack, Typography, Box, CircularProgress } from '@mui/material';
// import Label from '@components/modules/label/Label';
// import Tooltip from '@mui/material/Tooltip';
// import { styled } from '@mui/material/styles';
import Layout from '@components/layouts';
import { useEffect, useState } from 'react';
// import solutionInfoListApi from '@api/system/solutionInfoListApi';
import { AuthInstance } from '@modules/axios';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import PopUp from '@components/modules/common/PopUp';
import { Stack, Typography, Box, CircularProgress } from '@mui/material';
import ButtonSet from '@components/modules/button/ButtonSet';
import useApi from '@modules/hooks/useApi';
import TabTheme from '@components/modules/tab/TabTheme';
import Label from '@components/modules/label/Label';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
// import useCustomModal from '@modules/hooks/useCustomModal';
import { useSession } from 'next-auth/react';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import Loader from '@components/mantis/Loader';

// icons
import { Info, AddBox } from '@mui/icons-material';

// third-party
import { FormProvider, useForm } from 'react-hook-form';

const TabList = ({ tabList, children, index, setIndex }) => {
  const handleChange = (_, newValue) => {
    setIndex(newValue);
  };
  return (
    <TabTheme tabsValue={index} onChange={handleChange} tabList={tabList} tabOutline>
      {children}
    </TabTheme>
  );
};

// 커스텀 툴팁
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, bgColor = '#FCFDFE', borderSx = '1px solid #dadde9' }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: bgColor,
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 400,
    ml: 4,
    fontSize: theme.typography.pxToRem(12),
    padding: theme.spacing(0.8, 1.5, 0.5, 1.5),
    border: borderSx,
    marginBottom: '5px !important',
  },
}));

// 콤보 맵 리스트 (key: envKey, value: comboList(basecode))
const comboMap = [
  //{ DOUBLE_MODE: 'BSCD:W066' }, // 이중화 모드 선택 (보안적합성)
  //{ SYS_TYPE: 'BSCD:W067' }, // 솔루션타입 (system_env 테이블에서 제거됨)
  { BACKUP_CYCLE: 'BSCD:W072' }, // 로그/DB 백업 주기
  { BACKUP_DAY: 'XML:DAY_1' }, // 로그/DB 백업 일자
  { BACKUP_WEEK: 'XML:WEEK' }, // 로그/DB 백업 요일
  { BACKUP_HOUR_H: 'XML:HOUR' }, // 로그/DB 백업 시
  { BACKUP_HOUR_M: 'XML:MINUTE_1' }, // 로그/DB 백업 분
  { SA_USE: 'BSCD:W013' }, // 2차인증 사용 여부
  { AUTH_EXFIRE: 'BSCD:W013' }, // 만료계정 설정 여부
  { LOCK_USER: 'BSCD:W013' }, // 계정 잠김 사용 설정
  { RELEASE_TYPE: 'BSCD:W025' }, // 차단계정 해지 방법
  { PC_ADDR_CTL: 'BSCD:W013' }, // 웹접속PC 제어 설정
  { PC_ADDR_WAY: 'BSCD:W020' }, // 웹접속PC 제어 구분
  // { ID_PWD_CHG_WAY: 'BSCD:W063' }, // 패스워드 변경 방식
  { ID_PWD_IN_ID: 'BSCD:W013' }, // 패스워드 ID 포함 금지
  { ID_PWD_IN_NAME: 'BSCD:W013' }, // 패스워드 이름 포함금지
  { ID_PWD_TEMP: 'BSCD:W064' }, // 임시 패스워드 설정
  { PF_PWD_SA: 'BSCD:W013' }, // 패스워드 조회 2차인증 사용// 보안적합성
  { PF_PWD_DWN: 'BSCD:W013' }, // 다운로드 패스워드 포함
  { PF_PWD_DWN_ENCPT: 'BSCD:W013' }, // 다운로드 파일 암호화
  { PF_PWD_BWORK_TYPE: 'BSCD:W057' }, // 기본 작업신청 구분
  { PF_PWD_MWORK_TYPE: 'BSCD:W057' }, // 최대 작업신청 구분
  { ALLOW_IP_TYPE: 'BSCD:W098' }, // IP 접근 제한 설정
];

const defaultTabList = [
  // 정렬 순서대로 그려줌.
  { SYSTEM: '시스템 설정' },
  { SESSION: '인증 및 세션' },
  { COMMON_PWD: '패스워드 공통 규칙' },
  { USER_RULE: '사용자 정보 규칙' },
  { PF_RULE: '플랫폼 정보 규칙' },
  { ALLOW_IP: '접속 허용 IP' },
  { AM_RULE: '접근제어 정책' },
];

// 리스트에서 제외할 envKey 값
const excludeEnvKeyList = [
  'NOTI_TYPE', // 이벤트 통지 설정
  'OTP_DOMAIN', // 도메인 정보
  'AUTH_INACTIVE', // 휴면계정 설정 여부
  'INACTIVE_DAY', // 휴면계정 유예기간
  'INACTIVE_NOTI_DAY', // 휴면알림일 설정
  'EXFIRE_NOTI_DAY', // 만료계정 알림일 설정
  'IP_MAX_LEN', // 사용자 IP 최대 개수
  'PC_ADDR_CTL', // 웹접속PC 제어 설정
  'PC_ADDR_WAY', // 웹접속PC 제어 구분
  'PF_PWD_KEEP_ON', // 패스워드 변경후 발급
  'PF_PWD_KEEP_TIME', // 패스워드 유지 시간
  'PF_ID_COLLECT', // 플랫폼 계정 수집
  'MASKING_GUIDE', // 중요정보 마스킹 유도
  'IP0', // 고정 아이피
  'AGENT_HASH', // 접근제어 정책(Agent Hash)
  'AGENT_VER', // AGENT VERSION
  'DOUBLE_MODE', // 이중화 모드 선택
  'LOGIN_SESSION', // 중복로그인 세션수
  'ID_PWD_CHG_WAY', // 패스워드 변경 방식
  'AGENT_VERSION', // Agent Version
  'LOCK_USER', // 계정 잠김 사용 설정
  'PF_PWD_SA', // 패스워드 조회 2차인증 사용
];

// 리스트에서 제외할 envGrpKey 값
const excludeEnvGrpKeyList = [
  'ALLOW_IP',
  // => 예시임 'PF_RULE', // 플랫폼 정보 규칙
];

// onBlur 효과를 줄 envKey 값 => chkIntRange 함수 사용 시 len 파라미터 넘길 경우 아래 리스트에 envKey 추가
const onBlurEnvKeyList = [
  'WEB_NOTI_DUR_N', // 웹알림 보관 기간(미열람)`
  'ID_PWD_CHG_DAY', // 패스워드 변경 주기
  'PWD_MIN_LEN', // 패스워드 최소 길이
  'PWD_MAX_LEN', // 패스워드 최대 길이
  'DISK1_RATE', // DISK1 임계치
  'DISK2_RATE', // DISK2 임계치
  'DISK3_RATE', // DISK3 임계치
  'DISK4_RATE', // DISK4 임계치
  'CPU_RATE', // CPU 임계치
  'MEM_RATE', // MEMORY 임계치
  'DISKB3TH_RATE', // 3차백업 임계치
  'DISK1_DUR', // DISK1 임계치 지속시간
  'DISK2_DUR', // DISK2 임계치 지속시간
  'DISK3_DUR', // DISK3 임계치 지속시간
  'DISK4_DUR', // DISK4 임계치 지속시간
  'CPU_DUR', // CPU 임계치 지속시간
  'MEM_DUR', // MEMORY 임계치 지속시간
  'DISKB3TH_DUR', // 3차백업 임계치 지속시간
  'WEB_NOTI_DUR_Y', // 웹알림 보관 기간(열람)
  'RELEASE_TIME', // 차단계정 잠김 시간
  'MGR_TIMEOUT', // 관리자 세션 타임아웃 시간
  'USER_TIMEOUT', // 사용자 세션 타임아웃 시간
  'ID_MIN_LEN', // 계정 최소 길이
  'ID_EMIN_LEN', // 계정 최소 영문자수
  'ID_NMIN_LEN', // 계정 최소 숫자수
  'PF_PWD_BWORK_TIME', // 기본 작업신청 시간
  'PF_PWD_MWORK_TIME', // 최대 작업신청 시간
  'AGENT_TIMEOUT', // 세션 타임아웃 (접근제어 정책)
  'LINKCHECK_TIME', // Linkcheck 주기 (접근제어 정책)
  'AGENT_BOARD_TIME', // 공지사항 업데이트 주기 (접근제어 정책)
  'AGENT_EVENT_TIME', // 이벤트 업데이트 주기 (접근제어 정책)
];

const mockComboList = [
  {
    BACKUP_CYCLE: [
      { value: '1', label: '매일' },
      { value: '2', label: '매주' },
      { value: '3', label: '매월' },
    ],
  },
  {
    BACKUP_DAY: [
      { value: '1', label: '1 일' },
      { value: '2', label: '2 일' },
      { value: '3', label: '3 일' },
      { value: '4', label: '4 일' },
      { value: '5', label: '5 일' },
      { value: '6', label: '6 일' },
      { value: '7', label: '7 일' },
      { value: '8', label: '8 일' },
      { value: '9', label: '9 일' },
      { value: '10', label: '10 일' },
      { value: '11', label: '11 일' },
      { value: '12', label: '12 일' },
      { value: '13', label: '13 일' },
      { value: '14', label: '14 일' },
      { value: '15', label: '15 일' },
      { value: '16', label: '16 일' },
      { value: '17', label: '17 일' },
      { value: '18', label: '18 일' },
      { value: '19', label: '19 일' },
      { value: '20', label: '20 일' },
      { value: '21', label: '21 일' },
      { value: '22', label: '22 일' },
      { value: '23', label: '23 일' },
      { value: '24', label: '24 일' },
      { value: '25', label: '25 일' },
      { value: '26', label: '26 일' },
      { value: '27', label: '27 일' },
      { value: '28', label: '28 일' },
    ],
  },
  {
    BACKUP_WEEK: [
      { value: '1', label: '일요일' },
      { value: '2', label: '월요일' },
      { value: '3', label: '화요일' },
      { value: '4', label: '수요일' },
      { value: '5', label: '목요일' },
      { value: '6', label: '금요일' },
      { value: '7', label: '토요일' },
    ],
  },
  {
    BACKUP_HOUR_H: [
      { value: '00', label: '00' },
      { value: '01', label: '01' },
      { value: '02', label: '02' },
      { value: '03', label: '03' },
      { value: '04', label: '04' },
      { value: '05', label: '05' },
      { value: '06', label: '06' },
      { value: '07', label: '07' },
      { value: '08', label: '08' },
      { value: '09', label: '09' },
      { value: '10', label: '10' },
      { value: '11', label: '11' },
      { value: '12', label: '12' },
      { value: '13', label: '13' },
      { value: '14', label: '14' },
      { value: '15', label: '15' },
      { value: '16', label: '16' },
      { value: '17', label: '17' },
      { value: '18', label: '18' },
      { value: '19', label: '19' },
      { value: '20', label: '20' },
      { value: '21', label: '21' },
      { value: '22', label: '22' },
      { value: '23', label: '23' },
    ],
  },
  {
    BACKUP_HOUR_M: [
      { value: '00', label: '00' },
      { value: '05', label: '05' },
      { value: '10', label: '10' },
      { value: '15', label: '15' },
      { value: '20', label: '20' },
      { value: '25', label: '25' },
      { value: '30', label: '30' },
      { value: '35', label: '35' },
      { value: '40', label: '40' },
      { value: '45', label: '45' },
      { value: '50', label: '50' },
      { value: '55', label: '55' },
    ],
  },
  {
    SA_USE: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    AUTH_EXFIRE: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    LOCK_USER: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    RELEASE_TYPE: [
      { value: '1', label: '자동 해지' },
      { value: '2', label: '수동 해지' },
    ],
  },
  {
    PC_ADDR_CTL: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    PC_ADDR_WAY: [],
  },
  {
    ID_PWD_IN_ID: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    ID_PWD_IN_NAME: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    ID_PWD_TEMP: [
      { value: '1', label: '핸드폰' },
      { value: '2', label: '이메일' },
      { value: '3', label: '아이디' },
    ],
  },
  {
    PF_PWD_SA: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    PF_PWD_DWN: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    PF_PWD_DWN_ENCPT: [
      { value: 'Y', label: '사용' },
      { value: 'N', label: '미사용' },
    ],
  },
  {
    PF_PWD_BWORK_TYPE: [
      { value: '1', label: '시간' },
      { value: '2', label: '일' },
    ],
  },
  {
    PF_PWD_MWORK_TYPE: [
      { value: '1', label: '시간' },
      { value: '2', label: '일' },
    ],
  },
  {
    ALLOW_IP_TYPE: [
      { value: 'Y', label: '설정' },
      { value: 'N', label: '미설정' },
    ],
  },
];

const mockDataList = {
  data: {
    resultData: {
      COMMON_PWD__CC_CNT_LIMIT: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__CC_CNT_LIMIT',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'CC_CNT_LIMIT',
        envNm: '연속문자 개수 제한',
        value: '3',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 7,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SENDER_NM: {
        locale: 'ko',
        sysKey: 'SYSTEM__SENDER_NM',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SENDER_NM',
        envNm: '보내는 사람 명',
        value: '시스템',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 13,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__BACKUP_CYCLE: {
        locale: 'ko',
        sysKey: 'SYSTEM__BACKUP_CYCLE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'BACKUP_CYCLE',
        envNm: '로그/DB 백업 주기',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 1:매일, 2:매주, 3: 매월',
        sort: 41,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__NOTI_TYPE: {
        locale: 'ko',
        sysKey: 'SYSTEM__NOTI_TYPE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'NOTI_TYPE',
        envNm: '이벤트 통지 설정',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 미사용, 이메일, 카카오알림톡, SMS',
        sort: 9,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__RDP_IMG_PORT: {
        locale: 'ko',
        sysKey: 'AM_RULE__RDP_IMG_PORT',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'RDP_IMG_PORT',
        envNm: '이미지 수신포트',
        value: '48082',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '이미지 수신포트',
        sort: 20,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      COMMON_PWD__SC_CNT_LIMIT: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__SC_CNT_LIMIT',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'SC_CNT_LIMIT',
        envNm: '동일문자 개수 제한',
        value: '3',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 8,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__MEM_RATE: {
        locale: 'ko',
        sysKey: 'SYSTEM__MEM_RATE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'MEM_RATE',
        envNm: 'MEMORY 임계치',
        value: '80',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~80%)',
        sort: 30,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK1_URL: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK1_URL',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK1_URL',
        envNm: 'DISK1 경로',
        value: '/passguard/db',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 파티션 경로',
        sort: 16,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__RDP_RELAY_PORT_START: {
        locale: 'ko',
        sysKey: 'AM_RULE__RDP_RELAY_PORT_START',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'RDP_RELAY_PORT_START',
        envNm: '중계포트시작(RDP)',
        value: '44000',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트시작(RDP)',
        sort: 18,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__TOP_GRP_NM: {
        locale: 'ko',
        sysKey: 'SYSTEM__TOP_GRP_NM',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'TOP_GRP_NM',
        envNm: '트리 최상위 그룹명',
        value: '한싹',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용자/시스템/계정 관리 최상위 그룹명',
        sort: 39,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__TELNET_RELAY_PORT_END: {
        locale: 'ko',
        sysKey: 'AM_RULE__TELNET_RELAY_PORT_END',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'TELNET_RELAY_PORT_END',
        envNm: '중계포트종료(TELNET)',
        value: '42999',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트종료(TELNET)',
        sort: 15,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_MWORK_TIME: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_MWORK_TIME',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_MWORK_TIME',
        envNm: '최대 작업신청 시간',
        value: '6',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '',
        sort: 13,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__CPU_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__CPU_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'CPU_DUR',
        envNm: 'CPU 임계치 지속시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~20초)',
        sort: 29,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_BWORK_TIME: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_BWORK_TIME',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_BWORK_TIME',
        envNm: '기본 작업신청 시간',
        value: '6',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '',
        sort: 11,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__MGR_TIMEOUT: {
        locale: 'ko',
        sysKey: 'SESSION__MGR_TIMEOUT',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'MGR_TIMEOUT',
        envNm: '관리자 세션 타임아웃 시간',
        value: '60',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 관리자 세션 유지 시간(분)',
        sort: 4,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_PWD_CHG_DAY: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_PWD_CHG_DAY',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_PWD_CHG_DAY',
        envNm: '패스워드 변경 주기',
        value: '90',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : 일',
        sort: 4,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      COMMON_PWD__PWD_MIN_LEN: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__PWD_MIN_LEN',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'PWD_MIN_LEN',
        envNm: '패스워드 최소길이',
        value: '9',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 1,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_KEEP_ON: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_KEEP_ON',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_KEEP_ON',
        envNm: '패스워드 변경후 발급',
        value: 'N',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 패스워드 변경후 발급',
        sort: 3,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__MEM_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__MEM_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'MEM_DUR',
        envNm: 'MEMORY 임계치 지속시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~20초)',
        sort: 31,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      COMMON_PWD__EB_MIN_LEN: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__EB_MIN_LEN',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'EB_MIN_LEN',
        envNm: '영대문자 최소 길이',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 4,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SENDER_ADDR: {
        locale: 'ko',
        sysKey: 'SYSTEM__SENDER_ADDR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SENDER_ADDR',
        envNm: '보내는 사람 주소',
        value: 'hestia@hanssak.co.kr',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 14,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_ID_COLLECT: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_ID_COLLECT',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_ID_COLLECT',
        envNm: '플랫폼 계정 수집',
        value: 'N',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 사용, 미사용',
        sort: 8,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__SFTP_RELAY_PORT_START: {
        locale: 'ko',
        sysKey: 'AM_RULE__SFTP_RELAY_PORT_START',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'SFTP_RELAY_PORT_START',
        envNm: '중계포트시작(SFTP)',
        value: '41000',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트시작(SFTP)',
        sort: 12,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_PWD_IN_NAME: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_PWD_IN_NAME',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_PWD_IN_NAME',
        envNm: '패스워드 이름 포함 금지',
        value: 'Y',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용, 미사용',
        sort: 7,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK4_RATE: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK4_RATE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK4_RATE',
        envNm: 'DISK4 임계치',
        value: '80',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~80%)',
        sort: 26,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISKB3TH_URL: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISKB3TH_URL',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISKB3TH_URL',
        envNm: '3차백업 경로',
        value: '/mnt/usb/pgusb',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 파티션 경로',
        sort: 34,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__RELEASE_TIME: {
        locale: 'ko',
        sysKey: 'SESSION__RELEASE_TIME',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'RELEASE_TIME',
        envNm: '차단계정 잠김 시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : 분',
        sort: 11,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__SFTP_RELAY_PORT_END: {
        locale: 'ko',
        sysKey: 'AM_RULE__SFTP_RELAY_PORT_END',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'SFTP_RELAY_PORT_END',
        envNm: '중계포트종료(SFTP)',
        value: '41999',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트종료(SFTP)',
        sort: 13,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK4_URL: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK4_URL',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK4_URL',
        envNm: 'DISK4 경로',
        value: '/passguard/log',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 파티션 경로',
        sort: 25,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__AGENT_LOCK_TIME: {
        locale: 'ko',
        sysKey: 'AM_RULE__AGENT_LOCK_TIME',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'AGENT_LOCK_TIME',
        envNm: '화면잠김 시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '1~10(분)',
        sort: 3,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISKB3TH_RATE: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISKB3TH_RATE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISKB3TH_RATE',
        envNm: '3차백업 임계치',
        value: '5',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~80%)',
        sort: 35,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_PWD_TEMP: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_PWD_TEMP',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_PWD_TEMP',
        envNm: '임시 패스워드 설정',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 핸드폰, 이메일, 아이디',
        sort: 8,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__POLICY_REFRESH_TIME: {
        locale: 'ko',
        sysKey: 'AM_RULE__POLICY_REFRESH_TIME',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'POLICY_REFRESH_TIME',
        envNm: '정책 자동 갱신 시간',
        value: '60',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '1~60(분)',
        sort: 4,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DOUBLE_MODE: {
        locale: 'ko',
        sysKey: 'SYSTEM__DOUBLE_MODE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DOUBLE_MODE',
        envNm: '이중화 모드 선택',
        value: '3',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* StandAlone, Master/Slave, Active/Active',
        sort: 1,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK2_URL: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK2_URL',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK2_URL',
        envNm: 'DISK2 경로',
        value: '/passguard/file',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 파티션 경로',
        sort: 19,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_DUP_DAY: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_DUP_DAY',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_DUP_DAY',
        envNm: '패스워드 중복 생성 방지 기간',
        value: '1',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 단위 : 일',
        sort: 2,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__APP_VER: {
        locale: 'ko',
        sysKey: 'SYSTEM__APP_VER',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'APP_VER',
        envNm: 'APP VERSION',
        value: '2.0.00100',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 3,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__BACKUP_BASE_URL: {
        locale: 'ko',
        sysKey: 'SYSTEM__BACKUP_BASE_URL',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'BACKUP_BASE_URL',
        envNm: '로그/DB 백업 BASE 경로',
        value: '/passguard/file/backup',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 39,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__SA_USE: {
        locale: 'ko',
        sysKey: 'SESSION__SA_USE',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'SA_USE',
        envNm: '2차인증 사용 여부',
        value: 'N',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용, 미사용',
        sort: 2,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__INACTIVE_DAY: {
        locale: 'ko',
        sysKey: 'SESSION__INACTIVE_DAY',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'INACTIVE_DAY',
        envNm: '휴면계정 유예기간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : 일',
        sort: 15,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK3_RATE: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK3_RATE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK3_RATE',
        envNm: 'DISK3 임계치',
        value: '80',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~80%)',
        sort: 23,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__BACKUP_HOUR_H: {
        locale: 'ko',
        sysKey: 'SYSTEM__BACKUP_HOUR_H',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'BACKUP_HOUR_H',
        envNm: '로그/DB 백업 시',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: 'ex) 10',
        sort: 45,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__INACTIVE_NOTI_DAY: {
        locale: 'ko',
        sysKey: 'SESSION__INACTIVE_NOTI_DAY',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'INACTIVE_NOTI_DAY',
        envNm: '휴면알림일 설정',
        value: '',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : 일(이벤트 통지 사용설정시)',
        sort: 16,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__BACKUP_HOUR_M: {
        locale: 'ko',
        sysKey: 'SYSTEM__BACKUP_HOUR_M',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'BACKUP_HOUR_M',
        envNm: '로그/DB 백업 분',
        value: '45',
        appType: '0',
        appTypeNm: 'ALL',
        comment: 'ex) 15',
        sort: 46,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__MASKING_GUIDE: {
        locale: 'ko',
        sysKey: 'USER_RULE__MASKING_GUIDE',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'MASKING_GUIDE',
        envNm: '중요정보 마스킹 유도',
        value: 'N',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 9,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_MIN_LEN: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_MIN_LEN',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_MIN_LEN',
        envNm: '계정 최소 길이',
        value: '5',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 1,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      COMMON_PWD__ES_MIN_LEN: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__ES_MIN_LEN',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'ES_MIN_LEN',
        envNm: '영소문자 최소 길이',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 3,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SMTP_HOST: {
        locale: 'ko',
        sysKey: 'SYSTEM__SMTP_HOST',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SMTP_HOST',
        envNm: '메일서버IP/DOMAIN',
        value: 'smtp.daouoffice.com',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* SMTP HOST',
        sort: 10,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__AUTH_FAIL: {
        locale: 'ko',
        sysKey: 'SESSION__AUTH_FAIL',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'AUTH_FAIL',
        envNm: '인증 오류 횟수',
        value: '5',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 9,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__AGENT_HASH: {
        locale: 'ko',
        sysKey: 'AM_RULE__AGENT_HASH',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'AGENT_HASH',
        envNm: 'Agent Hash',
        value: 'AEGFGWSXWWEFWDF',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 2,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_ID_DORMANCY_DAYS: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_ID_DORMANCY_DAYS',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_ID_DORMANCY_DAYS',
        envNm: '시스템계정 휴면 설정일',
        value: '2',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : 일',
        sort: 14,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__LOGIN_SESSION: {
        locale: 'ko',
        sysKey: 'SESSION__LOGIN_SESSION',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'LOGIN_SESSION',
        envNm: '중복로그인 세션수',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 1~10',
        sort: 3,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__AGENT_TIMEOUT: {
        locale: 'ko',
        sysKey: 'AM_RULE__AGENT_TIMEOUT',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'AGENT_TIMEOUT',
        envNm: '세션 타임아웃',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '10~60(분)',
        sort: 6,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK3_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK3_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK3_DUR',
        envNm: 'DISK3 임계치 지속시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~20초)',
        sort: 24,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_SDAY: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_SDAY',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_SDAY',
        envNm: '패스워드 조회 시간',
        value: '10',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 단위 : 초',
        sort: 5,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__USER_TIMEOUT: {
        locale: 'ko',
        sysKey: 'SESSION__USER_TIMEOUT',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'USER_TIMEOUT',
        envNm: '사용자 세션 타임아웃 시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용자  세션 유지 시간(분)',
        sort: 5,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      COMMON_PWD__SC_MIN_LEN: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__SC_MIN_LEN',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'SC_MIN_LEN',
        envNm: '특수문자 최소길이',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 6,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK1_RATE: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK1_RATE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK1_RATE',
        envNm: 'DISK1 임계치',
        value: '50',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~80%)',
        sort: 17,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__AGENT_BOARD_TIME: {
        locale: 'ko',
        sysKey: 'AM_RULE__AGENT_BOARD_TIME',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'AGENT_BOARD_TIME',
        envNm: '공지사항 업데이트 주기',
        value: '60',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '공지사항 업데이트 주기(10~60분)',
        sort: 7,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_NMIN_LEN: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_NMIN_LEN',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_NMIN_LEN',
        envNm: '계정 최소 숫자수',
        value: '0',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 3,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_DWN: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_DWN',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_DWN',
        envNm: '다운로드 패스워드 포함',
        value: 'Y',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 사용, 미사용',
        sort: 6,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__BACKUP_HOUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__BACKUP_HOUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'BACKUP_HOUR',
        envNm: '로그/DB 백업 시분',
        value: '1045',
        appType: '0',
        appTypeNm: 'ALL',
        comment: 'ex) 1015',
        sort: 44,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__LINKCHECK_TIME: {
        locale: 'ko',
        sysKey: 'AM_RULE__LINKCHECK_TIME',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'LINKCHECK_TIME',
        envNm: 'Linkcheck 주기',
        value: '60',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '30~60(초)',
        sort: 5,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK1_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK1_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK1_DUR',
        envNm: 'DISK1 임계치 지속시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~20초)',
        sort: 18,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__LOCK_USER: {
        locale: 'ko',
        sysKey: 'SESSION__LOCK_USER',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'LOCK_USER',
        envNm: '계정 잠김 사용 설정',
        value: 'Y',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용자 계정 차단 여부',
        sort: 8,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__EXFIRE_NOTI_DAY: {
        locale: 'ko',
        sysKey: 'SESSION__EXFIRE_NOTI_DAY',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'EXFIRE_NOTI_DAY',
        envNm: '만료계정 알림일 설정',
        value: '',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : 일(이벤트 통지 사용설정시)',
        sort: 17,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      COMMON_PWD__NUM_MIN_LEN: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__NUM_MIN_LEN',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'NUM_MIN_LEN',
        envNm: '숫자 최소길이',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 5,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__CPU_RATE: {
        locale: 'ko',
        sysKey: 'SYSTEM__CPU_RATE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'CPU_RATE',
        envNm: 'CPU 임계치',
        value: '80',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~80%)',
        sort: 28,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SYS_MGR_PHONE2: {
        locale: 'ko',
        sysKey: 'SYSTEM__SYS_MGR_PHONE2',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SYS_MGR_PHONE2',
        envNm: '서버 담당자 연락처2',
        value: '010-1234-1234',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 8,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__AGENT_EVENT_TIME: {
        locale: 'ko',
        sysKey: 'AM_RULE__AGENT_EVENT_TIME',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'AGENT_EVENT_TIME',
        envNm: '이벤트 업데이트 주기',
        value: '30',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '이벤트 업데이트 주기(10~30초)',
        sort: 8,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_SA: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_SA',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_SA',
        envNm: '패스워드 조회 2차인증 사용',
        value: 'Y',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 사용, 미사용',
        sort: 4,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SYS_MGR_PHONE1: {
        locale: 'ko',
        sysKey: 'SYSTEM__SYS_MGR_PHONE1',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SYS_MGR_PHONE1',
        envNm: '서버 담당자 연락처1',
        value: '02-2082-1200',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 7,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SYS_MGR_EMAIL: {
        locale: 'ko',
        sysKey: 'SYSTEM__SYS_MGR_EMAIL',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SYS_MGR_EMAIL',
        envNm: '서버 담당자 이메일',
        value: 'hanssakhelp@hanssak.co.kr',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 6,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__WEB_NOTI_DUR_N: {
        locale: 'ko',
        sysKey: 'SYSTEM__WEB_NOTI_DUR_N',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'WEB_NOTI_DUR_N',
        envNm: '웹알림 보관 기간(미열람)',
        value: '180',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (30~180일)',
        sort: 33,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__WEB_NOTI_DUR_Y: {
        locale: 'ko',
        sysKey: 'SYSTEM__WEB_NOTI_DUR_Y',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'WEB_NOTI_DUR_Y',
        envNm: '웹알림 보관 기간(열람)',
        value: '5',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~10일)',
        sort: 32,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__FTP_RELAY_PORT_START: {
        locale: 'ko',
        sysKey: 'AM_RULE__FTP_RELAY_PORT_START',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'FTP_RELAY_PORT_START',
        envNm: '중계포트시작(FTP)',
        value: '43000',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트시작(FTP)',
        sort: 16,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_EXC: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_EXC',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_EXC',
        envNm: '패스워드 제외문자',
        value: 'OoIl?&\\\\\\\\,:$',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '',
        sort: 1,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__PC_ADDR_CTL: {
        locale: 'ko',
        sysKey: 'SESSION__PC_ADDR_CTL',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'PC_ADDR_CTL',
        envNm: '웹접속PC 제어 설정',
        value: 'Y',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용, 미사용',
        sort: 12,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__IP_MAX_LEN: {
        locale: 'ko',
        sysKey: 'USER_RULE__IP_MAX_LEN',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'IP_MAX_LEN',
        envNm: '사용자 IP 최대 개수',
        value: '5',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 10,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_BWORK_TYPE: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_BWORK_TYPE',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_BWORK_TYPE',
        envNm: '기본 작업신청 구분',
        value: '1',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 단위 : 시간, 일',
        sort: 10,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__AGENT_VERSION: {
        locale: 'ko',
        sysKey: 'AM_RULE__AGENT_VERSION',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'AGENT_VERSION',
        envNm: 'Agent Version',
        value: '2.0.02572',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 1,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      COMMON_PWD__PWD_MAX_LEN: {
        locale: 'ko',
        sysKey: 'COMMON_PWD__PWD_MAX_LEN',
        envGrpKey: 'COMMON_PWD',
        envGrpNm: '패스워드 공통 규칙',
        envKey: 'PWD_MAX_LEN',
        envNm: '패스워드 최대길이',
        value: '15',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 2,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_MWORK_TYPE: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_MWORK_TYPE',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_MWORK_TYPE',
        envNm: '최대 작업신청 구분',
        value: '2',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 단위 : 시간, 일',
        sort: 12,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__BACKUP_WEEK: {
        locale: 'ko',
        sysKey: 'SYSTEM__BACKUP_WEEK',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'BACKUP_WEEK',
        envNm: '로그/DB 백업 요일',
        value: '3',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 43,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__RDP_RELAY_PORT_END: {
        locale: 'ko',
        sysKey: 'AM_RULE__RDP_RELAY_PORT_END',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'RDP_RELAY_PORT_END',
        envNm: '중계포트종료(RDP)',
        value: '44999',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트종료(RDP)',
        sort: 19,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SYS_MGR: {
        locale: 'ko',
        sysKey: 'SYSTEM__SYS_MGR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SYS_MGR',
        envNm: '서버 담당자',
        value: '한싹시스템 기술지원부서 헤스티아',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 5,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK3_URL: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK3_URL',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK3_URL',
        envNm: 'DISK3 경로',
        value: '/passguard/data',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 파티션 경로',
        sort: 22,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__SSH_RELAY_PORT_END: {
        locale: 'ko',
        sysKey: 'AM_RULE__SSH_RELAY_PORT_END',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'SSH_RELAY_PORT_END',
        envNm: '중계포트종료(SSH)',
        value: '40999',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트종료(SSH)',
        sort: 11,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__LOCALE: {
        locale: 'ko',
        sysKey: 'SYSTEM__LOCALE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'LOCALE',
        envNm: '기본 언어 설정',
        value: 'ko',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 15,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__RELEASE_TYPE: {
        locale: 'ko',
        sysKey: 'SESSION__RELEASE_TYPE',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'RELEASE_TYPE',
        envNm: '차단계정 해지 방법',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 자동해지, 수동해지',
        sort: 10,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISKB3TH_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISKB3TH_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISKB3TH_DUR',
        envNm: '3차백업 임계치 지속시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~20초)',
        sort: 36,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__EXFIRE_EXTENSION: {
        locale: 'ko',
        sysKey: 'SESSION__EXFIRE_EXTENSION',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'EXFIRE_EXTENSION',
        envNm: '만료계정 기본 연장일수',
        value: '',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : 일',
        sort: 7,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__OTP_DOMAIN: {
        locale: 'ko',
        sysKey: 'SESSION__OTP_DOMAIN',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'OTP_DOMAIN',
        envNm: '도메인 정보',
        value: 'hanssak',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사업장 도메인',
        sort: 1,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__SSH_RELAY_PORT_START: {
        locale: 'ko',
        sysKey: 'AM_RULE__SSH_RELAY_PORT_START',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'SSH_RELAY_PORT_START',
        envNm: '중계포트시작(SSH)',
        value: '40000',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트시작(SSH)',
        sort: 10,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__LOG_KEEP_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__LOG_KEEP_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'LOG_KEEP_DUR',
        envNm: '로그 보관 기간',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (1~5년)',
        sort: 40,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__FTP_RELAY_PORT_END: {
        locale: 'ko',
        sysKey: 'AM_RULE__FTP_RELAY_PORT_END',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'FTP_RELAY_PORT_END',
        envNm: '중계포트종료(FTP)',
        value: '43999',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트종료(FTP)',
        sort: 17,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__SESSION_IDLE_TIMEOUT: {
        locale: 'ko',
        sysKey: 'AM_RULE__SESSION_IDLE_TIMEOUT',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어정책',
        envKey: 'SESSION_IDLE_TIMEOUT',
        envNm: '세션 유휴시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '1~60(분)',
        sort: 21,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__AGENT_CHGPWD_TIME: {
        locale: 'ko',
        sysKey: 'AM_RULE__AGENT_CHGPWD_TIME',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'AGENT_CHGPWD_TIME',
        envNm: '패스워드 변경 알람',
        value: '3',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '지정일 이전 패스워드 변경 알람 (3~10)',
        sort: 9,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      ALLOW_IP__IP2: {
        locale: 'ko',
        sysKey: 'ALLOW_IP__IP2',
        envGrpKey: 'ALLOW_IP',
        envGrpNm: '접속 허용 IP',
        envKey: 'IP2',
        envNm: '접속 허용 IP2',
        value: '192.168.1.163',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 4,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      ALLOW_IP__IP1: {
        locale: 'ko',
        sysKey: 'ALLOW_IP__IP1',
        envGrpKey: 'ALLOW_IP',
        envGrpNm: '접속 허용 IP',
        envKey: 'IP1',
        envNm: '접속 허용 IP1',
        value: '192.168.1.139',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 3,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      ALLOW_IP__IP0: {
        locale: 'ko',
        sysKey: 'ALLOW_IP__IP0',
        envGrpKey: 'ALLOW_IP',
        envGrpNm: '접속 허용 IP',
        envKey: 'IP0',
        envNm: '고정 아이피',
        value: '127.0.0.1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '화면 표시X',
        sort: 2,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__AUTH_EXFIRE: {
        locale: 'ko',
        sysKey: 'SESSION__AUTH_EXFIRE',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'AUTH_EXFIRE',
        envNm: '만료계정 설정 여부',
        value: 'N',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용, 미사용',
        sort: 6,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      ALLOW_IP__ALLOW_IP_TYPE: {
        locale: 'ko',
        sysKey: 'ALLOW_IP__ALLOW_IP_TYPE',
        envGrpKey: 'ALLOW_IP',
        envGrpNm: '접속 허용 IP',
        envKey: 'ALLOW_IP_TYPE',
        envNm: 'IP 접근 제한 설정',
        value: 'N',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용, 미사용',
        sort: 1,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_PWD_IN_ID: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_PWD_IN_ID',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_PWD_IN_ID',
        envNm: '패스워드 ID 포함 금지',
        value: 'Y',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용, 미사용',
        sort: 6,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__PC_ADDR_WAY: {
        locale: 'ko',
        sysKey: 'SESSION__PC_ADDR_WAY',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'PC_ADDR_WAY',
        envNm: '웹접속PC 제어 구분',
        value: '3',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* IP, MAC, IP+MAC',
        sort: 13,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__AGENT_VER: {
        locale: 'ko',
        sysKey: 'SYSTEM__AGENT_VER',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'AGENT_VER',
        envNm: 'AGENT VERSION',
        value: '',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 4,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__ENGINE_VER: {
        locale: 'ko',
        sysKey: 'SYSTEM__ENGINE_VER',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'ENGINE_VER',
        envNm: '엔진 VERSION',
        value: '2.0.02444',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 2,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      AM_RULE__TELNET_RELAY_PORT_START: {
        locale: 'ko',
        sysKey: 'AM_RULE__TELNET_RELAY_PORT_START',
        envGrpKey: 'AM_RULE',
        envGrpNm: '접근제어 정책',
        envKey: 'TELNET_RELAY_PORT_START',
        envNm: '중계포트시작(TELNET)',
        value: '42000',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '중계포트시작(TELNET)',
        sort: 14,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK2_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK2_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK2_DUR',
        envNm: 'DISK2 임계치 지속시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~20초)',
        sort: 21,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_EMIN_LEN: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_EMIN_LEN',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_EMIN_LEN',
        envNm: '계정 최소 영문자수',
        value: '2',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '',
        sort: 2,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK2_RATE: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK2_RATE',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK2_RATE',
        envNm: 'DISK2 임계치',
        value: '80',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~80%)',
        sort: 20,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_KEEP_TIME: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_KEEP_TIME',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_KEEP_TIME',
        envNm: '패스워드 유지 시간',
        value: '10',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '* 단위 : 분',
        sort: 7,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SMTP_PWD: {
        locale: 'ko',
        sysKey: 'SYSTEM__SMTP_PWD',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SMTP_PWD',
        envNm: '메일서버 비밀번호',
        value: 'hsck@2301!',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* SMTP_PWD',
        sort: 12,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__DISK4_DUR: {
        locale: 'ko',
        sysKey: 'SYSTEM__DISK4_DUR',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'DISK4_DUR',
        envNm: 'DISK4 임계치 지속시간',
        value: '10',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 단위 : (5~20초)',
        sort: 27,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SELFTEST_REACT: {
        locale: 'ko',
        sysKey: 'SYSTEM__SELFTEST_REACT',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SELFTEST_REACT',
        envNm: '자체시험 실패 처리',
        value: 'N',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 자체시험 실패 프로세스 중지',
        sort: 38,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__SMTP_ID: {
        locale: 'ko',
        sysKey: 'SYSTEM__SMTP_ID',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'SMTP_ID',
        envNm: '메일서버ID',
        value: 'hfax@hanssak.co.kr',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* SMTP ID',
        sort: 11,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__INTEGRITY_REACT: {
        locale: 'ko',
        sysKey: 'SYSTEM__INTEGRITY_REACT',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'INTEGRITY_REACT',
        envNm: '무결성 실패 처리',
        value: 'N',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 무결성 실패 프로세스 중지',
        sort: 37,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      USER_RULE__ID_PWD_CHG_WAY: {
        locale: 'ko',
        sysKey: 'USER_RULE__ID_PWD_CHG_WAY',
        envGrpKey: 'USER_RULE',
        envGrpNm: '사용자 정보 규칙',
        envKey: 'ID_PWD_CHG_WAY',
        envNm: '패스워드 변경 방식',
        value: '1',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 강제변경, 변경유도',
        sort: 5,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SYSTEM__BACKUP_DAY: {
        locale: 'ko',
        sysKey: 'SYSTEM__BACKUP_DAY',
        envGrpKey: 'SYSTEM',
        envGrpNm: '시스템 설정',
        envKey: 'BACKUP_DAY',
        envNm: '로그/DB 백업 일자',
        value: '17',
        appType: '0',
        appTypeNm: 'ALL',
        comment: 'ex) 10',
        sort: 42,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      SESSION__AUTH_INACTIVE: {
        locale: 'ko',
        sysKey: 'SESSION__AUTH_INACTIVE',
        envGrpKey: 'SESSION',
        envGrpNm: '인증및세션',
        envKey: 'AUTH_INACTIVE',
        envNm: '휴면계정 설정 여부',
        value: 'Y',
        appType: '0',
        appTypeNm: 'ALL',
        comment: '* 사용, 미사용',
        sort: 14,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
      PF_RULE__PF_PWD_DWN_ENCPT: {
        locale: 'ko',
        sysKey: 'PF_RULE__PF_PWD_DWN_ENCPT',
        envGrpKey: 'PF_RULE',
        envGrpNm: '플랫폼 정보 규칙',
        envKey: 'PF_PWD_DWN_ENCPT',
        envNm: '다운로드 파일 암호화',
        value: 'N',
        appType: '1',
        appTypeNm: '패스워드',
        comment: '',
        sort: 9,
        envGrpKeys: null,
        envKeys: null,
        values: null,
        status: null,
        regUserSeq: 0,
        updUserSeq: 0,
        comboMap: null,
        envGrpNmKo: null,
        envGrpNmEn: null,
        envNmKo: null,
        envNmEn: null,
      },
    },
  },
};

function SolutionInfoManage() {
  const intl = useIntl();

  const { data: session } = useSession();

  // api 호출함수
  const [apiCall, openModal] = useApi();
  // 재랜더링 flag
  const [reRender, setReRender] = useState(false);
  // 로딩 flag
  const [isLoading, setIsLoading] = useState(true);

  // 솔루션환경설정 그룹 Key (탭) 리스트
  const [tabGrpKeyNmList, setTabGrpKeyNmList] = useState([]);
  // 솔루션환경설정 콤보 리스트
  const [comboMapList, setComboMapList] = useState([]);

  // 선택된 Tab의 index 번호
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // disabled 처리할 envKey 리스트 { index(int): boolean }
  const [disableList, setDisableList] = useState({});

  const methods = useForm({
    defaultValues: { envGrpKeys: [], envKeys: [], values: [], envNm: [], comment: [] },
  });
  // 저장 메소드
  const saveMethods = useForm({
    defaultValues: { envGrpkeys: [], envKeys: [], values: [], updUserSeq: session.user.userSeq },
  });

  // 초기 disabled 처리해주는 함수
  const disabledInit = () => {
    //
  };

  // 리스트 조회
  const getList = async () => {
    const result = mockDataList;

    // 접속 허용 IP 필터링 (ex: IP0, IP1, IP2 를 제외한 나머지는 제거)
    let excludesList = Object.values(result.data.resultData).filter((data) => {
      if (/^(IP)[0-9]/.test(data.envKey)) {
        // IP 이후 숫자가 2자리보다 작고 3~9 숫자가 아닌 경우
        if (data.envKey.slice(2).length < 2 && !/^(IP)[3-9]/.test(data.envKey)) {
          return data;
        }
      } else {
        return data;
      }
    });

    // 목록에서 리스트 제외한 값
    excludesList = Object.values(excludesList).filter(
      (data) => !excludeEnvKeyList.includes(data.envKey),
    );

    const sortedData = [
      ...Object.values(excludesList).sort((a, b) => {
        // envGrpKey 먼저 정렬
        const sysKeyComparison = a.envGrpKey.localeCompare(b.envGrpKey);
        if (sysKeyComparison === 0) {
          // envGrpkey로 정렬 후 sort로 정렬
          return a.sort - b.sort;
        } else {
          return sysKeyComparison;
        }
      }),
    ];

    // 그룹 명 리스트 생성(TabList 사용)
    makeTabList(result.data.resultData);

    // 콤보 생성
    makeComboList();

    // methods 값 세팅
    sortedData.map((data, i) => {
      // 실제 필요한 값
      methods.setValue(`envGrpKeys[${i}]`, data.envGrpKey);
      methods.setValue(`envKeys[${i}]`, data.envKey);
      methods.setValue(`values[${i}]`, data.value);
      // 화면 출력 용도
      methods.setValue(`envNm[${i}]`, data.envNm);
      methods.setValue(`comment[${i}]`, data.comment);
    });

    setIsLoading(false);
  };

  // TabList 만들기
  const makeTabList = (envDataList) => {
    // {envGrpKey, envGrpNm}

    const uniqueEnvList = [];
    Object.values(envDataList).forEach((item) => {
      // Object.values(envDataList).forEach((item) => {
      const { envGrpKey, envGrpNm } = item;
      if (!uniqueEnvList.find((entry) => entry.envGrpKey === envGrpKey)) {
        uniqueEnvList.push({ envGrpKey, envGrpNm });
      }
    });
    // 그룹 명 리스트 생성(TabList 사용)
    let list = [];
    defaultTabList.map((item, i) => {
      // 기본 TabList 만들기
      let envGrpKey = Object.keys(item)[0];
      let envGrpNm = uniqueEnvList.find(
        (uniqueItem) => uniqueItem.envGrpKey === envGrpKey,
      )?.envGrpNm;
      list = [...list, { label: envGrpNm, value: i, envGrpKey: envGrpKey }];
    });

    // DB에서 읽어온 데이터와 defaultTabList가 매핑되지 않은 경우 GrpKey 추가
    const defaultList = defaultTabList.map((obj) => Object.keys(obj)[0]);
    const remainEnvGrpList = uniqueEnvList.filter((data) => !defaultList.includes(data.envGrpKey));
    remainEnvGrpList.map((item, i) => {
      list = [
        ...list,
        { label: item.envGrpNm, value: defaultList.length + i, envGrpKey: item.envGrpKey },
      ];
    });

    const filteredList = list.filter((item) => !excludeEnvGrpKeyList.includes(item.envGrpKey));
    list = []; // 초기화
    filteredList.map((data, i) => {
      list = [...list, { label: data.label, value: i, envGrpKey: data.envGrpKey }];
    });
    setTabGrpKeyNmList(list);
  };

  // 콤보 리스트 만들기(select box)
  const makeComboList = async () => {
    // const result = await solutionInfoListApi.getComboMap(comboMap);
    // setComboMapList(result.data.resultData);
    setComboMapList(mockComboList);
  };

  const doKeyupValue = (chgType, idx, blurFlag = false) => {
    /*
    switch (chgType) {
      case 'DISK1_RATE': //DISK1 임계치
      case 'DISK2_RATE': //DISK2 임계치
      case 'DISK3_RATE': //DISK3 임계치
      case 'DISK4_RATE': //DISK4 임계치
      case 'DISKB3TH_RATE': //3차백업 임계치
      case 'CPU_RATE': //CPU 임계치
      case 'MEM_RATE': //MEM 임계치
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 5, 80);
        chkIntRange(idx, 5, 80, 2);
        break;
      case 'WEB_NOTI_DUR_Y': //웹알림 보관 기간(열람)
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 5, 10);
        chkIntRange(idx, 5, 10, 2);
        break;
      case 'WEB_NOTI_DUR_N': //웹알림 보관 기간(미열람)
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 30, 180);
        else chkIntRange(idx, 30, 180, 3);
        break;
      case 'LOG_KEEP_DUR': //로그 보관 기간
        chkNumber(idx);
        chkIntRange(idx, 1, 5);
        break;
      case 'DISK1_DUR': //DISK1 임계치 지속시간
      case 'DISK2_DUR': //DISK2 임계치 지속시간
      case 'DISK3_DUR': //DISK3 임계치 지속시간
      case 'DISK4_DUR': //DISK4 임계치 지속시간
      case 'CPU_DUR': //CPU 임계치 지속시간
      case 'MEM_DUR': //MEMORY 임계치 지속시간
      case 'DISKB3TH_DUR': //3차백업 임계치 지속시간
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 5, 20);
        chkIntRange(idx, 5, 20, 2);
        break;
      // case 'LOGIN_SESSION': //중복로그인
      //   chkNumber(idx);
      //   chkIntRange(idx, 1, 10);
      //   break;
      case 'MGR_TIMEOUT': //관리자 세션 타임아웃 시간
      case 'USER_TIMEOUT': //사용자 세션 타임아웃 시간
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 6, 600);
        chkIntRange(idx, 6, 600, 3);
        break;
      case 'AUTH_FAIL': //인증 오류 횟수
        chkNumber(idx);
        chkIntRange(idx, 2, 5);
        break;
      case 'RELEASE_TIME': //차단계정 잠김 시간
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 5, 60);
        chkIntRange(idx, 5, 60, 2);
        break;
      //case 'OTP_DOMAIN':
      // methods.setValue(
      //   `values[${idx}]`,
      //  methods.getValues(`values[${idx}]`).replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, ''),
      // );
      //break;
      case 'INACTIVE_DAY': //휴면계정 유예기간
      case 'EXFIRE_EXTENSION': //만료계정 기본 연장일수
      case 'EXFIRE_NOTI_DAY': //만료계정 알림일 설정
        chkNumber(idx);
        chkIntRange(idx, 1, 180);
        break;
      // case 'INACTIVE_NOTI_DAY': //휴면 알림일 설정
      //   chkNumber(idx);
      //   chkIntRange(idx, 1, 180);
      //   chkInactiveNotiDay(idx);
      //   break;

      case 'PWD_MIN_LEN': //패스워드 최소길이
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 9, 32);
        else chkIntRange(idx, 9, 32, 2);
        break;
      case 'PWD_MAX_LEN': //패스워드 최대길이
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 15, 32);
        else chkIntRange(idx, 15, 32, 2);
        break;
      case 'ES_MIN_LEN': //영소문자 최소 길이
      case 'EB_MIN_LEN': //영대문자 최소 길이
      case 'NUM_MIN_LEN': //숫자 최소 길이
      case 'SC_MIN_LEN': //특수문자 최소 길이
      case 'CC_CNT_LIMIT': //연속문자 개수 제한
      case 'SC_CNT_LIMIT': //동일문자 개수 제한
        chkNumber(idx);
        chkIntRange(idx, 1, 3);
        break;
      case 'ID_MIN_LEN': //계정 최소 길이
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 3, 32);
        chkIntRange(idx, 3, 32, 2);
        break;
      case 'ID_EMIN_LEN': //계정 최소 영문자수
      case 'ID_NMIN_LEN': //계정 최소 숫자수
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 0, 5);
        chkIntRange(idx, 0, 5);
        break;
      case 'ID_PWD_CHG_DAY': //패스워드 변경 주기
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 10, 90);
        else chkIntRange(idx, 10, 90, 2);
        break;
      case 'PF_PWD_DUP_DAY': //패스워드 중복 방지 기간
      case 'AGENT_LOCK_TIME': // 화면잠김 시간(접근제어 정책)
        chkNumber(idx);
        chkIntRange(idx, 1, 10);
        break;
      //case 'IP_MAX_LEN':					// 사용자 IP 최대 개수   웹접속주소
      //	chkNumber(idx); 웹접속주소
      //	chkIntRange(idx, 1, 5); 웹접속주소
      //	break; 웹접속주소
      case 'AGENT_TIMEOUT': // 세션 타임아웃(접근제어 정책)
      case 'AGENT_BOARD_TIME': // 공지사항 업데이트 주기 (접근제어 정책)
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 10, 60);
        else chkIntRange(idx, 10, 60, 2);
        break;
      case 'LINKCHECK_TIME': // Linkcheck 주기(접근제어 정책)
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 30, 60);
        else chkIntRange(idx, 30, 60, 2);
        break;
      case 'AGENT_EVENT_TIME': // 이벤트 업데이트 주기(접근제어 정책)
        chkNumber(idx);
        if (blurFlag) chkIntRange(idx, 10, 30);
        else chkIntRange(idx, 10, 30, 2);
        break;
      case 'POLICY_REFRESH_TIME': // 정책 자동 갱신 시간(접근제어 정책)
      case 'SESSION_IDLE_TIMEOUT': // 세션 유휴시간(접근제어 정책)
        chkNumber(idx);
        chkIntRange(idx, 1, 60);
        break;
      case 'AGENT_CHGPWD_TIME': // 패스워드 변경 알람
        chkNumber(idx);
        chkIntRange(idx, 3, 10);
        break;

      case 'PF_PWD_BWORK_TIME': // 기본 작업신청 시간
      case 'PF_PWD_MWORK_TIME': // 최대 작업신청 시간
      case 'PF_PWD_SDAY': // 패스워드 조회 시간
      case 'PF_ID_DORMANCY_DAYS': // 시스템계정 휴면 설정일
      case 'SSH_RELAY_PORT_START': // 중계포트시작(SSH)
      case 'SSH_RELAY_PORT_END': // 중계포트종료(SSH)
      case 'SFTP_RELAY_PORT_START': // 중계포트시작(SFTP)
      case 'SFTP_RELAY_PORT_END': // 중계포트종료(SFTP)
      case 'TELNET_RELAY_PORT_START': // 중계포트시작(TELNET)
      case 'TELNET_RELAY_PORT_END': // 중계포트종료(TELNET)
      case 'FTP_RELAY_PORT_START': // 중계포트시작(FTP)
      case 'FTP_RELAY_PORT_END': // 중계포트종료(FTP)
      case 'RDP_RELAY_PORT_START': // 중계포트시작(RDP)
      case 'RDP_RELAY_PORT_END': // 중계포트시작(RDP)
        chkNumber(idx);
        break;

      // default:
      //   handleInfoModalOpen('잘못된 요청 입니다.');
    }
      */
  };

  const doSave = async () => {
    console.log('doSave()');

    const currentEnvGrpKey = tabGrpKeyNmList[selectedTabIndex].envGrpKey;
    const indexList = methods
      .getValues('envGrpKeys')
      .map((data, i) => {
        if (data === currentEnvGrpKey) return i;
        return undefined;
      })
      .filter((index) => index !== undefined);

    let saveEnvGrpKeys = [];
    let saveEnvKeys = [];
    let saveValues = [];

    indexList.map((i) => {
      saveEnvGrpKeys.push(methods.getValues(`envGrpKeys[${i}]`));
      saveEnvKeys.push(methods.getValues(`envKeys[${i}]`));
      saveValues.push(methods.getValues(`values[${i}]`));
    });

    saveMethods.setValue('envGrpKeys', saveEnvGrpKeys);
    saveMethods.setValue('envKeys', saveEnvKeys);
    saveMethods.setValue('values', saveValues);

    console.log(saveMethods.getValues());
  };

  const doSaveAll = () => {
    console.log('doSaveAll()');
  };

  // 초기화 작업
  const init = async () => {
    await getList();
  };

  useEffect(() => {
    init();
  }, [reRender]);

  // <GridItem spacing={2} container direction="column">

  return isLoading ? (
    <Loader isGuard />
  ) : (
    <GridItem item container direction="row" sx={{ mt: 3 }}>
      <GridItem item sx={{ width: '100%', position: 'relative' }}>
        <TabList tabList={tabGrpKeyNmList} setIndex={setSelectedTabIndex} index={selectedTabIndex}>
          {tabGrpKeyNmList.map((grpKey, a) => (
            <GridItem key={`stack_step_${a}`}>
              <FormProvider {...methods}>
                <form id={`${grpKey.envGrpkey}`} onSubmit={methods.handleSubmit(doSave)}>
                  <GridItem
                    container
                    direction="row"
                    columnSpacing={1}
                    divideColumn={6} // 번역오는거봐서 짤리면 5개 intl.locale 로 ko, en 분기태워서 6,5 개
                    sx={{
                      '& .text': { maxWidth: '250px', minWidth: '250px' }, // 번역오는거봐서 짤리면 5개 intl.locale 로 ko, en 분기태워서 길이 바꾸자
                      '.inputBox': { maxWidth: '240px', minWidth: '240px' }, // 번역오는거봐서 짤리면 5개 intl.locale 로 ko, en 분기태워서 길이 바꾸자
                    }}
                  >
                    {Object.values(methods.getValues('envGrpKeys')).map((data, b) => {
                      return (
                        data === grpKey.envGrpKey &&
                        methods.getValues(`envKeys[${b}]`) !== 'BACKUP_WEEK' &&
                        methods.getValues(`envKeys[${b}]`) !== 'BACKUP_DAY' &&
                        methods.getValues(`envKeys[${b}]`) !== 'BACKUP_HOUR' &&
                        methods.getValues(`envKeys[${b}]`) !== 'BACKUP_HOUR_H' &&
                        methods.getValues(`envKeys[${b}]`) !== 'BACKUP_HOUR_M' && (
                          <Stack
                            key={`stack_step_${b}`}
                            colSpan={
                              methods.getValues(`envKeys[${b}]`) === 'BACKUP_CYCLE'
                                ? 2
                                : methods.getValues(`envKeys[${b}]`) === 'AGENT_HASH'
                                  ? 3
                                  : 1
                            }
                            direction="column"
                            alignItems="flex-start"
                            sx={{ mb: 1.5, mt: 1 }}
                          >
                            <Label
                              label={
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_CYCLE' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_WEEK' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_DAY' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_HOUR' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_HOUR_H' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_HOUR_M' ? (
                                  methods.getValues(`envKeys[${b}]`) === 'BACKUP_CYCLE' && (
                                    <>
                                      {methods.getValues(`envNm[${b}]`)}
                                      <HtmlTooltip
                                        placement="top-start"
                                        title={
                                          <>
                                            <b
                                              style={{
                                                color: '#3c8dbc',
                                                fontWeight: '700',
                                                fontSize: '14px',
                                              }}
                                            >
                                              {methods.getValues(`comment[${b}]`)}
                                            </b>
                                          </>
                                        }
                                      >
                                        <Info
                                          color="primary" // 하늘색
                                          //color="error" // 밝은 하늘색
                                          //color="secondary" // 회색
                                          //color="action" // 짙은 회색
                                          sx={{
                                            fontSize: '1.25rem',
                                            verticalAlign: 'top',
                                            ml: 0.5,
                                          }}
                                        />
                                      </HtmlTooltip>
                                    </>
                                  )
                                ) : methods.getValues(`comment[${b}]`) !== '' ? (
                                  <>
                                    {methods.getValues(`envNm[${b}]`)}
                                    <HtmlTooltip
                                      placement="top-start"
                                      title={
                                        <>
                                          <b
                                            style={{
                                              color: '#3c8dbc',
                                              fontWeight: '700',
                                              fontSize: '14px',
                                            }}
                                          >
                                            {methods.getValues(`comment[${b}]`)}
                                          </b>
                                        </>
                                      }
                                    >
                                      <Info
                                        color="primary" // 하늘색
                                        //color="error" // 밝은 하늘색
                                        //color="secondary" // 회색
                                        //color="action" // 짙은 회색
                                        sx={{
                                          fontSize: '1.25rem',
                                          verticalAlign: 'top',
                                          ml: 0.5,
                                        }}
                                      />
                                    </HtmlTooltip>
                                  </>
                                ) : methods.getValues(`envKeys[${b}]`) === 'IP1' ||
                                  methods.getValues(`envKeys[${b}]`) === 'IP2' ? (
                                  <>
                                    {methods.getValues(`envNm[${b}]`)}
                                    {!disableList[b] && (
                                      <AddBox
                                        color={addBtnColor[b] ? addBtnColor[b] : 'primary'} // 하늘색
                                        //color="primary" // 짙은 하늘색
                                        //color="error" // 밝은 하늘색 - 20231012 색상값 defult로 수정됨
                                        //color="secondary" // 회색
                                        //color="action" // 짙은 회색
                                        sx={{
                                          cursor: 'pointer',
                                          fontSize: '1.20rem',
                                          verticalAlign: 'bottom',
                                          ml: 0.3,
                                        }}
                                        onMouseOver={() =>
                                          setAddBtnColor((prev) => ({ ...prev, [b]: 'secondary' }))
                                        } // 마우스 오버 시
                                        onMouseOut={() =>
                                          setAddBtnColor((prev) => ({ ...prev, [b]: 'primary' }))
                                        } // 마우스 아웃 시
                                        onClick={handleAllowIpModalOpen}
                                      />
                                    )}
                                  </>
                                ) : (
                                  methods.getValues(`envNm[${b}]`)
                                )
                              }
                              labelSx={{
                                pl: 0,
                                mb: '3px',
                                fontWeight: '600',
                                flexDirection: 'row',
                              }}
                            />
                            {
                              // input box
                              !comboMap
                                .map((item) => Object.keys(item)[0])
                                .includes(methods.getValues(`envKeys[${b}]`)) &&
                              methods.getValues(`envKeys[${b}]`) !== 'BACKUP_HOUR' ? (
                                <LabelInput
                                  typingCheck
                                  maxLength={128}
                                  sx={{
                                    '.inputBox':
                                      methods.getValues(`envKeys[${b}]`) === 'AGENT_HASH'
                                        ? {
                                            maxWidth: '769px !important',
                                            minWidth: '769px !important',
                                          }
                                        : {},
                                  }}
                                  htmlType={
                                    methods.getValues(`envKeys[${b}]`) === 'SMTP_PWD'
                                      ? 'password'
                                      : null
                                  } // 보안적합성
                                  {...(methods.getValues(`envKeys[${b}]`) === 'IP1' ||
                                  methods.getValues(`envKeys[${b}]`) === 'IP2'
                                    ? {
                                        maskOptions: {
                                          type: 'ipv4',
                                        },
                                      }
                                    : {})}
                                  // 마스킹 옵션
                                  maskOptions={
                                    methods.getValues(`envKeys[${b}]`) === 'IP1' ||
                                    methods.getValues(`envKeys[${b}]`) === 'IP2'
                                      ? {
                                          type: 'ipv4',
                                        }
                                      : methods.getValues(`envKeys[${b}]`) === 'SYS_MGR_EMAIL'
                                        ? {
                                            type: 'email',
                                          }
                                        : null
                                  }
                                  style={
                                    disableList[b]
                                      ? { backgroundColor: theme.palette.grey[100] }
                                      : null
                                  }
                                  disabled={disableList[b]}
                                  name={`values[${b}]`}
                                  onKeyUp={() =>
                                    doKeyupValue(methods.getValues(`envKeys[${b}]`), b)
                                  }
                                  inputProps={{
                                    onBlur: () => {
                                      onBlurEnvKeyList.includes(methods.getValues(`envKeys[${b}]`))
                                        ? doKeyupValue(methods.getValues(`envKeys[${b}]`), b, true)
                                        : null;
                                    },
                                  }}
                                />
                              ) : methods.getValues(`envKeys[${b}]`) === 'BACKUP_CYCLE' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_WEEK' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_DAY' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_HOUR' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_HOUR_H' ||
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_HOUR_M' ? (
                                methods.getValues(`envKeys[${b}]`) === 'BACKUP_CYCLE' && (
                                  // 로그 백업 주기
                                  <Stack direction="row" spacing={0.4}>
                                    <LabelInput
                                      type="select"
                                      disabledefault
                                      sx={{
                                        '.inputBox': {
                                          maxWidth: '80px !important',
                                          minWidth: '80px !important',
                                        },
                                      }}
                                      name={`values[${b}]`}
                                      list={comboMapList
                                        .filter(
                                          (item) =>
                                            Object.keys(item)[0] ===
                                            methods.getValues(`envKeys[${b}]`),
                                        )
                                        .flatMap(
                                          (item) => item[methods.getValues(`envKeys[${b}]`)],
                                        )}
                                    />
                                    {/* 로그 백업 일자 */}
                                    {methods.watch(`values[${b}]`) === '3' && (
                                      <LabelInput
                                        type="select"
                                        disabledefault
                                        sx={{
                                          '.inputBox': {
                                            maxWidth: '90px !important',
                                            minWidth: '90px !important',
                                          },
                                        }}
                                        name={`values[${b + 1}]`}
                                        list={comboMapList
                                          .filter(
                                            (item) =>
                                              Object.keys(item)[0] ===
                                              methods.getValues(`envKeys[${b + 1}]`),
                                          )
                                          .flatMap(
                                            (item) => item[methods.getValues(`envKeys[${b + 1}]`)],
                                          )}
                                      />
                                    )}
                                    {/* 로그 백업 요일 */}
                                    {methods.watch(`values[${b}]`) === '2' && (
                                      <LabelInput
                                        type="select"
                                        disabledefault
                                        sx={{
                                          '.inputBox': {
                                            maxWidth: '100px !important',
                                            minWidth: '100px !important',
                                          },
                                        }}
                                        name={`values[${b + 2}]`}
                                        list={comboMapList
                                          .filter(
                                            (item) =>
                                              Object.keys(item)[0] ===
                                              methods.getValues(`envKeys[${b + 2}]`),
                                          )
                                          .flatMap(
                                            (item) => item[methods.getValues(`envKeys[${b + 2}]`)],
                                          )}
                                      />
                                    )}
                                    {/* 로그 백업 시 */}
                                    <LabelInput
                                      type="select"
                                      disabledefault
                                      sx={{
                                        '.inputBox': {
                                          maxWidth: '80px !important',
                                          minWidth: '80px !important',
                                        },
                                      }}
                                      name={`values[${b + 4}]`}
                                      list={comboMapList
                                        .filter(
                                          (item) =>
                                            Object.keys(item)[0] ===
                                            methods.getValues(`envKeys[${b + 4}]`),
                                        )
                                        .flatMap(
                                          (item) => item[methods.getValues(`envKeys[${b + 4}]`)],
                                        )}
                                    />
                                    {/* 로그 백업 분 */}
                                    <LabelInput
                                      type="select"
                                      disabledefault
                                      sx={{
                                        '.inputBox': {
                                          maxWidth: '80px !important',
                                          minWidth: '80px !important',
                                        },
                                      }}
                                      name={`values[${b + 5}]`}
                                      list={comboMapList
                                        .filter(
                                          (item) =>
                                            Object.keys(item)[0] ===
                                            methods.getValues(`envKeys[${b + 5}]`),
                                        )
                                        .flatMap(
                                          (item) => item[methods.getValues(`envKeys[${b + 5}]`)],
                                        )}
                                    />
                                  </Stack>
                                )
                              ) : (
                                // select box
                                <LabelInput
                                  type="select"
                                  disabledefault
                                  style={
                                    disableList[b]
                                      ? { backgroundColor: theme.palette.grey[100] }
                                      : null
                                  }
                                  disabled={disableList[b]}
                                  name={`values[${b}]`}
                                  list={comboMapList
                                    .filter(
                                      (item) =>
                                        Object.keys(item)[0] === methods.getValues(`envKeys[${b}]`),
                                    )
                                    .flatMap((item) => item[methods.getValues(`envKeys[${b}]`)])}
                                />
                              )
                            }
                          </Stack>
                        )
                      );
                    })}
                  </GridItem>
                </form>
              </FormProvider>
            </GridItem>
          ))}
        </TabList>
        <ButtonSet
          type="custom"
          sx={{ position: 'absolute', top: '0px', right: '0px' }}
          options={[
            {
              //label: `${tabGrpKeyNmList[selectedTabIndex].label} 저장`,
              label: `${tabGrpKeyNmList[selectedTabIndex].label} ${intl.formatMessage({
                id: 'common.btn-save',
              })}`,
              color: 'primary',
              variant: 'contained',
              callBack: doSave,
            },
            // {
            //   //label: '일괄 저장',
            //   label: intl.formatMessage({ id: 'common.btn-save-all' }),
            //   color: 'primary',
            //   variant: 'contained',
            //   callBack: doSaveAll,
            // },
          ]}
        />

        {/* 접속 허용 IP 모달 */}
        {/* <PopUp
        maxWidth="md"
        alertOpen={isAllowIpModalOpen}
        closeAlert={setIsAllowIpModalOpen}
        disableCancel
        disableConfirm
        //title="접속 허용 IP 정보"
        title={intl.formatMessage({ id: 'system.systemInfoIpModal-title' })}
      >
        <SolutionInfoListIpModal
          api={solutionInfoListApi}
          ip={modalIp}
          setOpen={setIsAllowIpModalOpen}
          setReRender={setReRender}
        />
      </PopUp> */}
      </GridItem>
    </GridItem>
  );
}

SolutionInfoManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SolutionInfoManage;
