import { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import srcIpGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/srcIpGroupStatusApi';
import Loader from '@components/mantis/Loader';

function SrcIpGroupStatusModal(props) {
  const { alertOpen, setModalOpen, getSrcIpGroupStatusList } = props;
  const { instance, source } = AuthInstance();

  srcIpGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      action: '0',
    },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    return () => {
      source.cancel();
    };
  }, []);

  const saveButtonClick = async (data) => {
    let result = '';

    setIsLoading(true);

    const { name, action } = data;

    const newData = {
      name: name,
      action: action,
    };

    result = await apiCall(srcIpGroupStatusApi.insertSrcIpGroupStatusData, newData);

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getSrcIpGroupStatusList();
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
      title="출발지IP 그룹 작성"
      confirmLabel="저장"
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="srcIpGroupStatusModal">
          <GridItem
            direction="row"
            divideColumn={1}
            borderFlag
            sx={{
              mt: '7px',
              '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
              '.inputBox': { width: '310px' },
            }}
          >
            <LabelInput
              required
              label="그룹명"
              name="name"
              maxLength={255}
              colSpan={2}
              sx={{
                '.inputBox': { width: '800px' },
              }}
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="radio"
              labelBackgroundFlag
              label="처리 방식"
              name="action"
              list={[
                { label: '차단', value: '0' },
                // { label: '허용', value: '1' },
              ]}
            />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default SrcIpGroupStatusModal;
