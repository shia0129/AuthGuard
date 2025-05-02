import { useEffect, useState,useRef } from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import MultipleSelect from '@components/modules/select/multipleSelect';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import userApi from '@api/hss/sslvpn/userApi';
import accountGroupApi from '@api/hss/common/accountManage/accountGroupApi';
import accountApi from '@api/hss/common/accountManage/accountApi';
import Loader from '@components/mantis/Loader';

function UserModal(props) {
  const { alertOpen, setModalOpen, modalParams, getUserList } = props;
  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  userApi.axios = instance;
  accountGroupApi.axios = instance;
  accountApi.axios = instance;

  const parameterData = useSelector((state) => state.user);
  // const current = parameterData.parameters.current;
  const zoneNameList = parameterData.zoneNameList;

  const [groupValue, setGroupValue] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [selectedGroupList, setSelectedGroupList] = useState([]);
  const [isGroupValueChange, setIsGroupValueChange] = useState(false);

  const [accountValue, setAccountValue] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [selectedAccountList, setSelectedAccountList] = useState([]);
  const [isAccountValueChange, setIsAccountValueChange] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [apiCall, openModal] = useApi();

  const methods = useForm({
    defaultValues: {
      zoneName: '',
      groupIdList: [],
      accountIdList: [],
    },
  });

  const onGroupValueChange = (selectList) => {
    const selectGroupList = selectList.map((data) => data.id);
    setSelectedGroupList(selectGroupList);
    setIsGroupValueChange(true);
  };

  const onAccountValueChange = (selectList) => {
    const selectAccountList = selectList.map((data) => data.id);
    setSelectedAccountList(selectAccountList);
    setIsAccountValueChange(true);
  };
  const useEffect_0001 = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }

    getGroupList();
    getAccountList();

    if (flag === 'update') {
      setIsDisabled(true);
      getDetails();
    }

    return () => {
      source.cancel();
    };
  }, []);

  const getDetails = async () => {
    const result = await apiCall(userApi.getUserDetails, id);
    for (const key in result) {
      const value = result[`${key}`] ?? null;

      if (value === null) {
        methods.setValue(key, '');
      } else {
        if (key === 'groupList') {
          const gList = value ?? [];
          const gIdList = gList.map((item) => item.id ?? null).filter((id) => id !== null);
          setGroupValue(gIdList);
        } else if (key === 'accountList') {
          const aList = value ?? [];
          const aIdList = aList.map((item) => item.id ?? null).filter((id) => id !== null);
          setAccountValue(aIdList);
        } else {
          methods.setValue(key, value);
        }
      }
    }
  };

  const saveButtonClick = async (data) => {
    let result = '';

    setIsLoading(true);

    if (flag === 'update') {
      if (isGroupValueChange) {
        data.groupIdList = selectedGroupList.length > 0 ? selectedGroupList : [];
      } else {
        data.groupIdList = groupValue;
      }
      if (isAccountValueChange) {
        data.accountIdList = selectedAccountList.length > 0 ? selectedAccountList : [];
      } else {
        data.accountIdList = accountValue;
      }

      result = await apiCall(userApi.updateUserData, data);
    } else {
      // console.log(selectedGroupList.length);
      // console.log(selectedAccountList.length);
      // if (selectedGroupList.length === 0 && selectedAccountList.length === 0) {
      //   modal로 그룹 또는 사용자 목록을 선택해주세요. 띄우기
      //   return;
      // }
      // result = await apiCall(userApi.insertUserData, data);
    }

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getUserList();
        },
      });
    }
  };

  const getGroupList = async () => {
    const result = await apiCall(accountGroupApi.getAccountGroupList, { contentOnly: true });
    if (result) {
      setGroupList(result);
    }
  };

  const getAccountList = async () => {
    const result = await apiCall(accountApi.getAccountList, { contentOnly: true });
    if (result) {
      setAccountList(result);
    }
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`사용자 ${flag === 'insert' ? '추가' : '수정'}`}
      confirmLabel="저장"
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="userModal">
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
              type="select"
              list={zoneNameList}
              label="ZONE"
              name="zoneName"
              disabled={isDisabled}
              labelBackgroundFlag
            />
            <LabelInput label="설명" name="zoneDescr" disabled={isDisabled} labelBackgroundFlag />
            <MultipleSelect
              label="그룹 목록"
              name="groupIdList"
              dataList={groupList}
              onValueChange={onGroupValueChange}
              initValue={groupValue}
            />
            <MultipleSelect
              label="계정 목록"
              name="accountIdList"
              dataList={accountList}
              onValueChange={onAccountValueChange}
              initValue={accountValue}
            />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default UserModal;
