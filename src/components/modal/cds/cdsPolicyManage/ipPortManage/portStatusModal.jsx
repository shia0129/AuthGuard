import { useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import portStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/portStatusApi';

function PortStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getPortStatusList } = props;
  const { flag, id } = modalParams;
  const { instance } = AuthInstance();

  portStatusApi.axios = instance;

  const parameterData = useSelector((state) => state.portStatus);
  const current = parameterData.parameters.current;

  const [apiCall, openModal] = useApi();

  const methods = useForm({
    defaultValues: {
      name: '',
      remark: '',
      startPort: '',
      endPort: '',
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
    if (flag === 'update') {
      getPortStatusDetail();
    }
  }, []);

  const getPortStatusDetail = async () => {
    const result = await apiCall(portStatusApi.getPortStatusDetails, id);

    for (const key in result) {
      if (result[`${key}`] === null) {
        methods.setValue(key, '');
      } else {
        methods.setValue(key, result[`${key}`]);
      }
    }
  };

  const saveButtonClick = async (data) => {
    let result = '';

    if (flag === 'update') {
      result = await apiCall(portStatusApi.updatePortStatusData, data);
    } else {
      result = await apiCall(portStatusApi.insertPortStatusData, data);
    }

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getPortStatusList();
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
      title={`포트 객체 상세 ${flag === 'insert' ? '작성' : '수정'}`}
      confirmLabel="저장"
    >
      <FormProvider {...methods}>
        <form id="portStatusModal">
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
            <LabelInput required label="객체명" name="name" labelBackgroundFlag />
            <LabelInput label="설명" name="remark" labelBackgroundFlag />
            <LabelInput
              required
              label="포트(From)"
              name="startPort"
              onlyNumber
              labelBackgroundFlag
            />
            <LabelInput required label="포트(To)" name="endPort" onlyNumber labelBackgroundFlag />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default PortStatusModal;
