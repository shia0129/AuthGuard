import { useState, useEffect, useCallback,useRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack } from '@mui/material';
import { Replay } from '@mui/icons-material';
import { unstable_batchedUpdates } from 'react-dom';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import permissionApi from '@api/system/permissionApi';
import HsLib from '@modules/common/HsLib';
import useInput from '@modules/hooks/useInput';

function PermissionList() {
  const { instance, source } = AuthInstance();
  permissionApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const router = useRouter();

  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    userPermissionName: '',
    rank: '',
    useYn: '',
    searchAll: '',
  });

  const [permissionList, setPermissionList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [gridInfo, setGridInfo] = useState({
    api: permissionApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  const [deleteList, setDeleteList] = useState([]);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }

    const init = async () => {
      try {
        const gridInfo = await HsLib.getGridInfo('PermissionList', permissionApi);
        if (gridInfo) {
          const permissionList = await apiCall(permissionApi.getPermissionList, {
            ...parameters,
            sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
            size: gridInfo.listInfo.size,
          });

          unstable_batchedUpdates(() => {
            responseGridInfo(gridInfo);
            responsePermissionList(permissionList);
          });
        }
      } catch (error) {
        console.error('Error fetching permission list:', error);
      }
    };

    init();

    return () => {
      source.cancel();
    };
  }, []);

  const responseGridInfo = (p_gridInfo) => {
    if (p_gridInfo) {
      setColumns(p_gridInfo.columns);
      setGridInfo((prev) => ({
        ...prev,
        listInfo: p_gridInfo.listInfo,
      }));
      setParameters({
        ...parameters,
        sort: `${p_gridInfo.listInfo.sortColumn ?? ''},${p_gridInfo.listInfo.sortDirection ?? ''}`,
        size: p_gridInfo.listInfo.size,
      });
    }
  };

  const responsePermissionList = (p_roleList) => {
    if (p_roleList.status === 200) {
      setPermissionList(p_roleList.data.content);
      setGridInfo((prev) => ({
        ...prev,
        total: p_roleList.data.totalElements,
      }));
    }
  };

  const getPermissionList = useCallback(async (parameters) => {
    try {
      const result = await apiCall(permissionApi.getPermissionList, parameters);
      if (result.status === 200) {
        unstable_batchedUpdates(() => {
          if (!parameters) {
            resetParameters();
          }
          responsePermissionList(result);
        });
      }
    } catch (error) {
      console.error('Error fetching permission list:', error);
    }
  }, []);

  const handleInsertButtonClick = () => {
    router.push({
      pathname: '/system/permission/permissionForm',
      query: { flag: 'insert', id: '' },
    });
  };

  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건의 권한을 삭제하시겠습니까?`,
        onConfirm: deletePermission,
      });
    } else {
      openModal({
        message: '삭제할 권한을 우선 선택해 주십시오.',
      });
    }
  };

  const deletePermission = async () => {
    try {
      const result = await apiCall(
        permissionApi.deletePermission,
        deleteList.map((item) => item.id),
      );

      if (result.status === 200) {
        openModal({
          message: `${result.data}건이 삭제되었습니다.`,
          onConfirm: () => {
            setDeleteList([]);
            getPermissionList(parameters);
          },
        });
      }
    } catch (error) {
      console.error('Error deleting permissions:', error);
    }
  };

  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getPermissionList(parameters)}>
          <GridItem
            container
            divideColumn={3}
            spacing={2}
            sx={{
              pr: 5,
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              label="권한명"
              name="userPermissionName"
              inputProps={{ maxLength: 32 }}
              value={parameters.userPermissionName}
              onChange={changeParameters}
            />
            <LabelInput
              label="등급"
              name="rank"
              inputProps={{ maxLength: 9 }}
              value={parameters.rank}
              onChange={changeParameters}
            />
            <LabelInput
              type="select"
              label="사용 여부"
              name="useYn"
              value={parameters.useYn}
              onChange={changeParameters}
              list={[
                { value: 'Y', label: '사용중' },
                { value: 'N', label: '미사용' },
              ]}
            />
          </GridItem>
        </SearchInput>
        <GridItem item directionHorizon="space-between">
          <ButtonSet
            type="custom"
            options={[
              { label: '추가', color: 'secondary', variant: 'outlined', callBack: handleInsertButtonClick },
              { label: '삭제', color: 'secondary', variant: 'outlined', callBack: handleDeleteButtonClick },
            ]}
          />
          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Button color="secondary" variant="outlined" size="small" onClick={() => getPermissionList()}>
              <Replay />
            </Button>
            <ButtonSet
              type="search"
              options={[
                { label: '초기화', callBack: resetParameters, color: 'secondary', variant: 'outlined' },
                { label: '검색', color: 'primary', variant: 'contained', callBack: () => getPermissionList(parameters) },
              ]}
            />
          </Stack>
        </GridItem>
        <GridItem item>
          <ReactTable columns={columns} data={permissionList} checkList={deleteList} onChangeChecked={setDeleteList} />
        </GridItem>
      </GridItem>
    </>
  );
}

PermissionList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PermissionList;
