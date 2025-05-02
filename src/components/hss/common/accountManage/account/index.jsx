import { useCallback, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setListInfo,
  setParameters,
  setPageDataList,
  setDeleteList,
  setGroupNameList,
  resetState,
} from '@modules/redux/reducers/hss/common/account';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import accountApi from '@api/hss/common/accountManage/accountApi';
import accountGroupApi from '@api/hss/common/accountManage/accountGroupApi';
import AccountSearchForm from './accountSearchForm';
import AccountActionButton from './accountActionButton';
import AccountTable from './accountTable';
import HsLib from '@modules/common/HsLib';

function Account() {
  const { instance, source } = AuthInstance();

  accountApi.axios = instance;
  accountGroupApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.account);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    try {
      const [gridInfo, groupData] = await Promise.all([
        HsLib.getGridInfo('AccountList', accountApi),
        apiCall(accountGroupApi.getAccountGroupColumnList, 'name'),
      ]);

      if (Array.isArray(groupData)) {
        const list = groupData.map((item) => ({
          value: item,
          label: item,
        }));
        dispatch(setGroupNameList(list));
      } else {
        dispatch(setGroupNameList([]));
      }

      unstable_batchedUpdates(() => {
        responseGridInfo(gridInfo);
      });
    } catch (error) {
      dispatch(setGroupNameList([]));
    }

    setIsMount(true);
  };

  const responseGridInfo = (p_gridInfo) => {
    dispatch(setColumns(p_gridInfo.columns));
    dispatch(setListInfo(p_gridInfo.listInfo));
    dispatch(
      setParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  const getAccountList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(accountApi.getAccountList, param);
      if (content) {
        dispatch(setPageDataList({ pageDataList: content, totalElements }));
      }

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      setIsLoading(true);
      const result = await apiCall(
        accountApi.deleteAccountData,
        parameterData.deleteList.map((item) => item.id),
      );
      setIsLoading(false);
      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getAccountList({ ...parameterData.parameters.current, page: 0 });
            dispatch(setParameters({ page: 0 }));
            dispatch(setDeleteList([]));
          },
        });
      }
    } else {
      openModal({
        message: `삭제할 항목을 먼저 선택해주세요.`,
      });
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    dispatch(resetState());
    init();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (isMount) {
      getAccountList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <AccountSearchForm />
      <AccountActionButton
        onSearchButtonClick={getAccountList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      {isMount && <AccountTable getAccountList={getAccountList} />}
    </GridItem>
  );
}

export default Account;
