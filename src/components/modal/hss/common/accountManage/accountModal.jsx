import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { unstable_batchedUpdates } from 'react-dom';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import accountApi from '@api/hss/common/accountManage/accountApi';
import accountGroupApi from '@api/hss/common/accountManage/accountGroupApi';

import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function AccountModal(props) {
  const { alertOpen, setModalOpen, modalParams, getAccountList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  accountApi.axios = instance;
  accountGroupApi.axios = instance;

  const parameterData = useSelector((state) => state.account);
  const loginTypeList = parameterData.loginTypeList;
  const groupNameList = parameterData.groupNameList;

  const [isUpdate, setIsUpdate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [apiCall, openModal] = useApi();

  const methods = useForm({
    defaultValues: {
      name: '',
      groupName: '',
      password: '',
      confirmPassword: '',
      pincode: '',
      confirmPincode: '',
      loginType: '',
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

    if (flag === 'update') {
      setIsUpdate(true);
    }

    return () => {
      source.cancel();
    };
  }, []);

  const fetcher = useCallback(() => {
    return apiCall(accountApi.getAccountDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[`${key}`] ?? null;

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
      result = await apiCall(accountApi.updateAccountData, data);
    } else {
      result = await apiCall(accountApi.insertAccountData, data);
    }

    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getAccountList();
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
      title={`계정 ${flag === 'insert' ? '추가' : '수정'}`}
      confirmLabel="저장"
    >
      {isSaving && <Loader isGuard msg="RSA 키 생성 중입니다." />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="accountModal">
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
                label="계정명"
                name="name"
                disabled={flag == 'update'}
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="그룹명"
                name="groupName"
                list={groupNameList}
                fullWidth
                disabledefault
                labelBackgroundFlag
              />
              <LabelInput
                required={!isUpdate}
                label="패스워드"
                name="password"
                htmlType="password"
                labelBackgroundFlag
              />
              <LabelInput
                required={!isUpdate}
                label="패스워드 확인"
                name="confirmPassword"
                htmlType="password"
                labelBackgroundFlag
              />
              <LabelInput
                required={!isUpdate}
                label="핀코드"
                name="pincode"
                htmlType="password"
                labelBackgroundFlag
              />
              <LabelInput
                required={!isUpdate}
                label="핀코드 확인"
                name="confirmPincode"
                htmlType="password"
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="인증방식"
                name="loginType"
                list={loginTypeList}
                fullWidth
                disabledefault
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

export default AccountModal;
