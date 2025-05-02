import { useEffect, useState,useRef } from 'react';
// import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import zoneApi from '@api/hss/sslvpn/zoneApi';
import { Stack, Typography } from '@mui/material';
import Loader from '@components/mantis/Loader';

function ZoneModal(props) {
  const { alertOpen, setModalOpen, modalParams, getZoneList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  zoneApi.axios = instance;

  // const parameterData = useSelector((state) => state.zone);
  // const interfaceNameList = parameterData.interfaceNameList;

  const [interfaceNameList, setInterfaceNameListarray] = useState([]);
  const [tlsciphersuiteList, settlsciphersuiteList] = useState([]);
  const [tlscipherList, settlscipherList] = useState([]);
  const [cipherList, setcipherList] = useState([]);
  const [oqssignatureList, setoqssignatureList] = useState([]);
  const [copyinterfaceList, setcopyinterfaceList] = useState([]);

  const authList = [
    { value: 'sha256', label: 'sha256' },
    { value: 'sha384', label: 'sha384' },
  ];

  const [apiCall, openModal] = useApi();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isTLSversion, setTLSversion] = useState(true);
  const [isTLSversionType, setTLSversionType] = useState(2);
  const [isNetworkInType, setIsNetworkInType] = useState(0);
  const [isNetworkOutType, setIsNetworkOutType] = useState(0);

  const [vpnConfigPort, setVpnConfigPort] = useState(20001);
  
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
    },
  });
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const port = methods.getValues('vpn.config.port') ?? null;
    if (port !== null && port.length !== 0) {
      setVpnConfigPort(port);
    }
  }, [methods.watch('vpn.config.port')]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getMakeInfo();
    if (flag === 'update') {
      setIsDisabled(true);
      getDetails();
    }

    return () => {
      source.cancel();
    };
  }, []);

  const getMakeInfo = async () => {
    const result = await apiCall(zoneApi.getZoneMakeInfo, id);
    setInterfaceNameListarray(result['interface_list']);
    settlsciphersuiteList(result['tlsciphersuite_list']);
    settlscipherList(result['tlscipher_list']);
    setcipherList(result['cipher_list']);
    setoqssignatureList(result['oqssignature_list']);
    setcopyinterfaceList(result['copyinterface_list']);
  }

  const getDetails = async () => {
    const result = await apiCall(zoneApi.getZoneDetails, id);
    for (const key in result) {
      const value = result[`${key}`] ?? null;
      if (value === null) {
        methods.setValue(key, '');
      } else {
        if (key === 'network') {
          let value_in = value.in ?? [];
          let value_out = value.out ?? [];
          Object.keys(value_in).forEach((k) => {
            methods.setValue(`network.in.${k}`, value_in[String(k)]);

            if(k == "interface_type"){
              if(value_in[String(k)] == 'none'){
                setIsNetworkInType(3);
              }else if(value_in[String(k)] == 'static'){
                setIsNetworkInType(1);
              }else if(value_in[String(k)] == 'dhcp'){
                setIsNetworkInType(2);
              }
            }
          });
          Object.keys(value_out).forEach((k) => {
            methods.setValue(`network.out.${k}`, value_out[String(k)]);
            if(k == "interface_type"){
              if(value_out[String(k)] == 'none'){
                setIsNetworkOutType(3);
              }else if(value_out[String(k)] == 'static'){
                setIsNetworkOutType(1);
              }else if(value_out[String(k)] == 'dhcp'){
                setIsNetworkOutType(2);
              }
            }
          });
        } else if (key === 'vpn') {
          methods.setValue(`vpn.enable`, value.enable ?? '');
          methods.setValue(`vpn.name`, value.name ?? '');
          let value_config = value.config ?? [];
          let value_client_config = value.client_config ?? [];
          Object.keys(value_config).forEach((k) => {
            methods.setValue(`vpn.config.${k}`, value_config[String(k)]);
            if(k == 'oqssignature'){
              if (value_config['oqssignature'] == '') {
                methods.setValue(`vpn.config.tlsversion`, String(""));
                methods.setValue(`vpn.config.tls-cipher`, String(""));
                methods.setValue(`vpn.config.tls-ciphersuites`, String(""));
                setTLSversion(true);
                setTLSversionType(2);
              } else {
                methods.setValue(`vpn.config.tlsversion`, String("1.3"));
                methods.setValue(`vpn.config.tls-ciphersuites`, String(""));
                setTLSversionType(3);
                setTLSversion(false);
              }
            }else{
              if (value_config['tlsversion'] == "1.2") {
                setTLSversionType(2);
              } else if (value_config['tlsversion'] == "1.3") {
                setTLSversionType(3);
              }
            }
          });
          Object.keys(value_client_config).forEach((k) => {
            methods.setValue(`vpn.client_config.${k}`, value_client_config[String(k)]);
          });
        } else if (key === 'ssh') {
          Object.keys(value).forEach((k) => {
            methods.setValue(`ssh.${k}`, value[String(k)]);
          });
        } else {
          methods.setValue(key, value);
        }
      }
    }
  };

  const list_change_handler = (event) => {
    let value = event['value'];
    if (event['name'] == "network.in.interface_type") {
      if (event['value'] == "none") {
        setIsNetworkInType(3);
      } else if (event['value'] == "static") {
        setIsNetworkInType(1);
      } else if (event['value'] == "dhcp") {
        setIsNetworkInType(2);
      }
    } else if (event['name'] == "network.out.interface_type") {
      if (event['value'] == "none") {
        setIsNetworkOutType(3);
      } else if (event['value'] == "static") {
        setIsNetworkOutType(1);
      } else if (event['value'] == "dhcp") {
        setIsNetworkOutType(2);
      }
    } else if (event['name'] == "vpn.config.tlsversion") {
      if (event['value'] == "1.2") {
        setTLSversionType(2);
      } else if (event['value'] == "1.3") {
        setTLSversionType(3);
      }
    } else if (event['name'] == "vpn.config.oqssignature") {
      if (event['value'] == '') {
        methods.setValue(`vpn.config.tlsversion`, String(""));
        methods.setValue(`vpn.config.tls-cipher`, String(""));
        methods.setValue(`vpn.config.tls-ciphersuites`, String(""));
        setTLSversion(true);
        setTLSversionType(2);
      } else {
        methods.setValue(`vpn.config.tlsversion`, String("1.3"));
        methods.setValue(`vpn.config.tls-ciphersuites`, String(""));
        setTLSversionType(3);
        setTLSversion(false);
      }
    }
    return value;

  }

  const saveButtonClick = async (data) => {
    let result = '';
    
    setIsLoading(true);

    const convertToBinary = (field) => (field && field.includes('1') ? '1' : '0');
    data = {
      ...data,
      enabled: convertToBinary(data.enabled),
      vpn: {
        ...data.vpn,
        enable: convertToBinary(data.vpn.enable),
        config: {
          ...data.vpn.config,
          ['comp-lzo']: convertToBinary(data.vpn.config['comp-lzo']),
          ['client-to-client']: convertToBinary(data.vpn.config['client-to-client']),
          ['duplicate-cn']: convertToBinary(data.vpn.config['duplicate-cn']),
        },
      },
      ssh: {
        ...data.ssh,
        enable: convertToBinary(data.ssh.enable),
      },
    };

    if (flag === 'update') {
      result = await apiCall(zoneApi.updateZoneData, data);
    } else {
      result = await apiCall(zoneApi.insertZoneData, data);
    }
    
    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getZoneList();
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
      title={`ZONE ${flag === 'insert' ? '추가' : '확인'}`}
      confirmLabel="저장"
    >
      {isLoading && <Loader isGuard msg="인증서 생성 중입니다." />}
      <FormProvider {...methods}>
        <form id="zoneModal">
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
              list={[{ label: '', value: '1' }]}
              labelBackgroundFlag
            />
            <LabelInput
              required
              label="ZONE"
              name="name"
              disabled={isDisabled}
              labelBackgroundFlag
            />
            <LabelInput required label="설명" name="description" labelBackgroundFlag />
            <LabelInput
              required
              type="select"
              label="인증 방식"
              name="authtype"
              list={[{ value: 'ID', label: 'ID' }, { value: 'ID,PWD', label: 'ID,PWD' }, { value: 'ID,PWD,PINCODE', label: 'ID,PWD,PINCODE' }]}
              disabledefault
              labelBackgroundFlag
            />
          </GridItem>
          <br />
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
              list={interfaceNameList}
              label="네트워크(IN)"
              name="network.in.name"
              disabledefault
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              list={[
                { value: 'none', label: 'none' },
                { value: 'static', label: 'static' },
                { value: 'dhcp', label: 'dhcp' },
              ]}
              label="타입"
              name="network.in.interface_type"
              disabledefault
              labelBackgroundFlag
              onHandleChange={list_change_handler}
            />
            <LabelInput
              label="IP"
              name="network.in.ipaddr-v4"
              //placeholder="10.0.0.200"
              labelBackgroundFlag
              disabled={!(isNetworkInType == 1)}
            />
            <LabelInput
              label="서브넷"
              name="network.in.subnet"
              //placeholder="255.255.255.0"
              labelBackgroundFlag
              disabled={!(isNetworkInType == 1)}
            />
            <LabelInput
              label="게이트웨이"
              name="network.in.gateway"
              //placeholder="10.0.0.1"
              labelBackgroundFlag
              disabled={!(isNetworkInType == 1)}
            />
            <LabelInput
              label="디폴트 게이트웨이"
              name="network.in.default_gateway"
              placeholder="0"
              labelBackgroundFlag
              disabled={!(isNetworkInType == 1)}
            />
            <LabelInput
              label="MAC"
              name="network.in.mac"
              placeholder=""
              labelBackgroundFlag
              disabled={!(isNetworkInType == 1)}
            />
            <LabelInput
              label="복사할 MAC"
              type="select"
              list={copyinterfaceList}
              name="network.in.copy_mac"
              //placeholder=""
              labelBackgroundFlag
              disabled={!(isNetworkInType == 3)}
            />
            <LabelInput
              label="복사할 IP"
              type="select"
              list={copyinterfaceList}
              name="network.in.copy_ip"
              //placeholder=""
              labelBackgroundFlag
              disabled={!(isNetworkInType == 3)}
            />
            <></>
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
              list={interfaceNameList}
              label="네트워크(OUT)"
              name="network.out.name"
              disabledefault
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              list={[
                { value: 'none', label: 'none' },
                { value: 'static', label: 'static' },
                { value: 'dhcp', label: 'dhcp' },
              ]}
              label="타입"
              name="network.out.interface_type"
              disabledefault
              labelBackgroundFlag
              onHandleChange={list_change_handler}
            />
            <LabelInput
              label="IP"
              name="network.out.ipaddr-v4"
              //placeholder="10.0.0.200"
              labelBackgroundFlag
              disabled={!(isNetworkOutType == 1)}
            />
            <LabelInput
              label="서브넷"
              name="network.out.subnet"
              //placeholder="255.255.255.0"
              labelBackgroundFlag
              disabled={!(isNetworkOutType == 1)}
            />
            <LabelInput
              label="게이트웨이"
              name="network.out.gateway"
              //placeholder="10.0.0.1"
              labelBackgroundFlag
              disabled={!(isNetworkOutType == 1)}
            />
            <LabelInput
              label="디폴트 게이트웨이"
              name="network.out.default_gateway"
              placeholder="0"
              labelBackgroundFlag
              disabled={!(isNetworkOutType == 1)}
            />
            <LabelInput
              label="MAC"
              name="network.in.mac"
              placeholder=""
              labelBackgroundFlag
              disabled={!(isNetworkOutType == 1)}
            />
            <LabelInput
              label="복사할 MAC"
              name="network.out.copy_mac"
              type="select"
              list={copyinterfaceList}
              //placeholder=""
              labelBackgroundFlag
              disabled={!(isNetworkOutType == 3)}
            />
            <LabelInput
              label="복사할 IP"
              type="select"
              list={copyinterfaceList}
              name="network.out.copy_ip"
              //placeholder=""
              labelBackgroundFlag
              disabled={!(isNetworkOutType == 3)}
            />
            <></>
          </GridItem>
          <br />
          <Typography variant="h5">VPN: 기본 정보</Typography>
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
              name="vpn.enable"
              label="VPN 활성화 여부"
              list={[{ label: '', value: '1' }]}
              labelBackgroundFlag
            />
            <LabelInput
              required
              label="VPN명"
              name="vpn.name"
              placeholder=""
              labelBackgroundFlag
            />
            <LabelInput
              required
              label="네트워크 설정"
              name="vpn.config.server"
              placeholder="10.8.0.0 255.255.255.0"
              labelBackgroundFlag
            />
            <LabelInput
              required
              label="터널링 포트"
              name="vpn.config.port"
              minValue={1}
              maxValue={65535}
              onlyNumber
              placeholder={String(vpnConfigPort)}
              labelBackgroundFlag
            />

            <LabelInput
              type="select"
              list={oqssignatureList}
              label="Post Quantum  Signature "
              name="vpn.config.oqssignature"
              onHandleChange={list_change_handler}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              list={[
                { label: '1.2', value: '1.2' },
                { label: '1.3', value: '1.3' },
              ]}
              label="TLS version"
              name="vpn.config.tlsversion"
              onHandleChange={list_change_handler}
              disabled={!isTLSversion}
              disabledefault
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="Cipher-Suites [ TLS 1.2 ]"
              list={tlscipherList}
              name="vpn.config.tls-cipher"
              disabled={!(isTLSversionType == 2)}
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="tls-cipher [ TLS 1.3 ]"
              list={tlsciphersuiteList}
              name="vpn.config.tls-ciphersuites"
              disabled={!(isTLSversionType == 3)}
              labelBackgroundFlag
            />
            {/*
            <LabelInput
              required
              type="select"
              list={[
                { label: 'TCP', value: 'tcp' },
                { label: 'UDP', value: 'udp' },
              ]}
              label="프로토콜"
              name="vpn.config.proto"
              disabledefault
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              list={[
                { label: 'TUN', value: 'tun' },
                { label: 'TAP', value: 'tap' },
              ]}
              label="터널링 인터페이스"
              name="vpn.config.dev"
              disabledefault
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              list={[
                { label: 'TUN', value: 'tun' },
                { label: 'TAP', value: 'tap' },
              ]}
              label="인증서 TYPE"
              name="vpn.config.certtype"
              disabledefault
              labelBackgroundFlag
            />
            <LabelInput label="인증 기관(CA) 인증서" name="vpn.config.ca" labelBackgroundFlag />
            <LabelInput label="클라이언트 인증서" name="vpn.config.cert" labelBackgroundFlag />
            <LabelInput label="클라이언트 개인키" name="vpn.config.key" labelBackgroundFlag />
            <LabelInput label="DH 파일" name="vpn.config.dh" labelBackgroundFlag />
            <LabelInput
              label="tls-auth"
              name="vpn.config.tls-auth"
              placeholder="ta.key"
              labelBackgroundFlag
            />
            <LabelInput
              label="push"
              name="vpn.config.push"
              labelBackgroundFlag
              />
            <LabelInput
              label="로그 파일 경로"
              name="vpn.config.log"
              placeholder="/var/log"
              labelBackgroundFlag
            />
            <LabelInput
              label="상태 파일 경로"
              name="vpn.config.status"
              placeholder="/var/log"
              labelBackgroundFlag
            />
            <LabelInput
              label="클라이언트 설정 디렉토리"
              name="vpn.config.client-config-dir"
              placeholder="ccd"
              labelBackgroundFlag
            />
            <LabelInput
              label="learn-address"
              name="vpn.config.learn-address"
              labelBackgroundFlag
            />
            <LabelInput
              type="checkbox"
              list={[{ label: '사용', value: '1' }]}
              label="중복 클라이언트 허용"
              name="vpn.config.duplicate-cn"
              labelBackgroundFlag
            />
            <LabelInput
              label="압축 옵션"
              name="vpn.config.compress"
              labelBackgroundFlag />
            <LabelInput
              label="management"
              name="vpn.config.management"
              labelBackgroundFlag />
            <LabelInput
              label="vpnexternconfig"
              name="vpn.config.vpnexternconfig"
              labelBackgroundFlag
            />
            */}
            <LabelInput
              required
              type="select"
              list={cipherList || ''}
              label="암호화 방식"
              disabledefault
              name="vpn.config.cipher"
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              list={authList || ''}
              label="인증 방식"
              name="vpn.config.auth"
              disabledefault
              labelBackgroundFlag
            />

            <LabelInput
              label="로그 레벨"
              name="vpn.config.verb"
              placeholder="3"
              labelBackgroundFlag
            />
            <LabelInput
              label="topology"
              type="select"
              list={[
                { label: 'subnet', value: 'subnet' },
                { label: 'net30', value: 'net30' },
                { label: 'p2p', value: 'p2p' },
              ]}
              name="vpn.config.topology"
              labelBackgroundFlag
            />

            <LabelInput
              label="route"
              name="vpn.config.route"
              labelBackgroundFlag
            />
            <LabelInput
              type="checkbox"
              list={[{ label: '사용', value: '1' }]}
              label="Client to Client"
              name="vpn.config.client-to-client"
              labelBackgroundFlag
            />
            <LabelInput
              label="Keepalive"
              name="vpn.config.keepalive"
              placeholder="10 120"
              labelBackgroundFlag
            />
            <LabelInput
              type="checkbox"
              list={[{ label: '사용', value: '1' }]}
              label="lzo 압축 여부"
              name="vpn.config.comp-lzo"
              labelBackgroundFlag
            />
            <LabelInput
              label="최대 클라이언트 수"
              name="vpn.config.max-clients"
              placeholder="1500"
              onlyNumber
              labelBackgroundFlag
            />
            <LabelInput
              label="ADD-CUSTOM-CONF"
              name="vpn.config.ADD-CUSTOM-CONF"
              labelBackgroundFlag
            />
            {/*
            <LabelInput
              label="vpnroute_list"
              name="vpn.config.vpnroute_list"
              labelBackgroundFlag
            />
            */}
            <></>
          </GridItem>
          <br />
          <Typography variant="h5">VPN: 클라이언트 정보</Typography>
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
              label="접속 URL"
              name="vpn.client_config.vpnconnecturl"
              placeholder=""
              labelBackgroundFlag
            />
            <LabelInput
              label="접속 포트"
              name="vpn.client_config.vpnconnectport"
              placeholder={String(vpnConfigPort)}
              labelBackgroundFlag
            />
          </GridItem>
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
    </PopUp>
  );
}

export default ZoneModal;
