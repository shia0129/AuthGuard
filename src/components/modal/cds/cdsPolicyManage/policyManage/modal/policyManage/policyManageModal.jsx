import { useEffect, useState ,useRef} from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import MultipleSelect from '@components/modules/select/multipleSelect';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import ipGroupStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/ipGroupStatusApi';
import portStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/portStatusApi';
import ipStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/ipStatusApi';
import policyManageApi from '@api/indirectLink/policyManageApi';
import { Typography } from '@mui/material';
import BaseInfo from './baseInfo';
import Details from './details';
import NatInfo from './NatInfo';
import moment from 'moment';

function PolicyManageModal(props) {
  const { alertOpen, setModalOpen, getPolicyManageList, processMode, updatePolicyId } = props;

  const { instance, source } = AuthInstance();
  const [apiCall, openModal] = useApi();

  ipGroupStatusApi.axios = instance;
  portStatusApi.axios = instance;
  ipStatusApi.axios = instance;

  const reduxData = useSelector((state) => state.policyManage);

  const current = reduxData.parameters.current;

  const methods = useForm({
    defaultValues: {
      boundType: '',
      policyName: '',
      remark: '',
      enabledType: 'ENABLED',
      serviceMethod: 'nSFTP',
      systemGroupId: 'GROUP1',
      virtualSourceIp: '',
      logStatus: 'DB',
      trafficTimeout: '',
      trafficMeasureTime: '',
      monitorStatus: 'MONITOR',
      trafficLimit: '',
      trafficIdleTimeout: '',
      jobStartTime: '0000',
      jobEndTime: '0000',
      svcOpt: [],
      svcFilter: '',
      saveSourceIpList: [],
      saveDestinationIpList: [],
      savePortList: [],
      useSnatIp: 'NO',
      snatIp: '',
      useSnatPort: 'NO',
      snatPort: '',
      useDnatIp: 'NO',
      dnatIp: '',
      useDnatPort: 'NO',
      dnatPort: '',
    },
  });

  const [destinationIpList, setDestinationIpList] = useState([]);
  const [portList, setPortList] = useState([]);
  const [departIpList, setDepartIpList] = useState([]);

  const [portInitValue, setPortInitValue] = useState([]);
  const [departInitValue, setDepartInitValue] = useState([]);
  const [destinationInitValue, setDestinationInitValue] = useState([]);

  const [destinationIpValue, setDestinationIpValue] = useState([]);
  const [portValue, setPortValue] = useState([]);
  const [departIpValue, setDepartIpValue] = useState([]);

  const [optionData, setOptionData] = useState([]);
  const [selectOptionData, setSelectOptionData] = useState([]);
  const [optionInitValue, setOptionInitValue] = useState([]);

  const getIpList = async (type) => {
    return await apiCall(ipStatusApi.getIpAndGroupList, type);
  };

  const getPortList = async () => {
    const result = await portStatusApi.getPortObjectType();

    setPortList(result);
  };

  const getOptionList = async () => {
    const result = await policyManageApi.getOptionList('POLICY_OPTION');

    const updatedData = result.map((item) => {
      return {
        id: item.key,
        name: item.value,
      };
    });

    setOptionData(updatedData);
  };

  const conditionalIpData = async (value) => {
    const inboundType = value === 'IN_BOUND' ? 'INTERNAL' : 'EXTERNAL';
    const outboundType = value === 'IN_BOUND' ? 'EXTERNAL' : 'INTERNAL';

    const [internalDataList, externalDataList] = await Promise.all([
      getIpList(inboundType),
      getIpList(outboundType),
    ]);

    setDestinationIpList(internalDataList);
    setDepartIpList(externalDataList);
  };

  const handleChange = ({ value, name }) => {
    if (name === 'boundType') {
      conditionalIpData(value);
    }

    return value;
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (processMode === 'update' || processMode === 'copy') {
      getPolicyManageDetail(updatePolicyId);
    } else {
      methods.setValue('boundType', 'IN_BOUND');
      conditionalIpData('IN_BOUND');
    }

    getPortList();
    getOptionList();

    return () => {
      source.cancel();
    };
  }, [alertOpen]);

  useEffect(() => {}, [portInitValue, destinationIpList]);

  const getPolicyManageDetail = async (updatePolicyId) => {
    const result = await apiCall(policyManageApi.getPolicyManageDetails, updatePolicyId);
    conditionalIpData(result['boundType']);

    const setInitialValues = (dataList, setterFunction) => {
      const idList = dataList.map((data) => data.id);

      setterFunction(idList);
    };

    setInitialValues(result['detailPortList'], setPortInitValue);
    setInitialValues(result['detailSourceIpList'], setDepartInitValue);
    setInitialValues(result['detailDestinationIpList'], setDestinationInitValue);
    setOptionInitValue(result['svcOpt']);

    for (const key in result) {
      const value = result[key];

      if (value === null) {
        methods.setValue(key, key === 'svcOpt' ? [] : '');
      } else if (
        !['detailPortList', 'detailSourceIpList', 'detailDestinationIpList'].includes(key)
      ) {
        if (processMode === 'copy' && (key === 'policyName' || key === 'remark')) {
          methods.setValue(key, '');
        } else {
          if (key === 'jobStartTime' || key === 'jobEndTime') {
            methods.setValue(key, moment(value, 'HH:mm'));
          } else {
            methods.setValue(key, value);
          }
        }
      }
    }
  };

  const getNewPortData = (value, initValue) => {
    return value.filter((item) => !initValue.includes(item)).map((item) => item.id);
  };

  const getDeletePortData = (value, initValue) => {
    return initValue.filter((item) => !value.includes(item));
  };

  const getNewIpData = (value, initValue) => {
    return value.filter((item) => !initValue.includes(item.id));
  };

  const getDeleteIpData = (value, initValue, ipList) => {
    const valueIdList = value.map((item) => item.id);
    const delData = initValue.filter((id) => !valueIdList.includes(id));

    return ipList
      .filter((item) => delData.includes(item.id))
      .map((item) => ({ id: item.id, ipObjectType: item.ipObjectType }));
  };

  const getCopyIpData = (initValue, ipList) => {
    return ipList
      .filter((item) => initValue.includes(item.id))
      .map((item) => ({ id: item.id, ipObjectType: item.ipObjectType }));
  };

  const getCopyPortData = (value) => {
    return value.map((item) => item.id);
  };

  const saveButtonClick = async (data) => {
    let result = '';

    const startTimeType = typeof data.jobStartTime;
    const endTimeType = typeof data.jobEndTime;

    if (startTimeType !== 'string') {
      data.jobStartTime = data.jobStartTime.format('HHmm');
    }

    if (endTimeType !== 'string') {
      data.jobEndTime = data.jobEndTime.format('HHmm');
    }

    if (processMode === 'update') {
      data.savePortList = portValue.length > 0 ? getNewPortData(portValue, portInitValue) : [];
      data.deletePortList = portValue.length > 0 ? getDeletePortData(portValue, portInitValue) : [];

      data.saveSourceIpList =
        departIpValue.length > 0 ? getNewIpData(departIpValue, departInitValue) : [];
      data.deleteSourceIpList =
        departIpValue.length > 0
          ? getDeleteIpData(departIpValue, departInitValue, departIpList)
          : [];

      data.saveDestinationIpList =
        destinationIpValue.length > 0 ? getNewIpData(destinationIpValue, destinationInitValue) : [];
      data.deleteDestinationIpList =
        destinationIpValue.length > 0
          ? getDeleteIpData(destinationIpValue, destinationInitValue, destinationIpList)
          : [];

      data.svcOpt = selectOptionData;

      result = await apiCall(policyManageApi.updatePolicyManageData, data);
    } else if (processMode === 'copy') {
      data.saveSourceIpList =
        departIpValue.length > 0 ? departIpValue : getCopyIpData(departInitValue, departIpList);

      data.savePortList = portValue.length > 0 ? getCopyPortData(portValue) : portInitValue;

      data.saveDestinationIpList =
        destinationIpValue.length > 0
          ? destinationIpValue
          : getCopyIpData(destinationInitValue, destinationIpList);

      result = await apiCall(policyManageApi.insertPolicyManageData, data);
    } else {
      data.saveSourceIpList = departIpValue;
      data.saveDestinationIpList = destinationIpValue;
      const savePortData = portValue.map((data) => data.id);
      data.savePortList = savePortData;
      data.svcOpt = selectOptionData;

      result = await apiCall(policyManageApi.insertPolicyManageData, data);
    }

    openModal({
      message: result.errorMessage ? result.errorMessage : result,
      onConfirm: () => {
        if (!result.errorYn) {
          setModalOpen(false);
          getPolicyManageList(current);
        }
      },
    });
  };

  const onOptionChange = (selectList) => {
    const optionNameList = selectList.map((data) => data.name);

    setSelectOptionData(optionNameList);
  };

  const onSaveDestnationIpChange = (selectList) => {
    const destiIpList = selectList.map((data) => ({
      id: data.id,
      ipObjectType: data.ipObjectType,
    }));

    setDestinationIpValue(destiIpList);
  };

  const onSavePortChange = (selectList) => {
    const newPortList = selectList.map((data) => ({ id: data.id }));
    setPortValue(newPortList);
  };

  const onSaveDepartIpChange = (selectList) => {
    const newDepartIpList = selectList.map((data) => ({
      id: data.id,
      ipObjectType: data.ipObjectType,
    }));
    setDepartIpValue(newDepartIpList);
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`CDS 정책 상세 ${processMode === 'insert' ? '작성' : '수정'}`}
      confirmLabel="저장"
    >
      <FormProvider {...methods}>
        <form id="policyManageModal">
          <Typography variant="h5">기본정보</Typography>
          <BaseInfo handleChange={handleChange} processMode={processMode} />
          <Typography variant="h5" sx={{ mt: 5 }}>
            상세정보
          </Typography>
          <Details
            handleChange={handleChange}
            processMode={processMode}
            optionData={optionData}
            onOptionChange={onOptionChange}
            optionInitValue={optionInitValue}
          />
          <Typography variant="h5" sx={{ mt: 5 }}>
            객체 정보
          </Typography>
          <GridItem
            container
            direction="row"
            divideColumn={1}
            borderFlag
            sx={{
              mt: '7px',
              '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
            }}
          >
            <MultipleSelect
              required
              label="목적지IP"
              name="saveDestinationIpList"
              dataList={destinationIpList}
              onValueChange={onSaveDestnationIpChange}
              initValue={destinationInitValue}
            />
            <MultipleSelect
              required
              label="목적지Port"
              name="savePortList"
              dataList={portList}
              onValueChange={onSavePortChange}
              initValue={portInitValue}
            />
            <MultipleSelect
              required
              label="출발지IP"
              name="saveSourceIpList"
              dataList={departIpList}
              onValueChange={onSaveDepartIpChange}
              initValue={departInitValue}
            />
          </GridItem>
          <Typography variant="h5" sx={{ mt: 5 }}>
            NAT 정보
          </Typography>
          <NatInfo />
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default PolicyManageModal;
