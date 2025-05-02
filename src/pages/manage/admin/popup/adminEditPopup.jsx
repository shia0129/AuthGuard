import Layout from '@components/layouts';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import { useEffect, useState ,useRef} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Stack, Typography, Tooltip } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/styles';
import LabelInput from '@components/modules/input/LabelInput';
import Label from '@components/modules/label/Label';
import { PlayCircle, GppGood, GppBad, Info } from '@mui/icons-material';
import ButtonSet from '@components/modules/button/ButtonSet';
import useConfirmModal from '@modules/hooks/useConfirmModal';
import adminApi from '@api/system/adminApi';
import { useSession } from 'next-auth/react';

const cardTitleStyled = {
  height: '50px',
};

const initInfos = {
  userId: '',
  userName: '',
  startUseDate: '',
  endUseDate: '',
  userPermissionId: '',
  deleteYn: '',
};

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }}>
    <div>{props.children}</div>
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

function AdminEditPopup() {
  const theme = useTheme();
  const { data: session } = useSession();
  const { instance } = AuthInstance();
  adminApi.axios = instance;

  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();

  const openConfirmModal = useConfirmModal();

  const [adminInfos, setAdminInfos] = useState(null);
  const [adminPermissionData, setAdminPermissionData] = useState([]);

  const [userInfoRules, setUserInfoRules] = useState({
    pwdMinLen: '0',
    pwdMaxLen: '0',
    ccCntLimit: '0',
    scCntLimit: '0',
    esMinLen: '0',
    ebMinLen: '0',
    numMinLen: '0',
    scMinLen: '0',
    idPwdInName: 'Y',
    idPwdInId: 'Y',
    idNminLen: '0',
    idEminLen: '0',
    idMinLen: '0',
    idPwdTemp: '1',
  });

  const [enabledFlag, setEnabledFlag] = useState({
    userPassword: true,
    confirmPassword: true,
    startUseDate: true,
    endUseDate: true,
  });

  const [passwordCheck, setPasswordCheck] = useState(null);
  const [validPassword, setValidPassword] = useState(false);

  const methods = useForm({
    defaultValues: initInfos,
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 팝업 사이즈 조절
    HsLib.windowResize(1290, 565);

    init();
  }, []);

  const init = async () => {
    
    const hsssessionid = session?.user.hsssessionid;
    const result = await apiCall(adminApi.getAdminListDetail,{id:opener.userSeq,hsssessionid:hsssessionid });

    if (result.status === 200) {
      adminPermissionList();
      setAdminInfos(result.data);

      Object.keys(initInfos).forEach((key) => {
        if (Array.isArray(result.data[`${key}`])) {
          methods.setValue(key, result.data[`${key}`]);
        } else {
          if (key === 'startUseDate') {
            methods.setValue(
              'startUseDate',
              HsLib.changeDateFormat(result.data[`${key}`], '$1-$2-$3'),
            );
          } else if (key === 'endUseDate') {
            methods.setValue(
              'endUseDate',
              HsLib.changeDateFormat(result.data[`${key}`], '$1-$2-$3'),
            );
          } else {
            methods.setValue(key, `${result.data[`${key}`]}`);
          }
        }
      });
    }
  };

  // 관리자 권한 콤보 데이터
  const adminPermissionList = async () => {
    const result = await apiCall(adminApi.getAdminPermissionList);

    let permissionData = [];

    if (result.status === 200) {
      result.data.map((data) => {
        permissionData = [...permissionData, { label: data.userPermissionName, value: data.id }];
      });
      setAdminPermissionData(permissionData);
    }
  };

  const handleSaveDialogOpen = () => {
    openConfirmModal({
      message: '관리자 정보를 수정하시겠습니까?',
      target: 'adminInfo',
      methods,
    });
  };

  const doSave = async (data) => {
    if (moment.isMoment(data.startUseDate)) {
      // 날짜 수정했을경우
      data.startUseDate = data.startUseDate.format('YYYYMMDD000000');
    } else {
      data.startUseDate = HsLib.removeDateFormat(data.startUseDate) + '000000';
    }

    if (moment.isMoment(data.endUseDate)) {
      // 날짜 수정했을경우
      data.endUseDate = data.endUseDate.format('YYYYMMDD000000');
    } else {
      data.endUseDate = HsLib.removeDateFormat(data.endUseDate) + '000000';
    }

    data.id = opener.userSeq;

    const result = await apiCall(adminApi.updateAdminList, data);
    let message;
    if (result.status === 200) {
      if (result.data > 0) {
        message = '수정되었습니다.';
      } else {
        message = '수정에 실패하였습니다.';
      }
      openModal({
        message,
        onConfirm: () => {
          opener.getAdminList();
          window.close();
        },
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="adminInfo" onSubmit={methods.handleSubmit(doSave)}>
        <GridItem container direction="column" sx={{ px: 2, pt: 3 }} spacing={2}>
          <GridItem item>
            <MainCard
              overflowVisible
              title={
                <GridItem
                  container
                  directionHorizon="space-between"
                  sx={{ alignItems: 'baseline' }}
                >
                  <Typography variant="h5">
                    <PlayCircle
                      sx={{
                        fontSize: '1.2em',
                        color: theme.palette.primary.main,
                        verticalAlign: 'middle',
                      }}
                    />{' '}
                    관리자 기본 정보
                  </Typography>

                  <ButtonSet
                    type="custom"
                    options={[
                      {
                        label: '저장',
                        color: 'primary',
                        callBack: handleSaveDialogOpen,
                      },
                      {
                        label: '닫기',
                        color: 'secondary',
                        callBack: () => {
                          if (window.history.length < 2) {
                            window.close();
                          } else {
                            window.history.back();
                          }
                        },
                      },
                    ]}
                  />
                </GridItem>
              }
              headerSX={cardTitleStyled}
            >
              <GridItem
                container
                item
                divideColumn={3}
                xs={48}
                sm={24}
                md={16}
                borderFlag
                sx={{
                  '& .text': { maxWidth: '155px', minWidth: '155px' },
                  '.inputBox': { width: '100%' },
                  '.MuiInputBase-input[name="email"]': {
                    maxWidth: '425px',
                    minWidth: '425px',
                  },
                  'div[role="radiogroup"] span.MuiRadio-root': {
                    alignSelf: 'center',
                    p: 0,
                    mx: '6px',
                  },
                  'div[role="radiogroup"] span.MuiFormControlLabel-label': {
                    alignSelf: 'baseline',
                  },
                }}
              >
                <Label
                  label="관리자ID"
                  labelBackgroundFlag
                  data={adminInfos?.userId}
                  dataTooltipFlag={false}
                />
                <LabelInput
                  required
                  label="관리자명"
                  name="userName"
                  fullWidth
                  labelBackgroundFlag
                />
                <LabelInput
                  required
                  type="select"
                  label="관리자 권한"
                  name="userPermissionId"
                  list={adminPermissionData}
                  fullWidth
                  labelBackgroundFlag
                />
              </GridItem>

              <GridItem
                container
                item
                borderFlag
                divideColumn={3}
                xs={48}
                sm={24}
                md={16}
                sx={{
                  '& .text': { maxWidth: '155px', minWidth: '155px' },
                  '.inputBox': { width: '100%' },
                }}
              >
                <LabelInput
                  labelBackgroundFlag
                  type="date1"
                  label="유효기간 시작일"
                  name="startUseDate"
                  rules={{
                    validate: (value) =>
                      HsLib.isValidDatePeriod(value, methods.getValue('endUseDate')),
                  }}
                />
                <LabelInput
                  labelBackgroundFlag
                  type="date1"
                  label="유효기간 종료일"
                  name="endUseDate"
                  rules={{
                    validate: (value) =>
                      HsLib.isValidDatePeriod(methods.getValue('startUseDate'), value),
                  }}
                />
                <LabelInput
                  required
                  type="select"
                  label="삭제여부"
                  name="deleteYn"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                  fullWidth
                  labelBackgroundFlag
                />
              </GridItem>

              <GridItem
                divideColumn={3}
                item
                xs={48}
                sm={24}
                md={16}
                direction="row"
                borderFlag
                sx={{
                  '& .text': { maxWidth: '155px', minWidth: '155px' },
                  '.inputBox': { width: '100%' },
                }}
              >
                <Label label="패스워드" labelBackgroundFlag required>
                  <BootstrapTooltip
                    title={
                      <>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 최소 {userInfoRules.pwdMinLen}자리 이상,
                          최대 {userInfoRules.pwdMaxLen}자리 이하
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 영소문자 최소 {userInfoRules.esMinLen}
                          자리 이상
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 영대문자 최소 {userInfoRules.ebMinLen}
                          자리 이상
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 숫자 최소 {userInfoRules.numMinLen}
                          자리 이상, 특수문자 최소 {userInfoRules.scMinLen}자리 이상
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> {userInfoRules.ccCntLimit}자리 이하
                          연속문자, {userInfoRules.scCntLimit}자리 이하 동일문자
                        </Typography>
                        {userInfoRules.idPwdInId === 'Y' || userInfoRules.idPwdInName === 'Y' ? (
                          <Typography variant="caption" display="block">
                            <Info sx={{ fontSize: '1em' }} />{' '}
                            {userInfoRules.idPwdInId === 'Y' ? '사용자 ID 포함 불가' : ''}
                            {userInfoRules.idPwdInId === 'Y' && userInfoRules.idPwdInName === 'Y'
                              ? ', '
                              : ''}
                            {userInfoRules.idPwdInName === 'Y' ? '사용자명 포함 불가' : ''}
                          </Typography>
                        ) : (
                          <></>
                        )}
                      </>
                    }
                    placement="bottom"
                    disableFocusListener={!enabledFlag.userPassword}
                    disableHoverListener={!enabledFlag.userPassword}
                  >
                    <LabelInput
                      sx={
                        enabledFlag.userPassword
                          ? null
                          : {
                              '& .MuiInputBase-input': {
                                backgroundColor: theme.palette.grey[100],
                              },
                              '& .MuiInputBase-input::placeholder': {
                                textFillColor: `${theme.palette.grey[900]} !important`,
                                fontWeight: 'bold',
                              },
                            }
                      }
                      required={enabledFlag.userPassword}
                      errorMesg="패스워드을(를) 입력해주세요."
                      disabled={!enabledFlag.userPassword}
                      name="userPassword"
                      htmlType="password"
                      fullWidth
                      labelBackgroundFlag
                    />
                  </BootstrapTooltip>
                  <Stack direction="row">
                    <Typography
                      variant="body1"
                      sx={{
                        color: passwordCheck ? (validPassword ? 'green' : 'red') : 'red',
                        fontWeight: 'bold',
                        fontSize: '0.7em',
                        minWidth: '115px',
                        alignSelf: 'center',
                      }}
                    >
                      {passwordCheck === null ? (
                        ''
                      ) : passwordCheck ? (
                        validPassword ? (
                          <>
                            <GppGood sx={{ fontSize: '1em' }} /> Success
                          </>
                        ) : (
                          <>
                            <GppBad sx={{ fontSize: '1em' }} /> 패스워드 규칙 불일치
                          </>
                        )
                      ) : (
                        <>
                          <GppBad sx={{ fontSize: '1em' }} /> 패스워드 불일치
                        </>
                      )}
                    </Typography>
                  </Stack>
                </Label>
                <Label label="패스워드 확인" required labelBackgroundFlag>
                  <LabelInput
                    style={
                      enabledFlag.userPassword
                        ? { marginLeft: '6px' }
                        : { marginLeft: '6px', backgroundColor: theme.palette.grey[100] }
                    }
                    required={enabledFlag.userPassword}
                    disabled={!enabledFlag.userPassword}
                    name="confirmPassword"
                    htmlType="password"
                  />
                </Label>
              </GridItem>
            </MainCard>
          </GridItem>
        </GridItem>
      </form>
    </FormProvider>
  );
}

AdminEditPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="popup" title="관리자 수정">
      {page}
    </Layout>
  );
};

export default AdminEditPopup;
