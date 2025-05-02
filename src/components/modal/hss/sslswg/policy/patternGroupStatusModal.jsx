import { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import patternGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/patternGroupStatusApi';
import Loader from '@components/mantis/Loader';

function PatternGroupStatusModal(props) {
  const { alertOpen, setModalOpen, getPatternGroupStatusList } = props;
  const { instance, source } = AuthInstance();

  patternGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      action: '0',
      type: 'regexpheader',
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

    const { name, action, type } = data;

    const newData = {
      name: name,
      action: action,
      type: type,
    };

    result = await apiCall(patternGroupStatusApi.insertPatternGroupStatusData, newData);

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getPatternGroupStatusList();
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
      title="패턴 그룹 작성"
      confirmLabel="저장"
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="patternGroupStatusModal">
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
              label="유형"
              name="type"
              list={[
                { label: 'HEADER', value: 'regexpheader' },
                { label: 'PAYLOAD', value: 'regexppayload' },
                { label: 'URL', value: 'regexpurl' },
              ]}
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

export default PatternGroupStatusModal;
