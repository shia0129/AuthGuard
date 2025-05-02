import GridItem from '@components/modules/grid/GridItem';
import { Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import dbsyncApi from '@api/system/dbsyncApi';
import { useEffect,useRef } from 'react';
import useInput from '@modules/hooks/useInput';
import HsLib from '@modules/common/HsLib';
import ReactTable from '@components/modules/table/ReactTable';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

//사용자 망연계 컬럼명(tbl_user_info)
const toUserColumns = [
  'user_id',
  'user_pass',
  'user_name',
  'dept_id',
  'user_position',
  'user_rank',
  'tel',
  'cell',
  'fax',
  'use_status',
  'user_type',
  'part_owner',
  'email',
  'ori_u_key',
  'apprpos',
  'dlp_approve',
  'apprpos_ex',
];

//사용자 망연계 한글 컬럼명(tbl_user_info)
const toUserColumnsDesc = [
  '아이디',
  '비밀번호',
  '이름',
  '부서아이디',
  '직책',
  '직위',
  '전화번호',
  '휴대폰번호',
  '팩스번호',
  '사용자 사용유무',
  '사용자 타입',
  '팀장 여부',
  '이메일',
  '원본 아이디',
  '반출 결재권한',
  '개인정보 결재권한',
  '반입 결재권한',
];
//부서 망연계 컬럼명(tbl_dept_info)
const toDeptColumns = ['dept_name', 'parent_dept_seq', 'ori_p_key'];

//부서 망연계 한글 컬럼명(tbl_dept_info)
const toDeptColumnsDesc = ['부서명', '상위부서 고유번호', '부서원본코드'];
//필수입력 컬럼명(사용자,부서)
const requiredColumns = [
  'user_id',
  'user_pass',
  'user_name',
  'dept_id',
  'user_rank',
  'ori_u_key',
  'dept_name',
  'parent_dept_seq',
  'ori_p_key',
];

/**
 * MappingTable 정의
 *
 * 사용자,부서 매핑정보 설정 테이블
 *
 * @param {String} connectionSeq 선택된 연결정보 seq
 * @param {String} mappingTable 매핑하는 테이블 종류 (ex) 'user', 'dept'
 * @param {ForwardedRef} ref MappingPage에서 재조회,수정,삭제 함수를 실행하기 위한 참조변수
 *
 *
 */
const MappingTable = forwardRef(function MappingTable({ connectionSeq, mappingTable }, ref) {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  //수정가능한 row의 key(mappingColumnTo)를 저장
  const [updateList, setUpdateList] = useState([]);

  //ReactTable에 전달해주기 위한 파라미터값
  //실제로 사용하지 않지만 ReactTable의 필수값이라 생성함.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({});

  //체크박스로 선택된 row를 저장하는 상태값
  const [deleteList, setDeleteList] = useState([]);
  //ReactTable에 전달해주기 위한 테이블의 cell 정보
  const [columns, setColumns] = useState([]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: dbsyncApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  //매핑정보 상태값
  const [mappingList, setMappingList] = useState(
    (mappingTable == 'user' ? toUserColumns : toDeptColumns).map((toColumnName, index) => {
      return {
        mappingSeq: '',
        mappingTableFrom: '',
        mappingTableTo: '',
        mappingColumnFrom: '',
        mappingColumnTo: toColumnName,
        columnDesc: (mappingTable == 'user' ? toUserColumnsDesc : toDeptColumnsDesc)[index],
        exceptionType: '',
        exceptionDefaultValue: '',
        deleteYn: '',
        connectionSeq: '',
      };
    }),
  );

  //고객사 테이블명
  const [fromTableName, setFromTableName] = useState('');

  //부모컴포넌트에서 조회, 저장, 삭제를 컨트롤하기 위함.
  useImperativeHandle(ref, () => ({
    //부모컴포넌트에서 사용자 매핑정보 조회를 trigger
    async refreshMappingData() {
      await getMappingData();
    },
    //부모컴포넌트에서 사용자 매핑정보를 저장을 trigger
    async saveMappingData() {
      return await insertAndUpdateMappingData();
    },
    //부모컴포넌트에서 사용자 매핑정보 삭제를 trigger
    async deleteMappingData() {
      return await deleteMappingData();
    },
  }));

  //매핑정보 조회
  const getMappingData = async () => {
    const result = await apiCall(dbsyncApi.getMappingData, {
      connectionSeq: connectionSeq,
      mappingTableTo: mappingTable == 'user' ? 'tbl_user_info' : 'tbl_dept_info',
    });
    if (result.status == 200) {
      unstable_batchedUpdates(() => {
        setDeleteList([]);

        //조회한 매핑정보로 기존 매핑정보 업데이트

        //DB에는 실제 매핑된 정보만 저장되어 있지만
        //프런트에서는 모든 망연계 컬럼값의 상태값을 저장하고 있어서
        //프런트 기준으로 DB에서 불러온 상태값을 업데이트함.
        const newMappingDataList = mappingList.map((oldObj, index) => {
          for (let newObj of result.data) {
            //DB에 저장된 매핑정보의 경우, 업데이트
            if (newObj.mappingColumnTo == oldObj.mappingColumnTo)
              return {
                id: index,
                columnDesc: oldObj.columnDesc,
                ...newObj,
              };
          }

          //DB에 매핑정보가 없는경우, 기본값만 지정
          return {
            id: index,
            mappingSeq: '',
            mappingTableFrom: fromTableName,
            mappingTableTo: mappingTable == 'user' ? 'tbl_user_info' : 'tbl_dept_info',
            mappingColumnFrom: '',
            mappingColumnTo: oldObj.mappingColumnTo,
            columnDesc: oldObj.columnDesc,
            exceptionType: '',
            exceptionDefaultValue: '',
            deleteYn: '',
            connectionSeq: connectionSeq,
          };
        });

        //불러온 매핑정보로 업데이트
        setMappingList(newMappingDataList);
        setUpdateList(newMappingDataList);
      });
    }
  };

  //고객사 사용자와 부서의 테이블명, 컬럼명 조회
  const getCustomerColumnsAndTableName = async () => {
    const result = await apiCall(dbsyncApi.getMappingData, {
      connectionSeq: connectionSeq,
      mappingTableTo: mappingTable == 'user' ? 'originalUserColumn' : 'originalDeptColumn',
    });

    const columnNames = result.data.map((e) => e.mappingColumnFrom);

    if (result.status == 200) {
      setFromTableName(result.data.length > 0 ? result.data[0].mappingTableFrom : '');
    } else {
      openModal({
        message:
          `고객사 ${
            mappingTable == 'user' ? '사용자' : '부서'
          } 테이블명, 컬럼명을 가져오는 과정에서 문제가 발생했습니다. code : ` + result.status,
        onConfirm: () => {},
      });
    }

    //고객사 컬럼명은 반환후 커스텀cell(고객사 컬럼 combobox) 생성시 사용
    return columnNames;
  };

  //매핑정보 validation 체크 함수
  const validationCheck = () => {
    if (
      mappingTable == 'user' &&
      !!updateList.find((e) => e.mappingColumnTo == 'user_id') &&
      !updateList.find((e) => e.mappingColumnTo == 'user_id').mappingColumnFrom
    ) {
      openModal({
        message: 'user_id의 고객사컬럼을 지정해주세요.',
        onConfirm: () => {},
      });
      return false;
    }

    if (
      mappingTable == 'dept' &&
      !!updateList.find((e) => e.mappingColumnTo == 'ori_p_key') &&
      !updateList.find((e) => e.mappingColumnTo == 'ori_p_key').mappingColumnFrom
    ) {
      openModal({
        message: 'ori_p_key의 고객사컬럼을 지정해주세요.',
        onConfirm: () => {},
      });
      return false;
    }

    if (
      updateList.filter((e) => e.status == 'U' && !e.mappingColumnFrom && !e.exceptionType).length >
      0
    ) {
      openModal({
        message: '고객사컬럼을 지정해주세요.',
        onConfirm: () => {},
      });
      return false;
    }

    return true;
  };

  //"컬럼 매핑정보 저장"버튼이 눌렸을때, 저장 및 업데이트 수행
  const insertAndUpdateMappingData = async () => {
    if (!validationCheck()) {
      return false;
    }

    //updateList에서
    //mappingSeq가 없지만
    //mappingColumnFrom값이 있거나 exceptionType값이 있다면 신규 매핑정보
    const newMappingDataList = updateList
      .filter((e) => !e.mappingSeq && (!!e.mappingColumnFrom || !!e.exceptionType))
      .map((e) => {
        return {
          ...e,
          mappingTableFrom: fromTableName,
          mappingTableTo: mappingTable == 'user' ? 'tbl_user_info' : 'tbl_dept_info',
          connectionSeq,
        };
      });

    //신규 매핑정보 insert
    const insertResult = await insertMappingData(newMappingDataList);

    if (!insertResult) {
      return false;
    }

    //updateList에서
    //mappingSeq가 있고
    //mappingColumnFrom값이 있거나 exceptionType값이 있다면 업데이트할 매핑정보
    const updatedMappingDataList = updateList.filter(
      (e) => e.mappingSeq && (!!e.mappingColumnFrom || !!e.exceptionType),
    );
    const updateResult = await updateMappingData(updatedMappingDataList);

    if (!updateResult) {
      return false;
    }

    //insert, update 완료후 재조회
    await getMappingData();

    return true;
  };

  //신규 매핑정보 추가
  const insertMappingData = async (newMappingDataList) => {
    const result = await apiCall(dbsyncApi.postMappingData, newMappingDataList);

    if (result.status == 200) {
      return true;
    } else {
      openModal({
        message: `신규 ${mappingTable == 'user' ? '사용자' : '부서'} 매핑정보 저장실패`,
        onConfirm: () => {},
      });
      return false;
    }
  };

  //매핑정보 삭제
  const deleteMappingData = async () => {
    const result = await apiCall(
      dbsyncApi.deleteMappingData,
      deleteList.filter((item) => item.mappingSeq).map((item) => item.mappingSeq),
    );
    if (result.status === 200) {
      return result.data;
    } else {
      openModal({
        message: `${mappingTable == 'user' ? '사용자' : '부서'} 매핑정보 삭제를 실패했습니다.`,
        onConfirm: () => {
          getMappingData();
          setDeleteList([]);
        },
      });
      return null;
    }
  };

  //기존 매핑정보 업데이트
  const updateMappingData = async (updatedMappingDataList) => {
    const result = await apiCall(dbsyncApi.putMappingData, updatedMappingDataList);

    if (result.status == 200) {
      return true;
    } else {
      openModal({
        message: `${mappingTable == 'user' ? '사용자' : '부서'} 매핑정보 업데이트 실패`,
        onConfirm: () => {},
      });
      return false;
    }
  };

  // cell customizing
  const makeColumns = (columns, columnNames) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'mappingColumnFrom':
          column.valueOptions = columnNames.map((e) => {
            return { value: e, label: e };
          });
          break;
        case 'mappingColumnTo':
          column.Cell = (props) => {
            return rerenderMappingColumnToCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });

    setColumns(gridColumns);
  };

  const rerenderMappingColumnToCell = ({ row: { original } }) => {
    return (
      <Stack direction="row" justifyContent={'center'}>
        {requiredColumns.includes(original.mappingColumnTo) && (
          <Typography sx={{ color: 'red', m: 0.4 }}>{'*'}</Typography>
        )}
        <Typography>{original.mappingColumnTo}</Typography>
      </Stack>
    );
  };

  //최초 렌더링시 초기화 함수
  const init = async () => {
    //원본컬럼 리스트 조회, 커스텀cell에서 사용하기 위해 반환
    const columnNames = await getCustomerColumnsAndTableName();

    const gridInfo = await HsLib.getGridInfo('DbsyncMapping', dbsyncApi);

    unstable_batchedUpdates(() => {
      makeColumns(gridInfo.columns, columnNames);

      setColumns(gridInfo.columns);
      setGridInfo((prev) => {
        return { ...prev, listInfo: gridInfo.listInfo };
      });
      setParameters({ ...parameters, size: gridInfo.listInfo.size });
    });
    //사용자 매핑정보 조회
    await getMappingData();

    console.log(mappingList);
  };
  const useEffect_0001 = useRef(false);
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
    <GridItem container divideColumn={1}>
      <Typography variant="h5" ml={1}>
        {mappingTable == 'user' ? (
          <Stack direction="row">
            사용자 정보 (<Typography sx={{ color: 'red', m: 0.3 }}>{' *'}</Typography>필수 컬럼은
            반드시 지정되어야 합니다. )
          </Stack>
        ) : (
          <Stack direction="row">
            부서 정보 (<Typography sx={{ color: 'red', m: 0.3 }}>{' *'}</Typography>필수 컬럼은
            반드시 지정되어야 합니다. )
          </Stack>
        )}
      </Typography>

      <ReactTable
        columns={columns}
        data={mappingList}
        checkList={deleteList}
        onChangeChecked={setDeleteList}
        setData={setMappingList}
        setUpdateData={setUpdateList}
        gridInfo={gridInfo}
        setGridInfo={setGridInfo}
        parameters={unControlRef}
        setParameters={setParameters}
      />
    </GridItem>
  );
});

export default MappingTable;
