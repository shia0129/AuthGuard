import { styled } from '@mui/styles';
// Project import
// import chksumInfoApi from '@api/system/chksumInfoApi';
import HsLib from '@modules/common/HsLib';
import GridItem from '@components/modules/grid/GridItem';
import useApi from '@modules/hooks/useApi';
import usePopup from '@modules/hooks/usePopup';
import {
  Button,
  Stack,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
  ListItem,
  ListItemButton,
  Chip,
} from '@mui/material';
import { useIntl } from 'react-intl';

const LIST_STACK_STYLE = {
  pt: 1,
  pb: 1,
  pr: 2,
  pl: 2,
  borderBottom: '2px solid #e8e6e6c9',
  width: '100%',
  justifyContent: 'space-between',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const LIST_TEXT_STYLE = {
  cursor: 'default',
  fontSize: '0.9rem',
};

const LIST_CHIP_STYLE = {
  ...LIST_TEXT_STYLE,
  height: '22px',
  color: '#fff',
  borderRadius: '10px 10px 10px 10px / 10px 10px 10px 10px',
};

const LoadingCircle = () => (
  <CircularProgress
    sx={{
      mr: 1,
      alignSelf: 'center',
    }}
    size={20}
    thickness={5}
  />
);

const SwitchButton = styled(Switch)(({ theme, disabledColorFlag }) => ({
  padding: 8,
  height: 40,
  width: 64,
  '& .Mui-checked + .MuiSwitch-track': {
    backgroundColor: disabledColorFlag ? '#818181' : '#008ABB',
    opacity: disabledColorFlag ? 0.3 : 1,
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: disabledColorFlag ? '#818181' : '#cc0000',
    opacity: disabledColorFlag ? 0.3 : 1,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      fontSize: '8.6px', // 글꼴 크기 설정
      fontWeight: 600,
      content: '"ON"', // content 속성을 사용하여 텍스트를 추가합니다.
      color: theme.palette.getContrastText(theme.palette.primary.main), // 텍스트 색상 설정
      position: 'absolute', // 절대 위치 설정
      left: 13,
      top: 22.5,
    },
    '&::after': {
      fontSize: '8.6px', // 글꼴 크기 설정
      fontWeight: 600,
      content: '"OFF"', // content 속성을 사용하여 텍스트를 추가합니다.
      color: theme.palette.getContrastText(theme.palette.primary.main), // 텍스트 색상 설정
      position: 'absolute', // 절대 위치 설정
      right: 13,
      top: 22.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 18,
    height: 18,
    top: 11,
    position: 'absolute',
    transform: 'translateX(+40%)',
    left: 5, // 왼쪽으로 이동하여 텍스트와 일치하도록 설정
  },
}));

/**
 * @param {Object} groupNm              : 무결성 그룹 이름
 * @param {Object} statInfo             : 무결성 상태 정보 Dto
 * @param {Object} networkFail          : 네트워크 실패 정보  true, false
 * @param {Object} buttonStyle          : 버튼 스타일 정보
 * @param {Function} getChksumStatData  : 검사 끄기(ON/OFF), Hash 생성, 검사 동작 후 데이터 바로 갱신을 위한 함수
 * @param {String(long)} regUserSeq     : 요청(등록)자 순번
 * @returns 무결성 상태 정보 및 조작
 */
function ChksumStat({
  groupNm,
  statInfo,
  networkFail,
  buttonStyle,
  getChksumStatData,
  regUserSeq,
}) {
  const intl = useIntl();

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  const handleOpenWindow = usePopup();

  // 무결성 검사 켜기/끄기  (flag: true=켜기 / false=끄기)
  const doChangeChksumRun = async (flag, systemId, groupId) => {
    const chksumRun = flag === true ? '1' : '2';
    console.log('doChangeChksumRun()');
    // const result = await apiCall(chksumInfoApi.updateChksumRunInfo, {
    //   systemId,
    //   groupId,
    //   chksumRun,
    // });
    // if (result.status === 200) {
    //   await getChksumStatData(); // 데이터 갱신
    // }
  };

  // Hash 생성 / 검사 요청
  const doChksumRequest = async (workType, systemId, groupId) => {
    console.log('doChksumRequest()');
    // const result = await apiCall(chksumInfoApi.insertChksumRequestInfo, {
    //   workType,
    //   systemId,
    //   groupId,
    //   regUserSeq,
    // });
    // if (result.status === 200) {
    //   await getChksumStatData(); // 데이터 갱신
    // }
  };

  // Hash 생성 / 검사 요청 Confirm
  // workType = '1': hash 생성, '2': 검사
  const handleChksumRequest = (workType, systemId, groupId) => {
    //workType === '1' ? `Hash 생성을 요청 하시겠습니까?` : `무결성 검사를 요청 하시겠습니까?`;
    const msg =
      workType === '1'
        ? intl.formatMessage({ id: 'system.chksumStat-confirm-hash' }, { 0: systemId, 1: groupNm })
        : intl.formatMessage(
            { id: 'system.chksumStat-confirm-chksum' },
            { 0: systemId, 1: groupNm },
          );
    openModal({
      message: (
        <>
          <Typography sx={{ cursor: 'default' }}>{msg}</Typography>
        </>
      ),
      onConfirm: () => {
        doChksumRequest(workType, systemId, groupId);
      },
    });
  };

  const doDetail = (chksumReq, systemId, groupId) => {
    handleOpenWindow({
      url: `${window.location.origin}/record/chksum/popup/chksumHisFailPopup`,
      openName: 'chksumHisFailPopup',
      width: '1126',
      height: '710',
      dataSet: {
        chksumReq,
        systemId,
        groupId,
      },
    });
  };

  return (
    <GridItem
      key={`chksumStat-${statInfo?.systemId}-${statInfo?.groupId}`}
      container
      direction="column"
      divideColumn={1}
      sx={{
        minWidth: '218px',
        maxWidth: '380px',
        height: '320px',
        display: 'block',
      }}
    >
      {/* header */}
      <GridItem
        item
        sx={{
          p: '8px 12px 8px 16px',
          borderRadius: '6px 6px 0px 0px / 6px 6px 0px 0px',
          backgroundColor:
            networkFail || statInfo === null || statInfo?.chksumStat === '0' // 네트워크 오류 또는 Stat 테이블에 정보가 없거나 또는 무결성 상태가 중지이면
              ? '#c7c7c7'
              : statInfo?.chksumStat === '9' // 무결성 상태가 오류이면
                ? '#f00505d9'
                : '#008500e8', // 무결성 상태가 정상이면
          display: 'inherit',
          width: '100%',
          height: '75px',
          ...(!networkFail &&
            statInfo !== null &&
            statInfo?.chksumStat === '9' && {
              animation: 'backgroundBlink 0.6s ease-in-out infinite alternate',
              WebkitAnimation: 'backgroundBlink 0.6s ease-in-out infinite alternate',
              MozAnimation: 'backgroundBlink 0.6s ease-in-out infinite alternate',
              '@keyframes backgroundBlink': {
                '0%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              },
              '@-webkit-keyframes backgroundBlink': {
                '0%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              },
              '@-moz-keyframes backgroundBlink': {
                '0%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              },
            }),
        }}
      >
        {/* 무결성 그룹이름 */}
        <Typography
          variant="h5"
          sx={{
            cursor: 'default',
            fontWeight: '400',
            fontSize: '1.1rem',
            color: '#fff',
          }}
        >
          {groupNm}
        </Typography>
        <Stack
          direction="row"
          sx={{
            mt: -1.3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              cursor: 'default',
              color: '#fff',
              lineHeight: 1.7,
            }}
          >
            {networkFail || statInfo === null ? '-' : statInfo?.chksumStatNm}
          </Typography>
          <Stack
            direction="row"
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <FormControlLabel
              sx={{ mr: -1 }}
              control={
                <SwitchButton
                  checked={
                    // 네트워크 정상, 무결성 상태값 존재, 무결성 동작 중이면 ON
                    !networkFail && statInfo !== null && statInfo?.chksumRun === '1'
                  }
                  defaultChecked={
                    // 네트워크 정상, 무결성 상태값 존재, 무결성 동작 중이면 ON
                    !networkFail && statInfo !== null && statInfo?.chksumRun === '1'
                  }
                  // 네트워크 상태 불량, 무결성 상태 정보가 없을 경우 disabled
                  disabled={networkFail || statInfo === null}
                  disabledColorFlag={
                    networkFail || statInfo === null || statInfo?.chksumStat === '0'
                      ? true // 네트워크 상태 불량, 무결성 상태 정보 없거나, 무결성 상태가 정지 상태이면 회색
                      : false // 아니면 정상 색
                  }
                />
              }
              onChange={(e, v) => {
                doChangeChksumRun(v, statInfo?.systemId, statInfo?.groupId);
              }}
            />
            <Button
              variant="contained"
              sx={{
                ...buttonStyle,
                fontSize: '12px',
                mr: 1,
                lineHeight: 1.55,
                minHeight: '15px',
                maxHeight: '15px',
              }}
              disabled={
                networkFail ||
                statInfo === null ||
                statInfo?.chksumStat === '0' ||
                statInfo?.chksumStat === '2' ||
                (statInfo?.chksumStat === '1' &&
                  (statInfo?.chksumStatNm === '요청' || statInfo?.chksumStatNm === 'Request')) ||
                statInfo?.chksumRun === '2'
              }
              className={
                //  네트워크 상태 불량, 무결성 상태 정보 없거나, 무결성 상태가 정지 상태이거나, 검사중이거나, 작업요청중, OFF이면 회색
                networkFail ||
                statInfo === null ||
                statInfo?.chksumStat === '0' ||
                statInfo?.chksumStat === '2' ||
                (statInfo?.chksumStat === '1' &&
                  (statInfo?.chksumStatNm === '요청' || statInfo?.chksumStatNm === 'Request')) ||
                statInfo?.chksumRun === '2'
                  ? 'disabled'
                  : ''
              }
              onClick={() => {
                handleChksumRequest('1', statInfo?.systemId, statInfo?.groupId);
              }}
            >
              {/* Hash 생성 */}
              {intl.formatMessage({ id: 'system.chksumInfo-btn-hashCreate' })}
            </Button>
            <Button
              variant="contained"
              sx={{
                ...buttonStyle,
                lineHeight: 1.55,
                minHeight: '15px', // 최소 높이 설정
                maxHeight: '15px', // 최대 높이 설정
                minWidth: '45px',
                fontSize: '12px',
              }}
              disabled={
                networkFail ||
                statInfo === null ||
                statInfo?.chksumStat === '0' ||
                statInfo?.chksumStat === '2' ||
                (statInfo?.chksumStat === '1' &&
                  (statInfo?.chksumStatNm === '요청' || statInfo?.chksumStatNm === 'Request')) ||
                statInfo?.chksumRun === '2'
              }
              className={
                //  네트워크 상태 불량, 무결성 상태 정보 없거나, 무결성 상태가 정지 상태이거나, 검사중이거나, 작업요청중, OFF이면 회색
                networkFail ||
                statInfo === null ||
                statInfo?.chksumStat === '0' ||
                statInfo?.chksumStat === '2' ||
                (statInfo?.chksumStat === '1' &&
                  (statInfo?.chksumStatNm === '요청' || statInfo?.chksumStatNm === 'Request')) ||
                statInfo?.chksumRun === '2'
                  ? 'disabled'
                  : ''
              }
              onClick={() => {
                handleChksumRequest('2', statInfo?.systemId, statInfo?.groupId);
              }}
            >
              {/* 검사 */}
              {intl.formatMessage({ id: 'system.chksumInfo-btn-check' })}
            </Button>
          </Stack>
        </Stack>
      </GridItem>

      {/* contents */}
      <GridItem
        item
        sx={{
          borderBottom: '2px solid #00000024',
          borderLeft: '2px solid #00000024',
          borderRight: '2px solid #00000024',
          borderRadius: '0px 0px 6px 6px / 0px 0px 6px 6px',
          display: 'inherit',
          width: '100%',
          //height: '250px',
        }}
      >
        <ListItem
          disablePadding // 패딩 없애기
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HASH 생성 시간 */}
          <Stack direction="row" sx={LIST_STACK_STYLE}>
            <Typography sx={LIST_TEXT_STYLE}>
              {/* HASH 생성 시간 */}
              {intl.formatMessage({ id: 'system.chksumStat-typo-createHashTime' })}
            </Typography>
            {statInfo?.workType === '1' ? (
              <LoadingCircle />
            ) : (
              <Typography sx={LIST_TEXT_STYLE}>
                {networkFail || !statInfo
                  ? '-'
                  : HsLib.changeDateFormat(statInfo?.hashDate, '$1-$2-$3 $4:$5:$6')}
              </Typography>
            )}
          </Stack>
          {/* 검사 시작 시간 */}
          <Stack direction="row" sx={LIST_STACK_STYLE}>
            <Typography sx={LIST_TEXT_STYLE}>
              {/* 검사 시작 시간 */}
              {intl.formatMessage({ id: 'system.chksumStat-typo-checkStartTime' })}
            </Typography>
            <Typography sx={LIST_TEXT_STYLE}>
              {networkFail || !statInfo
                ? '-'
                : HsLib.changeDateFormat(statInfo?.chksumSdate, '$1-$2-$3 $4:$5:$6')}
            </Typography>
          </Stack>
          {/* 검사 종료 시간 */}
          <Stack direction="row" sx={LIST_STACK_STYLE}>
            <Typography sx={LIST_TEXT_STYLE}>
              {/* 검사 종료 시간 */}
              {intl.formatMessage({ id: 'system.chksumStat-typo-checkEndTime' })}
            </Typography>
            <Typography sx={LIST_TEXT_STYLE}>
              {networkFail || !statInfo
                ? '-'
                : HsLib.changeDateFormat(statInfo?.chksumEdate, '$1-$2-$3 $4:$5:$6')}
            </Typography>
          </Stack>
          {/* 총건수 */}
          <Stack direction="row" sx={LIST_STACK_STYLE}>
            <Typography sx={LIST_TEXT_STYLE}>
              {/* 총건수 */}
              {intl.formatMessage({ id: 'system.chksumStat-typo-total' })}
            </Typography>
            {networkFail || statInfo === null ? (
              <Typography sx={LIST_TEXT_STYLE}>-</Typography>
            ) : statInfo?.workType === '2' ? (
              <LoadingCircle />
            ) : (
              <Chip
                sx={{
                  ...LIST_CHIP_STYLE,
                  background: '#39a7ebe8',
                }}
                size="small"
                label={networkFail || !statInfo ? '-' : HsLib.addNumberComma(statInfo?.chksumTotal)}
              />
            )}
          </Stack>
          {/* 정상건수 */}
          <Stack direction="row" sx={LIST_STACK_STYLE}>
            <Typography sx={LIST_TEXT_STYLE}>
              {/* 정상건수 */}
              {intl.formatMessage({ id: 'system.chksumStat-typo-success' })}
            </Typography>
            {networkFail || statInfo === null ? (
              <Typography sx={LIST_TEXT_STYLE}>-</Typography>
            ) : statInfo?.workType === '2' ? (
              <LoadingCircle />
            ) : (
              <Chip
                sx={{
                  ...LIST_CHIP_STYLE,
                  background: '#08a008e8',
                }}
                size="small"
                label={networkFail || !statInfo ? '-' : HsLib.addNumberComma(statInfo?.chksumSucc)}
              />
            )}
          </Stack>
          {/* 오류건수 */}
          <ListItemButton
            sx={{
              ...LIST_STACK_STYLE,
              borderBottom: '0',
              ...(networkFail || !statInfo || statInfo?.chksumFail === 0
                ? { ':hover': { backgroundColor: '#fff' } }
                : {}),
              ...(networkFail || !statInfo || statInfo?.chksumFail === 0
                ? { cursor: 'default' }
                : {}),
            }}
            onClick={
              networkFail || !statInfo || statInfo?.chksumFail === 0
                ? null
                : () => doDetail(statInfo?.chksumReq, statInfo?.systemId, statInfo?.groupId)
            }
          >
            <Typography sx={LIST_TEXT_STYLE}>
              {/* 오류건수 */}
              {intl.formatMessage({ id: 'system.chksumStat-typo-failure' })}
            </Typography>
            {networkFail || statInfo === null ? (
              <Typography sx={LIST_TEXT_STYLE}>-</Typography>
            ) : statInfo?.workType === '2' ? (
              <LoadingCircle />
            ) : (
              <Chip
                sx={{
                  ...LIST_CHIP_STYLE,
                  background: '#ff3838',
                  cursor: statInfo?.chksumFail > 0 ? 'pointer' : 'default',
                }}
                size="small"
                label={networkFail || !statInfo ? '-' : HsLib.addNumberComma(statInfo?.chksumFail)}
              />
            )}
          </ListItemButton>
        </ListItem>
      </GridItem>
    </GridItem>
  );
}

export default ChksumStat;
