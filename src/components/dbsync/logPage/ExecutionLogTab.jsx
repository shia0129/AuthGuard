import GridItem from '@components/modules/grid/GridItem';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import { Box, Grid, Stack } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useState,useRef } from 'react';
import dbsyncApi from '@api/system/dbsyncApi';
import { useIntl } from 'react-intl';
import HsLib from '@modules/common/HsLib';
import useInput from '@modules/hooks/useInput';
import ReactTable from '@components/modules/table/ReactTable';
import ButtonSet from '@components/modules/button/ButtonSet';
import { unstable_batchedUpdates } from 'react-dom';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import moment from 'moment';

const ExcutionLogTab = ({ connectionSeq, connectionInfo, handleChangeConnection }) => {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();

  // 일자 정보 세팅
  let toDay = HsLib.getTodayDate();
  let monthAgo = HsLib.getBeforeDate('1M', toDay);
  // 파라미터 초기화용 변수
  let paramStatus = 'ALL';

  // 실제 사용하지 않지만 ReactTable 필수 파라미터라서 생성함.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    // result: 'ALL',
    connectionName: '',
    status: paramStatus,
    beforeStartTime: monthAgo,
    afterStartTime: toDay,
  });

  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: dbsyncApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  // 로그 리스트 상태값
  const [logList, setLogList] = useState([]);

  const searchParameters = useCallback(
    (parameters) => ({
      ...parameters,
      connectionSeq: connectionSeq,
    }),
    [],
  );

  const getLogList = async (connectionSeq) => {
    if (connectionSeq == 0 || connectionSeq === '') {
      openModal({
        message: '접속 정보를 선택해주세요',
      });
      return;
    }

    if (parameters.status === '') {
      openModal({
        message: '처리 여부를 선택해주세요',
      });
      return;
    }

    if (parameters.beforeStartTime === '' || parameters.afterStartTime === '') {
      openModal({
        message: '실행 시각을 선택해주세요',
      });
      return;
    }

    const result = await apiCall(dbsyncApi.getExecutionLog, {
      ...parameters,
      connectionSeq: connectionSeq,
      beforeStartTime: moment(parameters.beforeStartTime).format('YYYY-MM-DD'),
      afterStartTime: moment(parameters.afterStartTime).format('YYYY-MM-DD'),
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });

    if (result.status == 200) {
      responseLogList(result);
    } else {
      openModal({
        message: `로그조회를 실패했습니다.`,
      });
    }
  };

  //로그목록 응답 처리
  const responseLogList = (p_codeList) => {
    if (p_codeList.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: p_codeList.data.totalElements };
      });
      setLogList(p_codeList.data.content);
    }
  };

  //최초 렌더링시 초기화함수
  const init = async () => {
    // 테이블, 컬럼정보
    const gridInfo = await HsLib.getGridInfo('DbsyncExecution', dbsyncApi, openModal);
    if (gridInfo) {
      unstable_batchedUpdates(() => {
        // 컬럼정보 상태값 변경
        setColumns(gridInfo.columns);
        // 테이블정보 상태값 변경
        setGridInfo((prev) => {
          return { ...prev, listInfo: gridInfo.listInfo };
        });
        // 검색조건 변경
        setParameters({ ...parameters, size: gridInfo.listInfo.size });
      });
    }
  };
  const useEffect_0001 = useRef(false);
  //최초 렌더링시 호출됨.
  useEffect(() => {
   if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();
    return () => source.cancel();
  }, []);

  return (
    <>
      <GridItem container direction="column">
        <SearchInput onSearch={() => getLogList(connectionSeq)}>
          <GridItem
            container
            divideColumn={4.5}
            spacing={2}
            sx={{
              pr: 5,
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              type="select"
              label="접속 정보"
              name="connectionName"
              value={connectionSeq == 0 ? parameters.connectionName : connectionSeq}
              onChange={handleChangeConnection}
              list={connectionInfo}
            />
            <Stack direction="row" alignItems="center" colSpan={1.5}>
              <LabelInput
                type="date1"
                label={'실행시각'}
                name="beforeStartTime"
                sx={{ maxWidth: '150px', minWidth: '150px' }}
                value={parameters.beforeStartTime}
                onChange={changeParameters}
              />
              &nbsp;~&nbsp;
              <LabelInput
                type="date1"
                name="afterStartTime"
                sx={{ maxWidth: '150px', minWidth: '150px' }}
                value={parameters.afterStartTime}
                onChange={changeParameters}
              />
            </Stack>

            <LabelInput
              type="select"
              label={'처리 여부'}
              name="status"
              value={parameters.status}
              onChange={changeParameters}
              list={[
                { value: 'ALL', label: '전체' },
                { value: 'COMPLETED', label: '성공' },
                { value: 'FAILED', label: '실패' },
              ]}
            />
          </GridItem>
        </SearchInput>

        <GridItem item directionHorizon="end" sx={{ mb: 2, mt: 2 }}>
          <ButtonSet
            options={[
              // {
              //   label: '재실행',
              //   callBack: () => {},
              //   variant: 'outlined',
              //   color: 'secondary',
              // },
              {
                label: intl.formatMessage({ id: 'btn-view' }),
                callBack: () => {
                  getLogList(connectionSeq);
                },
                color: 'primary',
              },
            ]}
          />
        </GridItem>
        <GridItem item>
          <ReactTable
            listFuncName="getExecutionLog"
            columns={columns}
            data={logList}
            checkList={[]}
            onChangeChecked={() => {}}
            setData={setLogList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            setParameters={setParameters}
            parameters={unControlRef}
            searchParameters={searchParameters}
          />
        </GridItem>
      </GridItem>
    </>
  );
};

export default ExcutionLogTab;
