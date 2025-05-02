import GridItem from '@components/modules/grid/GridItem';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import { CardContent, Grid, Link, Typography, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useState,useRef } from 'react';
import dbsyncApi from '@api/system/dbsyncApi';
import MainCard from '@components/mantis/MainCard';
import { useIntl } from 'react-intl';
import HsLib from '@modules/common/HsLib';
import useInput from '@modules/hooks/useInput';
import ConnectionModal from '../../modal/system/dbsync/ConnectionModal';
import ReactTable from '@components/modules/table/ReactTable';
import ButtonSet from '@components/modules/button/ButtonSet';
import { unstable_batchedUpdates } from 'react-dom';

/**
 * ConnectionPage 정의
 *
 * 연결정보 리스트 화면
 *
 * @param {Function} setConnectionSeq 선택한 연결정보의 connectionSeq 세팅
 * @param {Function} handleChangePage 보여줄 페이지 번호 지정
 * @param {String} data 테이블 로우 정의
 *
 *
 */
const ConnectionPage = ({ setConnectionSeq, connectionSeq, handleChangePage }) => {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();

  // 실제 사용하지 않지만 ReactTable 필수 파라미터라서 생성함.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({});

  //체크된 row 리스트
  const [checkList, setCheckList] = useState([]);
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  const [modalConnectionSeq, setModalConnectionSeq] = useState(0);
  const [modalConnectionType, setModalConnectionType] = useState('');
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: dbsyncApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  //연결방식 목록 리스트값
  const [connectionList, setConnectionList] = useState([]);

  // Modal팝업 오픈여부 상태값
  const [modalOpen, setModalOpen] = useState(false);

  //선택된 연결방식의 타입
  const [connectionType, setConnectionType] = useState('DB');

  //모달호출시 '추가(insert)','수정(update)' 상태값 지정
  const [modalEditType, setModalEditType] = useState('insert');

  //연결방식 리스트 조회
  const getConnectionList = async () => {
    const result = await apiCall(dbsyncApi.getConnectionList);
    if (result.status == 200) {
      unstable_batchedUpdates(() => {
        setGridInfo((prev) => {
          return { ...prev, total: result.data.totalElements };
        });
        setConnectionList(
          result.data.map((e, index) => {
            if (e.connectionSeq == connectionSeq) {
              return { ...e, no: index, id: index, useYn: e.useYn == 'N' ? '미사용' : '사용' };
            } else {
              return { ...e, no: index, id: index, useYn: e.useYn == 'N' ? '미사용' : '사용' };
            }
          }),
        );
        setCheckList([{ id: result.data.map((e) => e.connectionSeq).indexOf(connectionSeq) }]);
      });
    }
  };

  //최초 렌더링시 초기화함수
  const init = async () => {
    // 테이블, 컬럼정보
    const gridInfo = await HsLib.getGridInfo('DbsyncConnList', dbsyncApi, openModal);
    if (gridInfo) {
      unstable_batchedUpdates(() => {
        // 컬럼정보 재구성
        makeColumns(gridInfo.columns);
        // 컬럼정보 상태값 변경
        setColumns(gridInfo.columns);
        // 테이블정보 상태값 변경
        setGridInfo((prev) => {
          return { ...prev, listInfo: gridInfo.listInfo };
        });
        // 검색조건 변경
        setParameters({ ...parameters, size: gridInfo.listInfo.size });
      });
      await getConnectionList();
    }
  };

  //커스텀cell의 Cell을 지정
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'connectionType':
          column.Cell = (props) => {
            return rerenderConnectionTypeCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };

  //'추가','수정'모달 호출
  const handleInsertUpdateButtonClick = (modalType, connectionSeq, connectionType) => {
    setModalConnectionSeq(connectionSeq);
    setModalConnectionType(connectionType);
    setModalEditType(modalType);
    setModalOpen(true);
  };

  //연동타입 cell 렌더링 함수
  const rerenderConnectionTypeCell = ({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() =>
          handleInsertUpdateButtonClick('update', original.connectionSeq, original.connectionType)
        }
      >
        {original.connectionType}
      </Link>
    );
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

  //ReactTable에서 row를 클릭할때 마다 호출되는 callback 함수 - 체크박스로 변경
  const onRowClicked = async (item, selectRow, selectAllRow) => {
    //전체 row의 선택 취소후, 현재 row만 선택되도록 함.
    selectAllRow(false);
    selectRow(item.original.id, true);

    //선택된 연동방식이 다른 페이지에서도 조회가능하게
    //connectionSeq삳태값으로 지정함
    setConnectionSeq(item.original.connectionSeq);
    //'수정'모달 호출시 연동방식 타입을 지정하기위해 상태값 지정
    setConnectionType(item.original.connectionType);
  };

  //체크박스 이벤트 핸들러
  const handleChangeCheck = (newCheck) => {
    //1개 이상 체크되면 마지막에 체크된 것만 활성화 (라디오 박스와 같은 기능)
    if (newCheck.length > 0) {
      const lastCheck = newCheck[newCheck.length - 1];

      setCheckList([lastCheck]);
      setConnectionSeq(lastCheck.connectionSeq);
      setConnectionType(lastCheck.connectionType);
    } else {
      setCheckList([]);
      setConnectionSeq('');
      setConnectionType('');
    }
  };
  return (
    <>
      <GridItem container directionHorizon="center" directionVertical="center" px={2} pb={2}>
        <Stack direction="row" sx={{ width: '300px', justifyContent: 'space-between' }}>
          <Typography variant="h4" ml={12}>
            연동방식 설정
          </Typography>
          <ButtonSet
            type="custom"
            options={[
              {
                label: intl.formatMessage({ id: 'btn-next' }),
                callBack: () => {
                  handleChangePage((value) => value + 1);
                },
                variant: 'outlined',
              },
            ]}
          />
        </Stack>
      </GridItem>
      <MainCard
        title={
          <GridItem container directionHorizon="end">
            <ButtonSet
              type="custom"
              options={[
                {
                  label: intl.formatMessage({ id: 'btn-add' }),
                  callBack: () => {
                    if (connectionList.length >= 10) {
                      openModal({
                        message: '연결정보가 10개를 초과했습니다.',
                        onConfirm: () => {},
                      });
                      return;
                    }
                    setModalEditType('insert');
                    setModalOpen(true);
                  },
                  variant: 'outlined',
                },
              ]}
            />
          </GridItem>
        }
      >
        <ReactTable
          columns={columns}
          data={connectionList}
          checkList={checkList}
          onChangeChecked={handleChangeCheck}
          setData={setConnectionList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          setParameters={setParameters}
          parameters={unControlRef}
          disableHeaderCheckbox
        />
        {modalOpen && (
          <ConnectionModal
            alertOpen={modalOpen}
            setModalOpen={setModalOpen}
            connectionSeq={modalConnectionSeq}
            refreshConnectionList={getConnectionList}
            connectionType={modalConnectionType}
            editType={modalEditType}
          />
        )}
      </MainCard>
    </>
  );
};

export default ConnectionPage;
