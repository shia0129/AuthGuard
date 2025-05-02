import Layout from '@components/layouts';
import { useState, useEffect,useRef } from 'react';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import moment from 'moment';

// Project import
import HsLib from '@modules/common/HsLib';
import noticeApi from '@api/system/noticeApi';
import { AuthInstance } from '@modules/axios';
import MainCard from '@components/mantis/MainCard';
import LabelInput from '@components/modules/input/LabelInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import ConfirmPop from '@components/modules/popover/ConfirmPop';
import useApi from '@modules/hooks/useApi';

// MUI
import { Stack } from '@mui/material';
function NoticeForm() {
  const { instance, source } = AuthInstance();
  noticeApi.axios = instance;

  const { data: session } = useSession();
  const name = session.user.name;

  let today = HsLib.getTodayDate();
  let weekAgo = HsLib.getAfterDate('7D', today);

  const methods = useForm({
    defaultValues: {
      boardStartDate: today,
      boardEndDate: weekAgo,
      userName: name,
      boardUseYn: '0',
      boardDisplayLocation: '0',
      scopeType: '0',
      boardTitle: '',
      boardContents: '',
    },
  });

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  const router = useRouter();

  const { flag, id } = router.query;

  const [popTarget, setPopTarget] = useState(null);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (flag === 'update') {
      getNoticeDetails();
    }
  }, []);

  const getNoticeDetails = async () => {
    const result = await apiCall(noticeApi.getNoticeDetails, id);

    if (!result.data.data.errorYn) {
      for (const key in result.data.data) {
        if (key === 'boardStartDate') {
          methods.setValue(
            'boardStartDate',
            HsLib.changeDateFormat(result.data.data[`${key}`], '$1-$2-$3'),
          );
        } else if (key === 'boardEndDate') {
          methods.setValue(
            'boardEndDate',
            HsLib.changeDateFormat(result.data.data[`${key}`], '$1-$2-$3'),
          );
        } else {
          methods.setValue(key, result.data.data[`${key}`]);
        }
      }
    }
  };

  const insertNotice = async (data) => {
    if (moment.isMoment(data.boardStartDate)) {
      data.boardStartDate = data.boardStartDate.format('YYYYMMDD');
    } else {
      data.boardStartDate = HsLib.removeDateFormat(data.boardStartDate);
    }

    if (moment.isMoment(data.boardEndDate)) {
      data.boardEndDate = data.boardEndDate.format('YYYYMMDD');
    } else {
      data.boardEndDate = HsLib.removeDateFormat(data.boardEndDate);
    }

    data.deptSeqList = ['2024032200250000090'];

    if (data.boardStartDate > data.boardEndDate) {
      return '기간을 확인해주세요.';
    }

    const result = await apiCall(noticeApi.insertNotice, data);

    let message = '';

    if (!result.data.errorYn) {
      message = '공지사항이 등록 되었습니다.';
    } else {
      message = '공지사항 등록이 실패되었습니다.';
    }

    openModal({
      message,
      onConfirm: () => router.push('/system/notice/noticeList'),
    });
  };

  const updateNotice = async (data) => {
    if (moment.isMoment(data.boardStartDate)) {
      data.boardStartDate = data.boardStartDate.format('YYYYMMDD');
    } else {
      data.boardStartDate = HsLib.removeDateFormat(data.boardStartDate);
    }

    if (moment.isMoment(data.boardEndDate)) {
      data.boardEndDate = data.boardEndDate.format('YYYYMMDD');
    } else {
      data.boardEndDate = HsLib.removeDateFormat(data.boardEndDate);
    }

    data.deptSeqList = ['2024032200250000090'];

    const result = await apiCall(noticeApi.updateNotice, data);

    let message = '';

    if (!result.data.errorYn) {
      message = '공지사항이 수정되었습니다.';
    } else {
      message = '공지사항 수정요청이 실패되었습니다.';
    }

    openModal({
      message,
      onConfirm: () => router.push('/system/notice/noticeList'),
    });
  };

  const deleteNotice = async () => {
    openModal({
      message: '해당 공지사항을 삭제하시겠습니까?',
      onConfirm: async () => {
        const result = await apiCall(noticeApi.deleteNotice, [id]);

        if (!result.data.errorYn) {
          openModal({
            message: '공지사항이 삭제되었습니다.',
            onConfirm: () => {
              router.push('/system/notice/noticeList');
            },
          });
        } else {
          openModal({
            message: '공지사항 삭제가 실패되었습니다.',
          });
        }
      },
    });
  };

  return (
    <MainCard
      title={`공지사항 ${flag === 'insert' ? '작성' : '수정'}`}
      border={false}
      className="tableCard"
    >
      <FormProvider {...methods} flag={flag}>
        <form
          id="noticeForm"
          onSubmit={methods.handleSubmit(flag === 'insert' ? insertNotice : updateNotice)}
        >
          <GridItem
            container
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
              '.inputBox': { maxWidth: '310px', minWidth: '310px' },
            }}
          >
            <Stack direction="row" alignItems="center">
              <LabelInput
                required
                labelBackgroundFlag
                type="date1"
                label="게시일"
                name="boardStartDate"
                sx={{ maxWidth: '150px', minWidth: '150px' }}
                // rules={{
                //   validate: (value) =>
                //     HsLib.isValidDatePeriod(value, methods.getValue('boardEndDate')),
                // }}
              />
              &nbsp;~&nbsp;
              <LabelInput
                type="date1"
                name="boardEndDate"
                sx={{ maxWidth: '150px', minWidth: '150px' }}
                // rules={{
                //   validate: (value) =>
                //     HsLib.isValidDatePeriod(methods.getValue('boardStartDate'), value),
                // }}
              />
            </Stack>
            <LabelInput
              required
              label="등록자명"
              name="userName"
              labelBackgroundFlag
              disabled
              value={name}
            />
            <LabelInput
              required
              type="select"
              label="사용구분"
              name="boardUseYn"
              list={[
                { value: '0', label: '미사용' },
                { value: '1', label: '사용' },
              ]}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="게시위치"
              name="boardDisplayLocation"
              list={[
                { value: '0', label: '전체' },
                { value: '1', label: 'weblink' },
                { value: '2', label: 'netlink' },
              ]}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="적용부서"
              name="scopeType"
              list={[
                { value: '0', label: '전체적용' },
                { value: '1', label: '하위부서적용' },
                { value: '2', label: '현재부서만 적용' },
              ]}
              labelBackgroundFlag
            />
            <LabelInput
              required
              maxLength={100}
              label="제목"
              name="boardTitle"
              labelBackgroundFlag
              sx={{
                minWidth: 'calc(100% - 100px) !important',
                maxWidth: 'calc(100% - 100px) !important',
              }}
            />
            <LabelInput
              required
              type="textArea"
              multiline
              rows={20}
              label="내용"
              name="boardContents"
              labelBackgroundFlag
              sx={{
                minWidth: 'calc(100% - 100px) !important',
                maxWidth: 'calc(100% - 100px) !important',
              }}
            />
          </GridItem>
          <GridItem item directionHorizon="end" sx={{ mt: 1 }}>
            {flag === 'insert' ? (
              <ButtonSet
                options={[
                  {
                    label: '저장',
                    callBack: (event) => setPopTarget(event.currentTarget),
                    role: flag,
                    color: 'primary',
                  },
                  {
                    label: '목록',
                    callBack: () => router.push('/system/notice/noticeList'),
                  },
                ]}
              />
            ) : (
              <ButtonSet
                options={[
                  {
                    label: '수정',
                    callBack: (event) => setPopTarget(event.currentTarget),
                    role: flag,
                    color: 'primary',
                  },
                  {
                    label: '삭제',
                    callBack: deleteNotice,
                    color: 'secondary',
                    variant: 'outlined',
                    role: 'delete',
                  },
                  {
                    label: '목록',
                    callBack: () => router.push('/system/notice/noticeList'),
                  },
                ]}
              />
            )}
          </GridItem>
          <ConfirmPop name="noticeForm" anchorEl={popTarget} anchorChange={setPopTarget} />
        </form>
      </FormProvider>
    </MainCard>
  );
}

NoticeForm.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default NoticeForm;
