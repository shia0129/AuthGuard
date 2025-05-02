import { useEffect, useState, useRef, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import patternStatusApi from '@api/hss/sslswg/policy/policyDetailManage/patternStatusApi';
import Loader from '@components/mantis/Loader';
import { Typography, Box } from '@mui/material';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function PatternStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getPatternStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  patternStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      action: '0',
      type: 'regexpheader',
      value: '',
    },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    if (flag === 'update') {
      setIsDisabled(true);
    }

    return () => {
      source.cancel();
    };
  }, []);

  const fetcher = useCallback(() => {
    return apiCall(patternStatusApi.getPatternStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;
        if (value === null) {
          methods.setValue(key, '');
        } else {
          if (key === 'action') {
            methods.setValue(key, String(value));
          } else {
            methods.setValue(key, value);
          }
        }
      }
    },
    [methods],
  );

  const isInitLoading = useInitialFormDataLoad({
    enabled: flag === 'update',
    fetcher,
    onLoaded,
  });

  const saveButtonClick = async (data) => {
    if (isInitLoading) {
      return;
    }

    let result = '';

    setIsSaving(true);

    const { name, action, type, value } = data;

    const newData = {
      name: name,
      action: action,
      type: type,
      value: value,
    };

    if (flag === 'update') {
      // result = await apiCall(patternStatusApi.updatePatternStatusData, newData);
    } else {
      result = await apiCall(patternStatusApi.insertPatternStatusData, newData);
    }

    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getPatternStatusList();
        },
      });
    }
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`패턴 정책 ${flag === 'insert' ? '작성' : '확인'}`}
      confirmLabel="저장"
      {...(flag === 'update' && { cancelLabel: '확인' })}
      disableConfirm={isDisabled}
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="patternStatusModal">
            <GridItem
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': { width: '310px' },
              }}
            >
              <LabelInput
                required
                label="정책명"
                name="name"
                maxLength={255}
                colSpan={2}
                disabled={isDisabled}
                sx={{
                  '.inputBox': { width: '800px' },
                }}
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="유형"
                name="type"
                list={[
                  { label: 'HEADER', value: 'regexpheader', disabled: isDisabled },
                  { label: 'PAYLOAD', value: 'regexppayload', disabled: isDisabled },
                  { label: 'URL', value: 'regexpurl', disabled: isDisabled },
                ]}
              />
              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="처리 방식"
                name="action"
                list={[
                  { label: '차단', value: '0', disabled: isDisabled },
                  // { label: '허용', value: '1', disabled: isDisabled },
                ]}
              />
              <LabelInput
                required
                label="내용"
                name="value"
                maxLength={1024}
                disabled={isDisabled}
                colSpan={2}
                sx={{
                  '.inputBox': { width: '800px' },
                }}
                labelBackgroundFlag
              />
              <Box colSpan={2} sx={{ p: 2, backgroundColor: '#FAFAFA' }}>
                <Typography variant="body2" fontWeight="bold">
                  [유형] 정책을 적용할 대상의 범위를 선택하세요.
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  HEADER:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - HTTP 요청 헤더의 특정 패턴에만 정책을 적용합니다.
                  <br />
                  - 사용자의 브라우저(User-Agent) 또는 특정 헤더 값이 포함된 요청을 확인할 수
                  있습니다.
                  <br />
                  예) User-Agent: .*MSIE → Internet Explorer 사용자 차단
                  <br />
                  Referer: .*facebook.com → Facebook에서 유입된 트래픽 차단
                  <br />
                </Typography>

                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  PAYLOAD:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - 웹 페이지의 **본문(텍스트 내용)**에 특정 단어나 구문이 포함되었을 때만 정책을
                  적용합니다.
                  <br />
                  예) abc → `abc` 단어가 포함된 모든 페이지 차단
                  {/* < abc > → "abc" 단어가 포함된 모든 페이지 차단
                  <test>,<secondtest> → "test"와 "secondtest"가 모두 포함된 페이지만 차단
                  <this is a test phrase> → 특정 문장 "this is a test phrase"가 포함된 경우 차단 */}
                </Typography>

                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  URL:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  - URL 또는 URL 패턴에만 정책을 적용합니다.
                  <br />
                  - 이미지, 동영상 등 특정 콘텐츠 유형을 포함한 URL을 차단할 수 있습니다.
                  <br />
                  예) (^|[\?+=&/])(.*\.google\..*/.*\?.*safe=off)([\?+=&/]|$) → 구글에서 안전
                  검색(SafeSearch)이 해제된 검색 차단
                  <br />
                  (images.google)+.*(\.jpg|\.wmv|\.mpg|\.mpeg|\.gif|\.mov) → Google 이미지 검색
                  결과에서 이미지, 영상 파일 차단
                  <br />
                  (google.com\/video) → Google 비디오 검색 차단
                </Typography>
              </Box>
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default PatternStatusModal;
