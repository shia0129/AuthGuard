import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import { Stack, Checkbox } from '@mui/material';
import ipStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/ipStatusApi';
import CodeInput from '@components/modules/input/CodeInput';

function IpStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getIpStatusList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  ipStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const methods = useForm({
    defaultValues: {
      location: '',
      name: '',
      remark: '',
      hostType: '',
      ipLength: '',
      startIp: '',
      endIp: '',
    },
  });

  const [isChecked, setIsChecked] = useState(false);
  const [urlChecked, setUrlChecked] = useState(false);

  const handleChange = ({ value }) => {
    if (value === 'URL') {
      setUrlChecked(true);
      methods.setValue('ipLength', '');
    } else {
      setUrlChecked(false);
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
    if (flag === 'update') {
      getIpStatusDetail();
    }

    return () => {
      source.cancel();
    };
  }, []);

  const getIpStatusDetail = async () => {
    const result = await apiCall(ipStatusApi.getIpStatusDetails, id);

    for (const key in result) {
      if (result[`${key}`] === null) {
        methods.setValue(key, '');
      } else {
        if (key === 'hostType') {
          if (result['hostType'] === 'URL') {
            setUrlChecked(true);
          } else {
            setUrlChecked(false);
          }
        }
        methods.setValue(key, result[`${key}`]);
      }
    }
  };

  const saveButtonClick = async (data) => {
    let result = '';

    for (const key in data) {
      if (data[`${key}`] === '') {
        data[`${key}`] = null;
      }
    }

    if (flag === 'update') {
      result = await apiCall(ipStatusApi.updateIpStatusData, data);
    } else {
      result = await apiCall(ipStatusApi.insertIpStatusData, data);
    }

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getIpStatusList();
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
      title={`객체 상세 ${flag === 'insert' ? '작성' : '수정'}`}
      confirmLabel="저장"
    >
      <FormProvider {...methods}>
        <form id="ipStatusModal">
          <GridItem
            direction="row"
            divideColumn={2}
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
            <CodeInput
              required
              codeType="LOCATION"
              label="위치"
              name="location"
              disabled={flag === 'update' && true}
              labelBackgroundFlag
            />

            <LabelInput required label="객체명" name="name" labelBackgroundFlag />
            <CodeInput
              required
              codeType="DIVISION"
              label="IP구분"
              name="hostType"
              onHandleChange={handleChange}
              disabled={flag === 'update' && true}
              labelBackgroundFlag
            />
            <LabelInput
              label="IP대역"
              name="ipLength"
              onlyNumber
              minValue={24}
              maxValue={32}
              disabled={isChecked || urlChecked}
              labelBackgroundFlag
            />

            <Stack direction="row" alignItems="center" colSpan={2}>
              <LabelInput
                required
                label="IP"
                name="startIp"
                maskOptions={{ type: 'ipv4' }}
                labelBackgroundFlag
              />
              &nbsp;~&nbsp;
              <LabelInput name="endIp" disabled={!isChecked} maskOptions={{ type: 'ipv4' }} />
              <Checkbox
                color="secondary"
                variant="contained"
                checked={isChecked}
                disabled={urlChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                }}
              />
              (범위지정)
            </Stack>
            <LabelInput
              label="설명"
              name="remark"
              labelBackgroundFlag
              colSpan={2}
              sx={{ maxWidth: '100% !important' }}
            />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default IpStatusModal;
