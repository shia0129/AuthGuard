import { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import timeGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeGroupStatusApi';
import Loader from '@components/mantis/Loader';

function TimeGroupStatusModal(props) {
  const { alertOpen, setModalOpen, getTimeGroupStatusList } = props;
  const { instance, source } = AuthInstance();

  timeGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
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

    const { name } = data;

    const newData = {
      name: name,
    };

    result = await apiCall(timeGroupStatusApi.insertTimeGroupStatusData, newData);

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getTimeGroupStatusList();
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
      title="스케줄 그룹 작성"
      confirmLabel="저장"
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="timeGroupStatusModal">
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
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default TimeGroupStatusModal;
