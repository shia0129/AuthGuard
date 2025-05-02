import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import segmentStatusApi from '@api/hss/sslva/policy/segmentStatusApi';
import { Typography } from '@mui/material';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Box, Button, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

function SegmentStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getSegmentStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  segmentStatusApi.axios = instance;

  const parameterData = useSelector((state) => state.segmentStatus);
  console.log(parameterData);
  const bridgelist = parameterData?.bridgeList ?? [];
  const linkedlist = parameterData?.linkedList ?? [];
  //const linkedlist = parameterData?. ?? [];

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isStatusDisabled, setIsStatusDisabled] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      network: {
        type: 'route',
        in: {
          interface_type: 'static',
        },
        out: {
          interface_type: 'static',
        },
      },
      routes: [],
      ssh: {
        port: 22,
      },
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: methods.control,
    name: 'routes',
  });

  // useEffect(() => {
  //   if (fields.length === 0) {
  //     const defaultRoutes = [
  //       {
  //         type: 'net',
  //         target: '10.10.0.0',
  //         netmask: '255.255.255.0',
  //         gateway: '10.10.0.1',
  //       },
  //       {
  //         type: 'host',
  //         target: '8.8.8.8',
  //         gateway: '192.168.0.1',
  //       },
  //     ];
  //     defaultRoutes.forEach((route) => append(route));
  //   }
  // }, [append, fields.length]);

  const [selectedType, setSelectedType] = useState(methods.getValues('network.type'));
  const isBridge = selectedType === 'bridge';

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    const subscription = methods.watch((value, { name }) => {
      if (name === 'network.type') {
        const selected = value?.network?.type;
        setSelectedType(selected);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (flag === 'update') {
      setIsDisabled(true);
    } else if (flag === 'insert') {
      setIsStatusDisabled(true);
    }

    return () => {
      source.cancel();
    };
  }, []);

  const fetcher = useCallback(() => {
    return apiCall(segmentStatusApi.getSegmentStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;

        if (value === null) {
          methods.setValue(key, '');
        } else {
          if (key === 'network') {
            const setNestedValues = (basePath, data) => {
              Object.keys(data).forEach((k) => {
                methods.setValue(`${basePath}.${k}`, data[String(k)]);
              });
            };

            methods.setValue('network.type', value['type']);
            methods.setValue('network.ipaddr-v4', value['ipaddr-v4']);
            methods.setValue('network.gateway', value['gateway']);
            methods.setValue('network.subnet', value['subnet']);

            // 네트워크 값들 설정
            const nestedKeys = [
              { path: 'network.in', data: value.in ?? [] },
              { path: 'network.out', data: value.out ?? [] },
              { path: 'network.ex.in', data: value.ex?.in ?? [] },
              { path: 'network.ex.out', data: value.ex?.out ?? [] },
            ];

            nestedKeys.forEach(({ path, data }) => setNestedValues(path, data));
            methods.setValue('network.in.interface_type','static');
            methods.setValue('network.out.interface_type','static');
            methods.setValue('routes', value.routes ?? []);
          } else if (key === 'ssh') {
            Object.keys(value).forEach((k) => {
              methods.setValue(`ssh.${k}`, value[String(k)]);
            });
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

    const convertToBinary = (field) => (field && field.includes('1') ? '1' : '0');

    data = {
      ...data,
      enabled: convertToBinary(data.enabled),
      ssh: {
        ...data.ssh,
        enable: convertToBinary(data.ssh.enable),
      },
      network: {
        ...data.network,
        out: {
          ...data.network?.out,
          default_gateway: convertToBinary(data.network?.out?.default_gateway ?? '0'),
        },
      },
      // routes :{
      //   ...data.routes,
      //   out: {
      //     ...data.routes?.out,
      //   }
      // }
    };

    if (data.network.in.name === data.network.out.name) {
      result = '브릿지 인터페이스는 같은 인터페이스를 사용할 수 없습니다.';
    } else if (data.network.ex.in.name !== '' && data.network.ex.out.name === '') {
      result = '외부 연동 인터페이스는 IN 또는 OUT 하나만 선택할 수 없습니다.';
    } else if (data.network.ex.in.name === '' && data.network.ex.out.name !== '') {
      result = '외부 연동 인터페이스는 IN 또는 OUT 하나만 선택할 수 없습니다.';
    } else if (
      data.network.ex.in.name !== '' &&
      data.network.ex.out.name !== '' &&
      data.network.ex.in.name === data.network.ex.out.name
    ) {
      result = '외부 연동 인터페이스는 같은 인터페이스를 사용할 수 없습니다.';
    }

    if (result.length !== 0) {
      requestAnimationFrame(() => {
        document.activeElement?.blur();
        openModal({
          message: result,
          onConfirm: () => { },
        });
      });
      return;
    }

    setIsSaving(true);
    if (flag === 'update') {
      result = await apiCall(segmentStatusApi.updateSegmentStatusData, data);
    } else {
      result = await apiCall(segmentStatusApi.insertSegmentStatusData, data);
    }
    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getSegmentStatusList();
        },
      });
    }
  };
  const routeTypes = useWatch({
    name: 'routes',
    control: methods.control,
  });

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`세그먼트 ${flag === 'insert' ? '추가' : '수정'}`}
      confirmLabel="저장"
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="segmentStatusModal">
            <Typography variant="h5">기본 정보</Typography>
            <GridItem
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
                '.inputBox': {
                  maxWidth: '400px',
                  minWidth: '400px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              <LabelInput
                type="checkbox"
                name="enabled"
                label="활성화 여부"
                list={[{ label: '', value: '1', disabled: isStatusDisabled }]}
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="세그먼트명"
                name="name"
                disabled={isDisabled}
                labelBackgroundFlag
              />
            </GridItem>
            <br />
            <Typography variant="h5">네트워크 정보</Typography>
            {isBridge ? (
              <GridItem
                direction="row"
                divideColumn={1}
                borderFlag
                sx={{
                  mt: '7px',
                  '& .text': { maxWidth: '250px !important', minWidth: '250px !important' },
                  '.inputBox': {
                    maxWidth: '400px',
                    minWidth: '400px',
                  },
                  '.CMM-li-inputArea-formControl': {
                    maxWidth: '200px !important',
                    minWidth: '200px !important',
                  },
                }}
              >
                <LabelInput
                  required
                  type="select"
                  list={[
                    { value: 'bridge', label: 'Bridge' },
                    { value: 'route', label: 'Route' },
                  ]}
                  label="네트워크 타입"
                  name="network.type"
                  disabledefault
                  labelBackgroundFlag
                />
                <LabelInput
                  required
                  type="select"
                  label="브릿지 인터페이스(IN)"
                  name="network.in.name"
                  list={bridgelist || []}
                  fullWidth
                  disabledefault
                  labelBackgroundFlag
                />
                <LabelInput
                  required
                  type="select"
                  label="브릿지 인터페이스(OUT)"
                  name="network.out.name"
                  list={bridgelist || []}
                  fullWidth
                  disabledefault
                  labelBackgroundFlag
                />
                <LabelInput
                  label="IP"
                  name="network.ipaddr-v4"
                  // placeholder="10.0.0.200"
                  labelBackgroundFlag
                />
                <LabelInput
                  label="서브넷"
                  name="network.subnet"
                  // placeholder="255.255.255.0"
                  labelBackgroundFlag
                />
                <LabelInput label="게이트웨이" name="network.gateway" labelBackgroundFlag />
                <LabelInput
                  type="select"
                  label="외부연동 인터페이스(IN)"
                  name="network.ex.in.name"
                  list={linkedlist || []}
                  fullWidth
                  // disabledefault
                  labelBackgroundFlag
                />
                <LabelInput
                  type="select"
                  label="외부연동 인터페이스(OUT)"
                  name="network.ex.out.name"
                  list={linkedlist || []}
                  fullWidth
                  // disabledefault
                  labelBackgroundFlag
                />
              </GridItem>
            ) : (
              <GridItem
                direction="row"
                divideColumn={1}
                borderFlag
                sx={{
                  mt: '7px',
                  '& .text': { maxWidth: '250px !important', minWidth: '250px !important' },
                  '.inputBox': {
                    maxWidth: '400px',
                    minWidth: '400px',
                  },
                  '.CMM-li-inputArea-formControl': {
                    maxWidth: '200px !important',
                    minWidth: '200px !important',
                  },
                }}
              >
                <LabelInput
                  required
                  type="select"
                  list={[
                    { value: 'bridge', label: 'Bridge' },
                    { value: 'route', label: 'Route' },
                  ]}
                  label="네트워크 타입"
                  name="network.type"
                  disabledefault
                  labelBackgroundFlag
                />
                <LabelInput
                  type="select"
                  label="외부연동 인터페이스(IN)"
                  name="network.ex.in.name"
                  list={linkedlist || []}
                  fullWidth
                  // disabledefault
                  labelBackgroundFlag
                />
                <LabelInput
                  type="select"
                  label="외부연동 인터페이스(OUT)"
                  name="network.ex.out.name"
                  list={linkedlist || []}
                  fullWidth
                  // disabledefault
                  labelBackgroundFlag
                />
              </GridItem>
            )}
            <br />
            {!isBridge && (
              <>
                <Typography variant="h5">네트워크: IN</Typography>
                <GridItem
                  direction="row"
                  divideColumn={2}
                  borderFlag
                  sx={{
                    mt: '7px',
                    '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                    '.inputBox': {
                      maxWidth: '200px',
                      minWidth: '200px',
                    },
                    '.CMM-li-inputArea-formControl': {
                      maxWidth: '200px !important',
                      minWidth: '200px !important',
                    },
                  }}
                >
                  <LabelInput
                    required
                    type="select"
                    list={bridgelist}
                    label="네트워크(IN)"
                    name="network.in.name"
                    disabledefault
                    labelBackgroundFlag
                  />
                  {/* <LabelInput
                    required
                    type="select"
                    list={[
                      { value: 'static', label: 'Static' },
                      { value: 'dhcp', label: 'DHCP' },
                    ]}
                    label="타입"
                    name="network.in.interface_type"
                    disabledefault
                    labelBackgroundFlag
                  /> */}
                  <LabelInput
                    label="IP"
                    name="network.in.ipaddr-v4"
                    //placeholder="10.0.0.200"
                    labelBackgroundFlag
                  />
                  <LabelInput
                    label="서브넷"
                    name="network.in.subnet"
                    //placeholder="255.255.255.0"
                    labelBackgroundFlag
                  />
                  <LabelInput
                    label="게이트웨이"
                    name="network.in.gateway"
                    //placeholder="10.0.0.1"
                    labelBackgroundFlag
                    colSpan={1}
                  />

                </GridItem>
                <br />
                <Typography variant="h5">네트워크: OUT</Typography>
                <GridItem
                  direction="row"
                  divideColumn={2}
                  borderFlag
                  sx={{
                    mt: '7px',
                    '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                    '.inputBox': {
                      maxWidth: '200px',
                      minWidth: '200px',
                    },
                    '.CMM-li-inputArea-formControl': {
                      maxWidth: '200px !important',
                      minWidth: '200px !important',
                    },
                  }}
                >
                  <LabelInput
                    required
                    type="select"
                    list={bridgelist}
                    label="네트워크(OUT)"
                    name="network.out.name"
                    disabledefault
                    labelBackgroundFlag
                  />
                  {/* <LabelInput
                    required
                    type="select"
                    list={[
                      { value: 'static', label: 'Static' },
                      { value: 'dhcp', label: 'DHCP' },
                    ]}
                    label="타입"
                    name="network.out.interface_type"
                    disabledefault
                    labelBackgroundFlag
                  /> */}
                  <LabelInput
                    label="IP"
                    name="network.out.ipaddr-v4"
                    //placeholder="10.0.0.200"
                    labelBackgroundFlag
                  />
                  <LabelInput
                    label="서브넷"
                    name="network.out.subnet"
                    //placeholder="255.255.255.0"
                    labelBackgroundFlag
                  />
                  <LabelInput
                    label="게이트웨이"
                    name="network.out.gateway"
                    //placeholder="10.0.0.1"
                    labelBackgroundFlag
                  />
                  <LabelInput
                    type="checkbox"
                    label="디폴트 게이트웨이"
                    name="network.out.default_gateway"
                    list={[{ label: '', value: '1' }]}
                    labelBackgroundFlag
                  />
                  <></>
                </GridItem>

              </>
            )}
            {!isBridge && (
              <>
                <br />
                <Typography variant="h5">라우팅 정보</Typography>
                {fields.map((item, index) => {
                  const type = routeTypes?.[index]?.type || 'net';
                  return (

                    <GridItem
                      key={item.id}
                      direction="row"
                      divideColumn={2}
                      borderFlag
                      sx={{
                        mt: '7px',
                        '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                        '.inputBox': {
                          maxWidth: '200px',
                          minWidth: '200px',
                        },
                        '.CMM-li-inputArea-formControl': {
                          maxWidth: '200px !important',
                          minWidth: '200px !important',
                        },
                      }}
                    >

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',      // 세로 중앙 정렬
                          justifyContent: 'center',  // 가로 중앙 정렬
                          justifyContent: 'flex-start',
                          height: '100%',
                          mt: 0,
                        }}
                      >
                        <Button
                          color="error"
                          startIcon={<RemoveCircle />}
                          variant="outlined"
                          size="small"
                          onClick={() => remove(index)}
                        >
                          라우트 삭제
                        </Button>
                      </Box>
                      <LabelInput
                        required
                        type="select"
                        list={[
                          { label: 'Net', value: 'net' },
                          { label: 'Host', value: 'host' },
                        ]}
                        label="타입"
                        name={`routes.${index}.type`}
                        labelBackgroundFlag
                        disabledefault
                      />
                      <LabelInput
                        required
                        label="목적지"
                        name={`routes.${index}.target`}
                        labelBackgroundFlag
                      />
                      {type === 'net' ? (
                        <LabelInput
                          required
                          label="넷마스크"
                          name={`routes.${index}.netmask`}
                          labelBackgroundFlag
                        />
                      ) : (
                        <Box />
                      )}
                      <LabelInput
                        required
                        label="게이트웨이"
                        name={`routes.${index}.gateway`}
                        labelBackgroundFlag
                      />
                      <></>
                    </GridItem>
                  );
                })}

                <Button
                  startIcon={<AddCircle />}
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    append({
                      type: 'net',
                      target: '',
                      netmask: '',
                      gateway: '',
                    })
                  }
                >
                  라우트 추가
                </Button>
                <br />
              </>
            )}

            <br />
            <Typography variant="h5">SSH</Typography>
            <GridItem
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
                '.inputBox': {
                  maxWidth: '400px',
                  minWidth: '400px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              <LabelInput
                type="checkbox"
                name="ssh.enable"
                label="SSH 활성화 여부"
                list={[{ label: '', value: '1' }]}
                labelBackgroundFlag
              />
              <LabelInput label="SSH 포트" name="ssh.port" placeholder="22" labelBackgroundFlag />
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default SegmentStatusModal;
