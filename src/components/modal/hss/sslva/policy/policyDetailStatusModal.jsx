import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import MultipleSelect from '@components/modules/select/multipleSelect';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import policyDetailStatusApi from '@api/hss/sslva/policy/policyDetailStatusApi';
import { Stack, CircularProgress, Box } from '@mui/material';
import Loader from '@components/mantis/Loader';
import { unstable_batchedUpdates } from 'react-dom';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function PolicyDetailStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getPolicyDetailStatusList, protocolList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  policyDetailStatusApi.axios = instance;

  const protocolTypeList = useSelector((state) => state.policyDetailStatus.protocolTypeList);
  const certNameList = useSelector((state) => state.policyDetailStatus.certNameList);

  const [apiCall, openModal] = useApi();
  const [protocolValue, setProtocolValue] = useState([]);
  const [selectedProtocolList, setSelectedProtocolList] = useState([]);
  const [isProtocolValueChange, setProtocolValueChange] = useState(false);
  const [isUserAuthChecked, setUserAuthChecked] = useState(false);
  const [protocolToProtocolList, setProtocolToProtocolList] = useState([]);
  const [isDisabledProtocol, setIsDisabledProtocol] = useState(false);
  const [isDisabledHttps2http, setIsDisabledHttps2http] = useState(true);

  // const [isInitLoading, setIsInitLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      protocolTypeId: '',
      protocolIdList: [],
      passthrough: [0],
      verifyPeer: [0],
      validateProto: [0],
      denyOcsp: [0],
      userAuth: [0],
      linked: [0],
      userTimeout: 3600,
      userAuthUrl: '',
      proxyType: '0',
      serverIp: '',
      certName: '',
      https2http: [0],
    },
  });

  const watchedProxyType = useWatch({ control: methods.control, name: 'proxyType' });
  const isForward = watchedProxyType === '0';

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    // if (flag === 'update') {
    //   getPolicyDetailStatusDetail();
    // }

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (flag === 'update') {
      if (methods.getValues().userAuth == 1) {
        setUserAuthChecked(true);
      }
    }
  }, [methods.watch().userAuth]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0003.current) {
        useEffect_0003.current = true;
        return;
      }
    }

    const subscription = methods.watch((value, { name }) => {
      if (name === 'protocolTypeId') {
        // 필터링된 리스트 세팅
        const newProtocolList = protocolList.filter(
          (item) => item.protocolTypeId === value.protocolTypeId,
        );
        setProtocolToProtocolList(newProtocolList);

        // 기존 protocolIdList 값 중 유효한 값만 유지
        const currentList = methods.getValues('protocolIdList') || [];
        const validIds = newProtocolList.map((item) => item.id);
        const filtered = currentList.filter((id) => validIds.includes(id));
        methods.setValue('protocolIdList', filtered);

        // 선택 관련 초기화
        setSelectedProtocolList(filtered);
        setProtocolValueChange(true);

        // 상태 기반 컨트롤
        const matched = protocolTypeList.find((item) => item.value === value.protocolTypeId);
        const label = matched?.label?.toLowerCase() ?? '';
        setIsDisabledProtocol(!['smtps', 'https', 'pop3s'].includes(label));
        setIsDisabledHttps2http(!['https'].includes(label));
      }
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  const fetcher = useCallback(() => {
    return apiCall(policyDetailStatusApi.getPolicyDetailStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      const booleanKeys = [
        'passthrough',
        'verifyPeer',
        'validateProto',
        'denyOcsp',
        'userAuth',
        'linked',
        'https2http',
      ];

      const parsed = { ...result };

      // boolean 배열 처리
      booleanKeys.forEach((key) => {
        parsed[key] = [result[key] ?? 0];
      });

      parsed.proxyType = String(result.proxyType ?? '0');
      parsed.certName = result.certName ?? '';

      // 프로토콜
      const selectedProtocolTypeId = result.protocolTypeId;
      const filtered = protocolList.filter(
        (item) => item.protocolTypeId === selectedProtocolTypeId,
      );

      const matchedObjects = (result.protocolIdList ?? [])
        .map((id) => filtered.find((proto) => proto.id === id))
        .filter(Boolean);

      parsed.protocolIdList = matchedObjects.map((item) => item.id);

      unstable_batchedUpdates(() => {
        // 상태 한꺼번에 설정
        methods.reset(parsed);

        setProtocolToProtocolList(filtered);
        setProtocolValue(matchedObjects);

        if (selectedProtocolTypeId == 3) {
          setIsDisabledHttps2http(false);
        }

        if (parsed.userAuth?.[0] === 1) {
          setUserAuthChecked(true);
        }
      });
    },
    [methods, protocolList],
  );

  const isInitLoading = useInitialFormDataLoad({
    enabled: flag === 'update',
    fetcher,
    onLoaded,
  });

  const saveButtonClick = async (formData) => {
    if (isInitLoading) {
      return;
    }

    let result = '';

    // userAuth 체크 상태에 따라 값 결정
    formData.userAuth = isUserAuthChecked ? [1] : [0];

    const convertToBinary = (field) => (field && field.includes(1) ? 1 : 0);

    const binaryConverted = {
      passthrough: convertToBinary(formData.passthrough),
      verifyPeer: convertToBinary(formData.verifyPeer),
      validateProto: convertToBinary(formData.validateProto),
      denyOcsp: convertToBinary(formData.denyOcsp),
      userAuth: convertToBinary(formData.userAuth),
      linked: convertToBinary(formData.linked),
      https2http: convertToBinary(formData.https2http),
    };

    // 프로토콜 목록 (ID만 추출)
    let rawProtocolList =
      flag === 'update'
        ? isProtocolValueChange
          ? selectedProtocolList
          : protocolValue
        : selectedProtocolList;
    const validProtocolIds = protocolToProtocolList.map((item) => item.id);
    const protocolIdList = rawProtocolList
      .map((item) => (typeof item === 'string' ? item : item.id))
      .filter((id) => validProtocolIds.includes(id));

    if (!protocolIdList || protocolIdList.length === 0) {
      requestAnimationFrame(() => {
        document.activeElement?.blur();
        openModal({
          message: '프로토콜 목록을 선택해주세요.',
          onConfirm: () => {},
        });
      });
      return;
    }

    // validateProto, https2http는 protocolTypeId가 3(https)일 때만 유지
    const validateProto =
      parseInt(formData.protocolTypeId) === 3 ? binaryConverted.validateProto : 0;
    const https2http = parseInt(formData.protocolTypeId) === 3 ? binaryConverted.https2http : 0;

    // 공통 필드
    const baseData = {
      name: formData.name,
      proxyType: formData.proxyType,
      protocolTypeId: formData.protocolTypeId,
      protocolIdList,
      linked: binaryConverted.linked,
    };

    let data = {};

    if (formData.proxyType === '0') {
      // Forward 모드
      data = {
        ...baseData,
        verifyPeer: binaryConverted.verifyPeer,
      };
    } else {
      // Reverse 모드
      data = {
        ...baseData,
        serverIp: formData.serverIp,
        certName: formData.certName,
        https2http: https2http,
      };
    }

    // validateProto는 모든 모드에 추가
    data.validateProto = validateProto;

    setIsSaving(true);
    if (flag === 'update') {
      data = { ...data, id };
      result = await apiCall(policyDetailStatusApi.updatePolicyDetailStatusData, data);
    } else {
      result = await apiCall(policyDetailStatusApi.insertPolicyDetailStatusData, data);
    }
    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getPolicyDetailStatusList();
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
      title={`정책 상세 ${flag === 'insert' ? '작성' : '수정'}`}
      confirmLabel="저장"
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="policyDetailStatusModal">
            {/* <Typography variant="h5">기본정보</Typography> */}
            <GridItem
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': {
                  maxWidth: '100%',
                  minWidth: '100%',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              <LabelInput
                required
                label="정책명"
                name="name"
                disabled={flag == 'update'}
                colSpan={2}
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="정책 모드"
                name="proxyType"
                list={[
                  { label: 'Forward', value: '0' },
                  { label: 'Reverse', value: '1' },
                ]}
                fullWidth
                disabledefault
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                list={protocolTypeList}
                label="프로토콜"
                name="protocolTypeId"
                disabledefault
                labelBackgroundFlag
              />
              <Stack direction="row" colSpan={2}>
                <Controller
                  name="protocolIdList"
                  control={methods.control}
                  // key={methods.watch('protocolTypeId')}
                  render={({ field }) => {
                    const selectedIds = field.value || []; // id array
                    return (
                      <MultipleSelect
                        required
                        label="프로토콜 목록"
                        name="protocolIdList"
                        dataList={protocolToProtocolList}
                        value={selectedIds} // id array만 넘겨야 작동
                        onValueChange={(selectedObjects) => {
                          const ids = selectedObjects.map((item) => item.id);
                          field.onChange(ids);
                          setSelectedProtocolList(ids);
                          setProtocolValueChange(true);
                        }}
                        initValue={selectedIds}
                      />
                    );
                  }}
                />
              </Stack>
            </GridItem>
            <GridItem
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': {
                  maxWidth: '100%',
                  minWidth: '100%',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              {isForward && (
                <LabelInput
                  type="checkbox"
                  label="인증서 검증"
                  name="verifyPeer"
                  list={[{ label: '사용', value: 1 }]}
                  labelBackgroundFlag
                />
              )}
              <LabelInput
                type="checkbox"
                label="프로토콜 검증"
                name="validateProto"
                list={[{ label: '사용', value: 1, disabled: isDisabledProtocol }]}
                labelBackgroundFlag
              />
              <LabelInput
                type="checkbox"
                label="외부 연동"
                name="linked"
                list={[{ label: '사용', value: 1 }]}
                labelBackgroundFlag
              />
              {!isForward && (
                <LabelInput
                  required
                  label="내부 서버 IP"
                  name="serverIp"
                  rules={{
                    pattern: {
                      value:
                        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
                      message: '올바른 IPv4 형식을 입력해주세요. 예: 192.168.0.1',
                    },
                  }}
                  labelBackgroundFlag
                />
              )}
              {!isForward && (
                <LabelInput
                  required
                  type="select"
                  label="인증서명"
                  name="certName"
                  list={certNameList}
                  disabledefault
                  labelBackgroundFlag
                />
              )}
              {!isForward && (
                <LabelInput
                  type="checkbox"
                  label="HTTPS to HTTP"
                  name="https2http"
                  list={[{ label: '사용', value: 1, disabled: isDisabledHttps2http }]}
                  labelBackgroundFlag
                />
              )}
              {/* <LabelInput
              type="checkbox"
              label="패스스루"
              name="passthrough"
              list={[{ label: '사용', value: 1 }]}
              labelBackgroundFlag
            />
            <LabelInput
              type="checkbox"
              label="OCSP 거부"
              name="denyOcsp"
              list={[{ label: '사용', value: 1 }]}
              labelBackgroundFlag
            />
            <LabelInput
              type="checkbox"
              label="사용자 인증"
              name="userAuth"
              onHandleChange={handleCheckboxChange}
              list={[
                {
                  checked: isUserAuthChecked,
                  label: '사용',
                  value: 1,
                },
              ]}
              labelBackgroundFlag
            />
            <LabelInput
              label="사용자 타임아웃"
              name="userTimeout"
              onlyNumber
              labelBackgroundFlag
              disabled={!isUserAuthChecked}
            />
            <LabelInput
              label="사용자 인증 URL"
              name="userAuthUrl"
              labelBackgroundFlag
              disabled={!isUserAuthChecked}
            /> */}
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default PolicyDetailStatusModal;
