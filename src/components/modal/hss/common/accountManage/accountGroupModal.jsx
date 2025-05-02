import { useEffect, useState, useRef, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import accountGroupApi from '@api/hss/common/accountManage/accountGroupApi';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function AccountGroupModal(props) {
  const { alertOpen, setModalOpen, modalParams, getAccountGroupList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  const [isSaving, setIsSaving] = useState(false);

  accountGroupApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const methods = useForm({
    defaultValues: {
      name: '',
      descr: '',
    },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    return () => {
      source.cancel();
    };
  }, []);

  const fetcher = useCallback(() => {
    return apiCall(accountGroupApi.getAccountGroupDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[key] ?? null;

        if (value === null) {
          methods.setValue(key, '');
        } else {
          methods.setValue(key, value);
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

    setIsSaving(true);

    if (flag === 'update') {
      result = await apiCall(accountGroupApi.updateAccountGroupData, data);
    } else {
      result = await apiCall(accountGroupApi.insertAccountGroupData, data);
    }

    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getAccountGroupList();
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
      title={`계정 그룹 ${flag === 'insert' ? '추가' : '수정'}`}
      confirmLabel="저장"
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="accountGroupModal">
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
                required
                label="그룹명"
                name="name"
                disabled={flag == 'update'}
                labelBackgroundFlag
              />
              <LabelInput label="설명" name="descr" labelBackgroundFlag />
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default AccountGroupModal;
