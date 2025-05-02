import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Tooltip, Typography, Stack } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/styles';
import LabelInput from '@components/modules/input/LabelInput';
import Label from '@components/modules/label/Label';
import { GppBad, GppGood, Info, PlayCircle } from '@mui/icons-material';
import ButtonSet from '@components/modules/button/ButtonSet';
import useConfirmModal from '@modules/hooks/useConfirmModal';
import adminApi from '@api/system/adminApi';
import deptListApi from '@api/system/deptListApi';
import { RightCircleFilled } from '@ant-design/icons';

const cardTitleStyled = {
  height: '50px',
};

const initInfos = {
  id: '',
  deptName: '',
  parentDeptSeq: '',
  updateTime: '',
  writer: '',
  policyCd: '',
  limitApproverCount: '',
  deptPath: '',
  deptPathName: '',
  status: '',
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

function DeptInfoTab({ value, index }) {
  const theme = useTheme();

  const { instance } = AuthInstance();
  deptListApi.axios = instance;

  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();

  const openConfirmModal = useConfirmModal();

  const [policyData, setPolicyData] = useState([]);

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
    const result = await apiCall(deptListApi.getDeptListDetail, opener.deptSeq);

    if (result.status === 200) {
      policyList();

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

  // 정책명 콤보 데이터
  const policyList = async () => {
    const result = await apiCall(deptListApi.getPolicyList);

    let policyData = [];

    if (result.status === 200) {
      result.data.content.map((data) => {
        policyData = [...policyData, { value: data.id, label: data.policyName }];
      });
      setPolicyData(policyData);
    }
  };

  const handleSaveDialogOpen = () => {
    openConfirmModal({
      message: '부서 정보를 수정하시겠습니까?',
      target: 'deptInfo',
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
    <div hidden={index != value}>
      <FormProvider {...methods}>
        <form id="deptInfo" onSubmit={methods.handleSubmit(doSave)}>
          <GridItem container direction="column" sx={{ px: 2, pt: 3, minWidth: 1250 }} spacing={2}>
            <GridItem item>
              <MainCard
                overflowVisible
                title={
                  <GridItem
                    container
                    directionHorizon="space-between"
                    sx={{ alignItems: 'baseline' }}
                    // sx={{
                    //   '& .labelText': { maxWidth: '170px', minWidth: '170px' },
                    // }}
                  >
                    <Typography variant="h5">
                      <PlayCircle
                        sx={{
                          fontSize: '1.2em',
                          color: theme.palette.primary.main,
                          verticalAlign: 'middle',
                        }}
                      />{' '}
                      부서정보 수정
                    </Typography>

                    <ButtonSet
                      type="custom"
                      options={[
                        {
                          label: '추가',
                          // callBack: handleAddColumnButtonClick,
                          variant: 'outlined',
                          color: 'secondary',
                          // 임시
                          // role: 'insert',
                        },
                        {
                          label: '삭제',
                          // callBack: handleDeleteButtonClick,
                          variant: 'outlined',
                          color: 'secondary',
                          // 임시
                          // role: 'delete',
                        },
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
              />
              <GridItem
                container
                direction="row"
                divideColumn={1}
                borderFlag
                sx={{
                  '& .labelText': { maxWidth: '125px', minWidth: '125px', fontSize: '12px' },
                  '& .inputText': { maxWidth: '150px', minWidth: '150px', fontSize: '12px' },
                  '& .inputText.text': { maxWidth: '125px', minWidth: '125px', fontSize: '12px' },
                }}
              >
                <Label labelBackgroundFlag label="부서정보">
                  <GridItem container item divideColumn={3} spacing={1}>
                    <LabelInput required label="부서명" name="deptName" fullWidth />
                    <LabelInput required label="상위부서" name="spDeptNm" fullWidth />
                    <LabelInput required label="원본 부서코드" name="oriPkey" fullWidth />
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="사용정책">
                  <GridItem container item divideColumn={3} spacing={1}>
                    <LabelInput
                      required
                      type="select"
                      label="정책명"
                      name="userPermissionId"
                      list={policyData}
                      fullWidth
                    />
                    <LabelInput
                      label="URL자동전환<br/>사용여부"
                      name="urlTypeName"
                      InputProps={{ readOnly: true, value: 'test' }}
                      colSpan={2}
                    />
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="기간구분">
                  <GridItem container item divideColumn={3} spacing={1}>
                    <LabelInput
                      label="기간구분"
                      name="periodFlagName"
                      fullWidth
                      InputProps={{ readOnly: true, value: '요일별' }}
                    />
                    <LabelInput
                      label="요일선택"
                      name="periodWeekName"
                      InputProps={{ readOnly: true, value: '일,월,화,수,목,금,토' }}
                      fullWidth
                    />
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="전송 제한시간(내부)">
                  <GridItem container item divideColumn={1} spacing={1}>
                    <LabelInput
                      label=""
                      name="fileUploadTime"
                      InputProps={{ readOnly: true, value: '사용안함' }}
                    />
                  </GridItem>
                </Label>
                <Label labelBackgroundFlag label="전송 제한시간(외부)">
                  <GridItem container item divideColumn={1} spacing={1}>
                    <LabelInput
                      label=""
                      name="fileUploadTimeE"
                      InputProps={{ readOnly: true, value: '사용안함' }}
                    />
                  </GridItem>
                </Label>

                <Label
                  labelBackgroundFlag
                  label="기능제한"
                  // labelSx={{ maxWidth: '170px' }}
                >
                  <GridItem container item divideColumn={6} spacing={0}>
                    <LabelInput
                      label=""
                      name="fileUploadTime"
                      InputProps={{ readOnly: true, value: '사용안함' }}
                    />
                    <GridItem
                      container
                      item
                      divideColumn={2}
                      spacing={0}
                      colSpan={5}
                      sx={{
                        borderLeft: 1,
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[300],
                      }}
                    >
                      <Label label="[내부]" labelSx={{ color: '#3f6ae4', fontWeight: 'bold' }} />
                      <Label label="[외부]" labelSx={{ color: '#3f6ae4', fontWeight: 'bold' }} />
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="파일갯수 제한"
                          name="파일갯수제한"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                          // labelSx={{ minWidth: '170px !important' }}
                        />
                        <Label
                          label="(Max.2000)"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="파일갯수 제한"
                          name="파일갯수제한_외부"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                        />
                        <Label
                          label="(Max.2000)"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="사이즈 제한"
                          name="사이즈"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                        />
                        <Label
                          label="MB (Max.30000)"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="사이즈 제한"
                          name="사이즈제한_외부"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                        />
                        <Label
                          label="MB (Max.30000)"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <LabelInput
                        label="일일전송 횟수 제한"
                        name="일일전송_횟수_제한"
                        fullWidth
                        InputProps={{ readOnly: true, value: '' }}
                      />
                      <LabelInput
                        label="일일전송 횟수 제한"
                        name="일일전송_횟수_제한_외부"
                        fullWidth
                        InputProps={{ readOnly: true, value: '' }}
                      />
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="일일전송 사이즈 제한"
                          name="일일전송_사이즈_제한"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                        />
                        <Label
                          label="MB"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="일일전송 사이즈 제한"
                          name="일일전송_사이즈_제한_외부"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                        />
                        <Label
                          label="MB"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <LabelInput
                        label="다운로드 횟수 제한"
                        name="다운로드_횟수_제한"
                        fullWidth
                        InputProps={{ readOnly: true, value: '' }}
                      />
                      <LabelInput
                        label="다운로드 횟수 제한"
                        name="다운로드_횟수_제한_외부"
                        fullWidth
                        InputProps={{ readOnly: true, value: '' }}
                      />
                    </GridItem>
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="클립보드 기능 제한">
                  <GridItem container item divideColumn={6} spacing={0}>
                    <LabelInput
                      label=""
                      name="clipPolicyFName"
                      InputProps={{ readOnly: true, value: '사용안함' }}
                    />
                    <GridItem
                      container
                      item
                      divideColumn={1}
                      spacing={0}
                      colSpan={5}
                      sx={{
                        borderLeft: 1,
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[300],
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="클립보드 사이즈 제한"
                          name="클립보드_사이즈_제한"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                          // labelSx={{ minWidth: '170px !important' }}
                        />
                        <Label
                          label="MB (Max.5000)"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="클립보드 1일 횟수 제한"
                          name="클립보드_1일_횟수_제한"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                        />
                        <Label
                          label="(Max.2000)"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LabelInput
                          label="클립보드 1일 사이즈 제한"
                          name="클립보드_1일_사이즈_제한"
                          fullWidth
                          InputProps={{ readOnly: true, value: '' }}
                        />
                        <Label
                          label="MB (Max.5000)"
                          labelSx={{
                            textAlign: 'left !important',
                          }}
                        />
                      </Stack>
                    </GridItem>
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="결재기능 사용 여부">
                  <GridItem container item divideColumn={3} spacing={0}>
                    <LabelInput
                      label="결재기능(내부)"
                      name="approveUseTypeIn"
                      InputProps={{ readOnly: true, value: '사용안함' }}
                    />
                    <LabelInput
                      label="결재기능(외부)"
                      name="approveUseTypeEx"
                      InputProps={{ readOnly: true, value: '사용금지' }}
                    />
                  </GridItem>
                </Label>

                <LabelInput
                  label="사후결재(내부)"
                  name="divAfterApproveIn"
                  maxLength={100}
                  InputProps={{
                    readOnly: true,
                    value: '상위정책 사용 | 일,월,화,수,목,금,토 | 0시 ~ 0시',
                  }}
                  sx={{
                    '.inputBox': { maxWidth: '1100px', minWidth: '1100px' },
                  }}
                  labelBackgroundFlag
                />

                <LabelInput
                  label="사후결재(외부)"
                  name="divAfterApproveEx"
                  maxLength={100}
                  InputProps={{
                    readOnly: true,
                    value: '상위정책 사용 | 일,월,화,수,목,금,토 | 0시 ~ 0시',
                  }}
                  labelBackgroundFlag
                  sx={{
                    '.inputBox': { maxWidth: '1100px', minWidth: '1100px' },
                  }}
                />

                <Label labelBackgroundFlag label="저장 여부">
                  <GridItem container item divideColumn={3} spacing={1}>
                    <LabelInput
                      label="클립보드 이력저장"
                      name="clipHistoryFName"
                      InputProps={{ readOnly: true, value: '저장' }}
                    />
                    <LabelInput
                      label="원본저장 여부"
                      name="backupTypeName"
                      InputProps={{ readOnly: true, value: '저장안함' }}
                      colSpan={2}
                    />
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="파일확장자 제한">
                  <GridItem container item divideColumn={6} spacing={0}>
                    <LabelInput
                      type="select"
                      label=""
                      name="up_policy"
                      list={[
                        { value: 'Y', label: '상위정책' },
                        { value: 'N', label: '개별정책' },
                      ]}
                      sx={{ minWidth: '150px', maxWidth: '150px' }}
                    />
                    <GridItem
                      container
                      item
                      divideColumn={1}
                      spacing={1}
                      colSpan={5}
                      sx={{
                        borderLeft: 1,
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[300],
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{ marginTop: '5px' }}
                      >
                        <LabelInput
                          label="반출 파일 확장자 제한"
                          name="반출_파일_확장자_제한"
                          fullWidth
                          InputProps={{ readOnly: true, value: 'exe;com;dll' }}
                          labelSx={{ minWidth: '170px !important' }}
                          sx={{ '.inputBox': { maxWidth: '550px', minWidth: '550px' } }}
                        />
                        <LabelInput
                          type="select"
                          label=""
                          name="fileFilterType1In"
                          list={[
                            { value: '1', label: 'WhiteList' },
                            { value: '2', label: 'BlackList' },
                          ]}
                          sx={{ minWidth: '150px', maxWidth: '150px' }}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{ marginBottom: '5px' }}
                      >
                        <LabelInput
                          label="반입 파일 확장자 제한"
                          name="반입_파일_확장자_제한"
                          fullWidth
                          InputProps={{ readOnly: true, value: 'exe;com;dll' }}
                          labelSx={{ minWidth: '170px !important' }}
                          sx={{ '.inputBox': { maxWidth: '550px', minWidth: '550px' } }}
                        />
                        <LabelInput
                          type="select"
                          label=""
                          name="fileFilterType1Ex"
                          list={[
                            { value: '1', label: 'WhiteList' },
                            { value: '2', label: 'BlackList' },
                          ]}
                          sx={{ minWidth: '150px', maxWidth: '150px' }}
                        />
                      </Stack>
                    </GridItem>
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="URL 자동전환 정책 개인화">
                  <GridItem container item divideColumn={1} spacing={0.5}>
                    <LabelInput
                      label="사용"
                      name="privateUrlUse"
                      InputProps={{ readOnly: true, value: '사용안함' }}
                      labelSx={{
                        textAlign: 'left !important',
                      }}
                      sx={{
                        '.inputBox': { maxWidth: '550px', minWidth: '550px' },
                        marginTop: '5px',
                      }}
                    />
                    <LabelInput
                      label="미사용"
                      name="privateUrlUnused"
                      InputProps={{ readOnly: true, value: '사용금지' }}
                      labelSx={{
                        textAlign: 'left !important',
                      }}
                      sx={{
                        '.inputBox': { maxWidth: '550px', minWidth: '550px' },
                      }}
                    />
                    <LabelInput
                      label="예외"
                      name="privateUrlExcept"
                      InputProps={{ readOnly: true, value: '사용금지' }}
                      labelSx={{
                        textAlign: 'left !important',
                      }}
                      sx={{
                        '.inputBox': { maxWidth: '550px', minWidth: '550px' },
                        marginBottom: '5px',
                      }}
                    />
                  </GridItem>
                </Label>
              </GridItem>
            </GridItem>
          </GridItem>
          <Label />
        </form>
      </FormProvider>
    </div>
  );
}

export default DeptInfoTab;
