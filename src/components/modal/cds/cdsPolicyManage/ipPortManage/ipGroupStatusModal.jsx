import { useEffect, useState,useRef } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import MultipleSelect from '@components/modules/select/multipleSelect';
import LabelInput from '@components/modules/input/LabelInput';
import InputAlert from '@components/modules/common/InputAlert';
import CodeInput from '@components/modules/input/CodeInput';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import { Stack } from '@mui/material';
import ipGroupStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/ipGroupStatusApi';

function IpGroupStatusModal(props) {
  const { alertOpen, setModalOpen, getIpGroupStatusList, modalParams } = props;
  const { flag: isUpdateMode, id: updateIpGroupId } = modalParams;
  const { instance, source } = AuthInstance();

  ipGroupStatusApi.axios = instance;

  const parameterData = useSelector((state) => state.ipGroupStatus);
  const current = parameterData.parameters.current;

  const [apiCall, openModal] = useApi();
  const [ipValue, setIpValue] = useState([]);
  const [ipList, setIpList] = useState([]);
  const [selectedIpList, setSelectedIpList] = useState([]);
  const [ipDataCheck, setIpDataCheck] = useState(false);

  const methods = useForm({
    defaultValues: {
      location: 'INTERNAL',
      name: '',
      remark: '',
      ipObjectIdList: [],
    },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (isUpdateMode === 'update') {
      getIpGroupStatusDetail();
    } else {
      getIpList();
    }

    return () => {
      source.cancel();
    };
  }, []);

  const handleChange = ({ value }) => {
    setIpValue([]);
    getIpList(value);

    return value;
  };

  const getIpList = async (param) => {
    const { updateDataList } = await apiCall(
      ipGroupStatusApi.getIpObjectType,
      param ? param : methods.getValues('location'),
    );

    setIpList(updateDataList);
  };

  const getIpGroupStatusDetail = async () => {
    const result = await apiCall(ipGroupStatusApi.getIpGroupStatusDetails, updateIpGroupId);

    for (const key in result) {
      if (result[`${key}`] === null) {
        methods.setValue(key, '');
      } else {
        if (key === 'ipObjectList') {
          methods.setValue('ipObjectIdList', result[`${key}`]);

          setIpValue(result[`${key}`]);
        } else {
          methods.setValue(key, result[`${key}`]);
        }
      }
    }

    getIpList(methods.getValues('location'));
  };

  const saveButtonClick = async (data) => {
    let result = '';

    if (isUpdateMode === 'update') {
      if (selectedIpList.length === 0) {
        data.ipObjectIdList = ipValue;
      } else {
        data.ipObjectIdList = selectedIpList;
      }

      result = await apiCall(ipGroupStatusApi.updateIpGroupStatusData, data);
    } else {
      if (selectedIpList.length === 0) {
        setIpDataCheck(true);
        return;
      }

      data.ipObjectIdList = selectedIpList;

      result = await apiCall(ipGroupStatusApi.insertIpGroupStatusData, data);
    }
    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          setIpDataCheck(false);
          getIpGroupStatusList();
        },
      });
    }
  };

  const onValueChange = (selectList) => {
    const selectIpList = selectList.map((data) => data.id);
    setSelectedIpList(selectIpList);
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`객체 그룹 상세 ${isUpdateMode === 'insert' ? '작성' : '수정'}`}
      confirmLabel="저장"
    >
      <FormProvider {...methods}>
        <form id="ipGroupStatusModal">
          <GridItem
            direction="row"
            divideColumn={1}
            borderFlag
            sx={{
              mt: '7px',
              '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
              '.inputBox': {
                maxWidth: '150px',
                minWidth: '150px',
              },
              '.CMM-li-inputArea-formControl': {
                maxWidth: '200px !important',
                minWidth: '200px !important',
              },
            }}
          >
            <Stack direction="row" colSpan={3}>
              <CodeInput
                codeType="LOCATION"
                label="위치"
                name="location"
                disabled={isUpdateMode === 'update' && true}
                labelBackgroundFlag
                onHandleChange={handleChange}
              />
              <LabelInput required label="객체명" name="name" labelBackgroundFlag />
              <LabelInput label="설명" name="remark" labelBackgroundFlag />
            </Stack>
            <GridItem sx={{ height: '100%' }}>
              <MultipleSelect
                required
                label="IP목록"
                name="ipObjectIdList"
                dataList={ipList}
                onValueChange={onValueChange}
                initValue={ipValue}
              />
              {ipDataCheck && (
                <InputAlert sx={{ bottom: '55px', left: '188px' }}>
                  IP목록을 선택해주세요.
                </InputAlert>
              )}
            </GridItem>
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}
export default IpGroupStatusModal;
