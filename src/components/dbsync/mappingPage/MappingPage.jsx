import { AuthInstance } from '@modules/axios';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useEffect,useRef } from 'react';
import dbsyncApi from '@api/system/dbsyncApi';
import MainCard from '@components/mantis/MainCard';
import MappingResultTable from './MappingResultTable';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import { useRef } from 'react';
import useApi from '@modules/hooks/useApi';
import { useIntl } from 'react-intl';
import MappingTable from './MappingTable';

/**
 * MappingPage 정의
 *
 * 고객사, 망연계DB 매핑 페이지
 *
 * @param {String} connectionSeq 선택된 연결정보 seq
 * @param {Function} handleChangePage 보여줄 페이지 지정
 *
 *
 */

function MappingPage({ connectionSeq, handleChangePage }) {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();

  //사용자 매핑정보 컴포넌트 ref
  let userRef = useRef();
  //부서 매핑정보 컴포넌트 ref
  let deptRef = useRef();
  const useEffect_0001 = useRef(false);
  useEffect(() => {
   if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    return () => source.cancel();
  }, []);

  //사용자,부서 매핑정보 재조회
  const refreshMappingData = async () => {
    await userRef.current.refreshMappingData();
    await deptRef.current.refreshMappingData();
  };

  //사용자,부서 매핑정보 저장
  const saveMappingData = async () => {
    const userSaveResult = await userRef.current.saveMappingData();
    const deptSaveResult = await deptRef.current.saveMappingData();

    if (userSaveResult && deptSaveResult) {
      openModal({
        message: '저장을 완료했습니다.',
        onConfirm: () => {},
      });
    }
  };

  //사용자,부서 매핑정보 삭제
  const deleteMappingData = async () => {
    const userDelCount = await userRef.current.deleteMappingData();
    const deptDelCount = await deptRef.current.deleteMappingData();

    if (userDelCount !== null && deptDelCount !== null) {
      openModal({
        message: `${userDelCount + deptDelCount}건이 삭제되었습니다.`,
        onConfirm: () => {
          refreshMappingData();
        },
      });
    }
  };

  return (
    <>
      <GridItem container directionHorizon="center" directionVertical="center" px={2} pb={2}>
        <Stack direction="row" sx={{ width: '300px', justifyContent: 'space-between' }}>
          <ButtonSet
            type="custom"
            options={[
              {
                label: intl.formatMessage({ id: 'btn-back' }),
                callBack: () => {
                  handleChangePage((value) => value - 1);
                },
                variant: 'outlined',
                color: 'secondary',
              },
            ]}
          />
          <Typography variant="h4">확인 - 미리보기</Typography>
          <ButtonSet
            type="custom"
            options={[
              {
                label: intl.formatMessage({ id: 'btn-next' }),
                callBack: () => {
                  handleChangePage((value) => value + 1);
                },
                variant: 'outlined',
                color: 'secondary',
              },
            ]}
          />
        </Stack>
      </GridItem>
      <GridItem>
        <MainCard
          title={
            <GridItem container directionHorizon="space-between">
              <ButtonSet
                type="custom"
                options={[
                  {
                    label: intl.formatMessage({ id: 'btn-save' }),
                    callBack: () => {
                      saveMappingData();
                    },
                    // variant: 'outlined',
                    color: 'primary',
                  },
                  {
                    label: intl.formatMessage({ id: 'btn-delete' }),
                    callBack: () => {
                      deleteMappingData();
                    },
                    // variant: 'outlined',
                    color: 'secondary',
                  },
                ]}
              />
              <ButtonSet
                type="custom"
                options={[
                  {
                    label: intl.formatMessage({ id: 'btn-view' }),
                    callBack: () => {
                      refreshMappingData();
                    },
                    variant: 'outlined',
                    color: 'secondary',
                  },
                ]}
              />
            </GridItem>
          }
        >
          <GridItem item direction="row" spacing={2}>
            <GridItem item xs>
              <MappingTable connectionSeq={connectionSeq} mappingTable={'user'} ref={userRef} />
            </GridItem>
            <GridItem item xs>
              <MappingTable connectionSeq={connectionSeq} mappingTable={'dept'} ref={deptRef} />
            </GridItem>
          </GridItem>
          <MappingResultTable connectionSeq={connectionSeq} />
        </MainCard>
      </GridItem>
    </>
  );
}

export default MappingPage;
