// libraries
import { useState, useEffect,useRef } from 'react';
import { useIntl } from 'react-intl';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import dbsyncApi from '@api/system/dbsyncApi';
import { Button, List, ListItem, ListItemText, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback } from 'react';
import LoadingButton from '@components/modules/button/LoadingButton';
import { RssFeed } from '@mui/icons-material';
import MainCard from '@components/mantis/MainCard';
import { unstable_batchedUpdates } from 'react-dom';
import * as CryptoJS from 'crypto-js';

/**
 * ConnectionModal 정의
 *
 * 연동정보를 추가,수정을 하는 모달
 *
 * @param {Boolean} alertOpen 모달 호출 여부
 * @param {Function} setModalOpen 모달 호출 상태값 지정 함수
 * @param {String} connectionSeq 연결정보 변경시 조회, 수정에 사용
 * @param {Function} refreshConnectionList 연결정보 리스트 재조회
 * @param {String} connectionType 연결정보 타입 (ex) 'DB', 'LDAP', 'FILE'
 * @param {String} editType '추가','수정' 모달상태 (ex) 'insert', 'update'
 *
 */
function ConnectionModal({
  alertOpen,
  setModalOpen,
  connectionSeq,
  refreshConnectionList,
  connectionType,
  editType,
}) {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();

  //최초 데이터 로딩중을 표시하기 위한 상태값
  const [isLoading, setIsLoading] = useState(true);
  //연결정보 검증 결과를 저장하는 상태값
  const [connectionStatus, setConnectionStatus] = useState([]);
  //연결정보 검증중을 표시하기 위한 상태값
  const [isTesting, setIsTesting] = useState(false);
  //검증 통과여부를 지정하기 위한 상태값
  const [testPassed, setTestPassed] = useState(false);

  const theme = useTheme();

  //모달의 폼 데이터
  const [formData, setFormData] = useState({
    connectionType: 'DB',
    connectionSeq: '',
    connectionName: '',
    //DB
    databaseType: 'MARIADB',
    databaseAddress: '127.0.0.1',
    databasePort: '',
    databaseName: '',
    databaseUser: '',
    databasePassword: '',
    //LDAP
    ldapType: 'LDAP',
    ldapAddress: '',
    ldapPort: '',
    ldapBasedn: '',
    ldapGroupBasedn: '',
    ldapUser: '',
    ldapPassword: '',
    //고객사DB 컬럼정보
    userTableName: '',
    userColumns: [],
    deptTableName: '',
    deptColumns: [],
    //LDAP Attribute 정보
    userAttributes: [],
    deptAttributes: [],
    //연결정보 사용 여부
    useYn: 'N',
  });

  //전달된 header값에서 filename추출
  const extractFileName = useCallback((headerContent) => {
    //정규표현식으로 filename 추출
    const regex = /filename="([^"]+)"/;
    const match = headerContent.match(regex);

    return match ? match[1] : 'columnInfo.txt';
  }, []);

  //추가인 경우, 기본 입력 폼을 전달
  //수정인 경우, 테이블명|컬럼1,컬럼2,... 전달
  const handleFileDownload = async (mappingTableTo) => {
    const result = await apiCall(dbsyncApi.getMappingFile, {
      connectionSeq: editType == 'update' ? connectionSeq : '0',
      mappingTableTo,
    });

    let _blob = new Blob([result.data]);
    const downloadUrl = window.URL.createObjectURL(_blob);

    const anchorElement = document.createElement('a');
    document.body.appendChild(anchorElement);
    // anchorElement.download = extractFileName(result.headers['content-disposition']);
    anchorElement.download =
      mappingTableTo == 'originalUserColumn' ? '사용자테이블.txt' : '부서테이블.txt';
    anchorElement.href = downloadUrl;

    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(downloadUrl);
  };

  //연결정보 업데이트 함수
  //연결정보 업데이트 버튼 클릭시 호출
  const updateConnection = async () => {
    switch (formData.connectionType) {
      case 'DB':
        updateDbConnection();
        break;
      case 'LDAP':
        updateLdapConnection();
        break;
      case 'FILE':
        insertFileConnection();
        break;
      default:
        break;
    }
  };

  //연결정보 사용여부 업데이트 함수
  const updateUseYn = async (connectionSeq, useYn, connectionName) => {
    const result = await apiCall(dbsyncApi.putConnectionInfo, {
      connectionSeq: connectionSeq,
      useYn: useYn,
      connectionName: connectionName,
    });

    if (result.status != 200) {
      openModal({
        message: '사용여부 수정에 실패했습니다.',
        onConfirm: () => {},
      });
    }
    return result;
  };

  //원본컬럼 업데이트 함수
  const updateOriginalColumns = async (
    connectionSeq,
    userTableName,
    userColumns,
    deptTableName,
    deptColumns,
  ) => {
    //원본 컬럼 수정
    const result = await apiCall(dbsyncApi.postMappingData, [
      ...userColumns.map((e) => {
        return {
          mappingTableFrom: userTableName,
          mappingTableTo: 'originalUserColumn',
          mappingColumnFrom: e,
          mappingColumnTo: '',
          exceptionType: '',
          exceptionDefaultValue: '',
          connectionSeq: connectionSeq,
        };
      }),
      ...deptColumns.map((e) => {
        return {
          mappingTableFrom: deptTableName,
          mappingTableTo: 'originalDeptColumn',
          mappingColumnFrom: e,
          mappingColumnTo: '',
          exceptionType: '',
          exceptionDefaultValue: '',
          connectionSeq: connectionSeq,
        };
      }),
    ]);

    if (result.status != 200) {
      openModal({
        message: '원본컬럼 수정에 실패했습니다.',
        onConfirm: () => {},
      });
    }

    return result;
  };

  //DB연결정보 업데이트 함수
  const updateDbConnection = async () => {
    if (!dbFormValidationCheck()) {
      return;
    }
    //DB연결정보 수정
    let result = await apiCall(dbsyncApi.putDbConnection, {
      connectionSeq: connectionSeq,
      databaseType: formData.databaseType,
      databaseAddress: formData.databaseAddress,
      databasePort: formData.databasePort,
      databaseName: formData.databaseName,
      databaseUser: formData.databaseUser,
      databasePassword: formData.databasePassword,
      connectionName: formData.connectionName,
      userTableName: formData.userTableName,
      deptTableName: formData.deptTableName,
    });

    if (result.status != 200) {
      openModal({
        message: 'DB연결정보 수정에 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    }

    //원본 컬럼 수정
    result = await updateOriginalColumns(
      connectionSeq,
      formData.userTableName,
      formData.userColumns,
      formData.deptTableName,
      formData.deptColumns,
    );

    if (result.status != 200) {
      return;
    }

    result = await updateUseYn(connectionSeq, formData.useYn, formData.connectionName);

    if (result.status != 200) {
      return;
    }

    openModal({
      message: '연결정보 수정이 완료되었습니다.',
      onConfirm: () => {
        refreshConnectionList();
        setModalOpen(false);
      },
    });
  };

  //LDAP연결정보 업데이트 함수
  const updateLdapConnection = async () => {
    if (!ldapFormValidationCheck()) {
      return;
    }

    //LDAP연결정보 업데이트
    let result = await apiCall(dbsyncApi.putLdapConnection, {
      connectionSeq: connectionSeq,
      ldapType: formData.ldapType,
      ldapAddress: formData.ldapAddress,
      ldapPort: formData.ldapPort,
      ldapBasedn: formData.ldapBasedn,
      ldapGroupBasedn: formData.ldapGroupBasedn,
      ldapUser: formData.ldapUser,
      ldapPassword: formData.ldapPassword,
      userIdColumn: formData.userAttributes[0],
      deptIdColumn: formData.deptAttributes[0],
    });

    if (result.status != 200) {
      openModal({
        message: 'LDAP연결정보 수정에 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    }

    //원본 컬럼 수정
    result = await updateOriginalColumns(
      connectionSeq,
      formData.ldapBasedn,
      formData.userAttributes,
      formData.ldapGroupBasedn,
      formData.deptAttributes,
    );

    if (result.status != 200) {
      return;
    }

    result = await updateUseYn(connectionSeq, formData.useYn);

    if (result.status != 200) {
      return;
    }

    openModal({
      message: '연결정보 수정이 완료되었습니다.',
      onConfirm: () => {
        refreshConnectionList();
        setModalOpen(false);
      },
    });
  };

  //연결정보 삭제 함수
  const deleteConnection = async (connectionSeq) => {
    const result = await apiCall(dbsyncApi.deleteConnection, { connectionSeq });

    if (result.status == 200) {
      openModal({
        message: '선택한 연결정보를 삭제했습니다.',
        onConfirm: () => {},
      });
      refreshConnectionList();
      setModalOpen(false);
    } else {
      openModal({
        message: '연결정보를 삭제에 실패했습니다.',
        onConfirm: () => {},
      });
    }
  };

  //DB연결정보 조회 함수
  //'수정' 모달에서 DB연결정보 불러옴.
  const getDbConnectionInfo = async (connectionSeq) => {
    setIsLoading(true);
    //팝업호출시 연결정보를 가져오는데 너무 오래걸려 비동기적으로 호출
    const [dbConnInfo, userColumnInfo, deptColumnInfo, connectionListInfo] = await Promise.all([
      //DB연결정보
      apiCall(dbsyncApi.getDbConnection, { connectionSeq }),
      //사용자테이블 원본컬럼
      apiCall(dbsyncApi.getMappingData, {
        connectionSeq,
        mappingTableTo: 'originalUserColumn',
      }),
      //부서테이블 원본컬럼
      apiCall(dbsyncApi.getMappingData, {
        connectionSeq,
        mappingTableTo: 'originalDeptColumn',
      }),
      //사용여부를 가져오기위해 연결리스트 호출
      apiCall(dbsyncApi.getConnectionList),
    ]);

    //현재 연결정보의 useYn값을 가져오기 위해서
    //연결정보리스트에서 현재 연결정보 추출
    const connectionInfo = connectionListInfo.data.find((e) => e.connectionSeq == connectionSeq);

    //데이터를 가져오는 과정에서 문제 발생시 팝업 호출
    if (dbConnInfo.status != 200) {
      openModal({
        message: 'DB연결정보를 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    } else if (userColumnInfo.status != 200) {
      openModal({
        message: '기존 사용자 컬럼을 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    } else if (deptColumnInfo.status != 200) {
      openModal({
        message: '기존 부서 컬럼을 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    } else if (connectionListInfo.status != 200 || !connectionInfo) {
      openModal({
        message: '연결정보 사용유무 정보를 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    } else {
      setTestPassed(true);
    }

    //가져온 데이터를 전부 현재 폼 데이터로 업데이트
    setFormData((prev) => {
      return {
        ...prev,
        ...dbConnInfo.data,
        userColumns: userColumnInfo.data.map((e) => e.mappingColumnFrom),
        userTableName:
          userColumnInfo.data.length > 0 ? userColumnInfo.data[0].mappingTableFrom : '',

        deptColumns: deptColumnInfo.data.map((e) => e.mappingColumnFrom),
        deptTableName:
          deptColumnInfo.data.length > 0 ? deptColumnInfo.data[0].mappingTableFrom : '',
        useYn: connectionInfo.useYn,
        connectionName: connectionInfo.connectionName,
      };
    });
    setIsLoading(false);
  };

  //LDAP 연결정보 조회 함수
  //'수정' 모달인 경우 LDAP 연결정보 조회
  const getLdapConnectionInfo = async (connectionSeq) => {
    setIsLoading(true);
    //팝업호출시 연결정보를 가져오는데 너무 오래걸려 비동기적으로 호출
    const [ldapConnInfo, userAttributes, deptAttributes, connectionListInfo] = await Promise.all([
      //DB연결정보
      apiCall(dbsyncApi.getLdapConnection, { connectionSeq }),
      //사용자테이블 원본컬럼
      apiCall(dbsyncApi.getMappingData, {
        connectionSeq,
        mappingTableTo: 'originalUserColumn',
      }),
      //부서테이블 원본컬럼
      apiCall(dbsyncApi.getMappingData, {
        connectionSeq,
        mappingTableTo: 'originalDeptColumn',
      }),
      //사용여부를 가져오기위해 연결리스트 호출
      apiCall(dbsyncApi.getConnectionList),
    ]);

    //현재 연결정보의 useYn을 가져오기 위해서
    //연결정보리스트에서 현재 연결정보 추출
    const connectionInfo = connectionListInfo.data.find((e) => e.connectionSeq == connectionSeq);

    if (ldapConnInfo.status != 200) {
      openModal({
        message: 'LDAP연결정보를 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    } else if (userAttributes.status != 200) {
      openModal({
        message: '기존 사용자 attributes를 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    } else if (deptAttributes.status != 200) {
      openModal({
        message: '기존 부서 attributes를 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    } else if (connectionListInfo.status != 200 || !connectionInfo) {
      openModal({
        message: '연결정보 사용유무 정보를 가져오는데 실패했습니다.',
        onConfirm: () => {},
      });
      return;
    }

    //가져온 데이터를 전부 현재 폼 데이터로 업데이트
    setFormData((prev) => {
      return {
        ...prev,
        ...ldapConnInfo.data,
        userAttributes: userAttributes.data.map((e) => e.mappingColumnFrom),
        deptAttributes: deptAttributes.data.map((e) => e.mappingColumnFrom),
        ldapBasedn: userAttributes.data.length > 0 ? userAttributes.data[0].mappingTableFrom : '',
        ldapGroupBasedn:
          deptAttributes.data.length > 0 ? deptAttributes.data[0].mappingTableFrom : '',
        useYn: connectionInfo.useYn,
      };
    });
    setIsLoading(false);
  };

  //연결정보를 추가하는 함수
  //'추가' 모달에서 확인 버튼 클릭시 호출
  const insertConnection = async () => {
    switch (formData.connectionType) {
      case 'DB':
        insertDbConnection();
        break;
      case 'LDAP':
        insertLdapConnection();
        break;
      case 'FILE':
        insertFileConnection();
        break;
      default:
        break;
    }
  };

  //FILE연결정보를 추가하는 함수
  const insertFileConnection = async () => {
    console.log('insert file formData : ', formData);
    openModal({
      message: '파일 연결을 추가했습니다.',
      onConfirm: () => {
        setModalOpen(false);
      },
    });
  };

  //LDAP연결정보를 추가하는 함수
  const insertLdapConnection = async () => {
    //입력된 LDAP연결정보 validation 체크
    if (!ldapFormValidationCheck()) {
      return;
    }

    //신규 공통 연결방식 추가
    let result = await apiCall(dbsyncApi.postConnection, {
      connectionType: formData.connectionType,
      protocol: formData.ldapType,
      hostInfo: formData.ldapAddress,
      useYn: 'N',
    });

    if (result.status != 200) {
      openModal({
        message: '신규 연결방식 추가에 실패하였습니다.',
        onConfirm: () => {},
      });
      return;
    }

    //js에서 Long타입을 가져올때 반올림 되는 경우가 있어서
    //BigInt로 가져온 후 String 변환
    const connectionSeq = BigInt(result.data).toString();

    //신규 LDAP연결방식 추가
    result = await apiCall(dbsyncApi.postLdapConnection, {
      connectionSeq: connectionSeq,
      ldapType: formData.ldapType,
      ldapAddress: formData.ldapAddress,
      ldapPort: formData.ldapPort,
      ldapBasedn: formData.ldapBasedn,
      ldapGroupBasedn: formData.ldapGroupBasedn,
      ldapUser: formData.ldapUser,
      ldapPassword: formData.ldapPassword,
      userIdColumn: formData.userAttributes[0],
      deptIdColumn: formData.deptAttributes[0],
    });

    if (result.status != 200) {
      openModal({
        message: '신규 LDAP연결방식 추가에 실패하였습니다.',
        onConfirm: () => {},
      });
      return;
    }

    //원본 컬럼 추가
    result = await apiCall(dbsyncApi.postMappingData, [
      ...formData.userAttributes.map((e) => {
        return {
          mappingTableFrom: formData.ldapBasedn,
          mappingTableTo: 'originalUserColumn',
          mappingColumnFrom: e,
          mappingColumnTo: '',
          exceptionType: '',
          exceptionDefaultValue: '',
          connectionSeq: connectionSeq,
        };
      }),
      ...formData.deptAttributes.map((e) => {
        return {
          mappingTableFrom: formData.ldapGroupBasedn,
          mappingTableTo: 'originalDeptColumn',
          mappingColumnFrom: e,
          mappingColumnTo: '',
          exceptionType: '',
          exceptionDefaultValue: '',
          connectionSeq: connectionSeq,
        };
      }),
    ]);

    if (result.status != 200) {
      openModal({
        message: '원본컬럼 추가에 실패하였습니다.',
        onConfirm: () => {},
      });
      return;
    } else {
      openModal({
        message: '신규 연결방식 추가했습니다.',
        onConfirm: () => {
          refreshConnectionList();
          setModalOpen(false);
        },
      });
    }
  };

  //신규 DB연결방식 추가
  const insertDbConnection = async () => {
    //DB입력폼의 validation 체크
    if (!dbFormValidationCheck()) {
      return;
    }

    //신규 공통 연결방식 추가
    let result = await apiCall(dbsyncApi.postConnection, {
      connectionType: formData.connectionType,
      protocol: formData.databaseType,
      hostInfo: formData.databaseAddress,
      connectionName: formData.connectionName,
      useYn: 'N',
    });

    if (result.status != 200) {
      openModal({
        message: '신규 연결방식 추가에 실패하였습니다.',
        onConfirm: () => {},
      });
      return;
    }

    const connectionSeq = BigInt(result.data).toString();

    //신규 DB연결방식 추가
    result = await apiCall(dbsyncApi.postDbConnection, {
      connectionSeq: connectionSeq,
      databaseType: formData.databaseType,
      databaseAddress: formData.databaseAddress,
      databasePort: formData.databasePort,
      databaseName: formData.databaseName,
      databaseUser: formData.databaseUser,
      databasePassword: formData.databasePassword,
      connectionName: formData.connectionName,
      userTable: formData.userTableName,
      deptTable: formData.deptTableName,
    });

    if (result.status != 200) {
      openModal({
        message: '신규 DB연결방식 추가에 실패하였습니다.',
        onConfirm: () => {},
      });
      return;
    }

    //원본 컬럼 추가
    result = await apiCall(dbsyncApi.postMappingData, [
      ...formData.userColumns.map((e) => {
        return {
          mappingTableFrom: formData.userTableName,
          mappingTableTo: 'originalUserColumn',
          mappingColumnFrom: e,
          mappingColumnTo: '',
          exceptionType: '',
          exceptionDefaultValue: '',
          connectionSeq: connectionSeq,
        };
      }),
      ...formData.deptColumns.map((e) => {
        return {
          mappingTableFrom: formData.deptTableName,
          mappingTableTo: 'originalDeptColumn',
          mappingColumnFrom: e,
          mappingColumnTo: '',
          exceptionType: '',
          exceptionDefaultValue: '',
          connectionSeq: connectionSeq,
        };
      }),
    ]);

    if (result.status != 200) {
      openModal({
        message: '원본컬럼 추가에 실패하였습니다.',
        onConfirm: () => {},
      });
      return;
    } else {
      openModal({
        message: '신규 연결방식 추가했습니다.',
        onConfirm: () => {
          refreshConnectionList();
          setModalOpen(false);
        },
      });
    }
  };

  //최초 렌더링 시, 초기화 함수
  const init = async () => {
    //'수정' 모달인 경우, 연결정보 조회하여 입력폼을 초기화
    if (editType == 'update') {
      setFormData((prev) => {
        return { ...prev, connectionType: connectionType };
      });

      switch (connectionType) {
        case 'DB':
          getDbConnectionInfo(connectionSeq);
          break;
        case 'LDAP':
          getLdapConnectionInfo(connectionSeq);
          break;
        default:
          break;
      }
    }
  };

  //연결정보 검증 함수
  //연결정보 검증 버튼 클릭시 호출
  const handleTestResult = () => {
    if (editType == 'update' && !connectionSeq) {
      openModal({
        message: '연결정보를 선택해주세요.',
        onConfirm: () => {},
      });
      return;
    }
    switch (formData.connectionType) {
      case 'DB':
        testDbConnection();
        break;
      case 'LDAP':
        testLdapConnection();
        break;
      default:
        break;
    }
  };

  //LDAP 연결정보 검증함수
  const testLdapConnection = async () => {
    //입력된 LDAP 연결정보 validation 체크
    if (!ldapFormValidationCheck()) {
      return;
    }

    setIsTesting(true);

    //연결정보 검증
    const testResult = await apiCall(dbsyncApi.postCheckLdapConnection, {
      ldapType: formData.ldapType,
      ldapAddress: formData.ldapAddress,
      ldapPort: formData.ldapPort,
      ldapBasedn: formData.ldapBasedn,
      ldapGroupBasedn: formData.ldapGroupBasedn,
      ldapUser: formData.ldapUser,
      ldapPassword: formData.ldapPassword,
      userIdColumn: formData.userAttributes[0],
      deptIdColumn: formData.deptAttributes[0],
    });

    //렌더링을 최적화하기위해서 unstable_batchedUpdates함수로 묶음
    unstable_batchedUpdates(() => {
      setIsTesting(false);
      setConnectionStatus((prev) => [{ ...testResult.data, status: testResult.status }, ...prev]);
    });

    // 정상 결과
    if (testResult.status == 200) {
      openModal({
        message: '검증결과 성공하였습니다.',
        onConfirm: () => {},
      });
      setTestPassed(true);
    }
    //문제가 발생한 경우
    else {
      openModal({
        message: '검증결과 실패하였습니다.',
        onConfirm: () => {},
      });
      setTestPassed(false);
    }
  };

  //DB연결정보 validation 체크 함수
  const dbFormValidationCheck = () => {
    if (
      !formData.connectionType ||
      !formData.databaseAddress ||
      !formData.databasePort ||
      !formData.databaseName ||
      !formData.databaseUser ||
      !formData.databasePassword
    ) {
      openModal({
        message: '연결정보를 입력해주세요.',
        onConfirm: () => {},
      });
      return false;
    }
    //사용자 컬럼정보 업로드 여부 확인
    if (formData.userColumns.length <= 0 || formData.userTableName.length <= 0) {
      openModal({
        message: '사용자 파일 업로드를 확인해주세요.',
        onConfirm: () => {},
      });
      return false;
    }

    //부서 컬럼정보 업로드 여부 확인
    if (formData.deptColumns.length <= 0 || formData.deptTableName.length <= 0) {
      openModal({
        message: '부서 파일 업로드를 확인해주세요.',
        onConfirm: () => {},
      });
      return false;
    }

    return true;
  };

  //LDAP 연결정보 validation 체크 함수
  const ldapFormValidationCheck = () => {
    if (
      !formData.connectionType ||
      !formData.ldapType ||
      !formData.ldapAddress ||
      !formData.ldapPort ||
      !formData.ldapUser ||
      !formData.ldapPassword
    ) {
      openModal({
        message: '연결정보를 입력해주세요.',
        onConfirm: () => {},
      });
      return false;
    }
    //사용자 attr정보 업로드 여부 확인
    if (formData.userAttributes.length <= 0 || !formData.ldapBasedn) {
      openModal({
        message: '사용자 파일 업로드를 확인해주세요.',
        onConfirm: () => {},
      });
      return false;
    }

    //부서 attr정보 업로드 여부 확인
    if (formData.deptAttributes.length <= 0 || !formData.ldapGroupBasedn) {
      openModal({
        message: '부서 파일 업로드를 확인해주세요.',
        onConfirm: () => {},
      });
      return false;
    }

    return true;
  };

  //DB연결정보 검증 함수
  const testDbConnection = async () => {
    //입력된 DB연결정보 validation 체크
    if (!dbFormValidationCheck()) {
      return;
    }

    setIsTesting(true);

    //DB연결정보 검증
    const testResult = await apiCall(dbsyncApi.postCheckDbConnection, {
      connectionSeq: editType == 'update' ? connectionSeq : '0',
      databaseType: formData.databaseType,
      databaseAddress: formData.databaseAddress,
      databasePort: formData.databasePort,
      databaseName: formData.databaseName,
      databaseUser: formData.databaseUser,
      databasePassword: formData.databasePassword,
      userTable: formData.userTableName,
      deptTable: formData.deptTableName,
    });

    unstable_batchedUpdates(() => {
      setIsTesting(false);
      setConnectionStatus((prev) => [{ ...testResult.data, status: testResult.status }, ...prev]);
    });

    // 정상 결과
    if (testResult.status == 200) {
      openModal({
        message: '검증결과 성공하였습니다.',
        onConfirm: () => {},
      });
      setTestPassed(true);
    }
    //문제가 발생한 경우
    else {
      openModal({
        message: '검증결과 실패하였습니다.',
        onConfirm: () => {},
      });
      setTestPassed(false);
    }
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
    <PopUp
      maxWidth="sm"
      fullWidth
      callBack={editType == 'update' ? updateConnection : insertConnection}
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      disableConfirm={!testPassed}
      confirmLabel={editType == 'update' ? '수정' : '저장'}
      title={editType == 'update' ? '연결정보 수정' : '연결정보 추가'}
      actionComponent={
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <LoadingButton
            variant="outlined"
            loadingPosition="start"
            loading={isTesting}
            startIcon={<RssFeed />}
            onClick={() => handleTestResult()}
          >
            접속정보 확인
          </LoadingButton>
          {editType == 'update' && (
            <Button
              onClick={() => {
                openModal({
                  message: `연결정보를 삭제하시겠습니까?`,
                  onConfirm: () => deleteConnection(connectionSeq),
                });
              }}
              color={'error'}
              variant={'contained'}
            >
              {'삭제'}
            </Button>
          )}
        </Stack>
      }
    >
      <GridItem>
        {editType == 'update' && isLoading && (
          <LoadingButton variant="outlined" loadingPosition="start" loading startIcon={<RssFeed />}>
            {'   접속정보 로딩중...'}
          </LoadingButton>
        )}
        <GridItem
          container
          direction="row"
          divideColumn={1}
          borderFlag
          sx={{
            '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
            '.inputBox': {
              maxWidth: '310px',
              minWidth: '310px',
            },
          }}
        >
          <LabelInput
            type="text"
            required
            label="식별이름"
            labelSx={{ textAlign: 'left' }}
            name="connectionName"
            value={formData.connectionName}
            onChange={(event) => {
              setFormData((state) => {
                return { ...state, connectionName: event.target.value };
              });
            }}
            labelBackgroundFlag
          />
          <LabelInput
            required
            disabled={editType == 'update'}
            type="select"
            label={intl.formatMessage({ id: 'dbsync-connection-type' })}
            name="connectionType"
            list={[
              { value: 'DB', label: 'DB' },
              { value: 'LDAP', label: 'LDAP' },
              { value: 'FILE', label: 'FILE' },
            ]}
            labelBackgroundFlag
            value={formData.connectionType}
            onChange={(event) => {
              setFormData((prev) => {
                return { ...prev, connectionType: event.target.value };
              });
            }}
          />
          {formData.connectionType == 'DB' && (
            <LabelInput
              type="select"
              required
              label="DB TYPE"
              name="databaseType"
              value={formData.databaseType}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, databaseType: event.target.value };
                });
              }}
              list={[
                { value: 'ORACLE', label: 'Oracle' },
                { value: 'MYSQL', label: 'MySQL' },
                { value: 'MSSQL', label: 'MSSQL' },
                { value: 'POSTGRESQL', label: 'PostgreSQL' },
                { value: 'MARIADB', label: 'MariaDB' },
                { value: 'TIBERO', label: 'tibero' },
                { value: 'CUBRID', label: 'CUBRID' },
              ]}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'DB' && (
            <LabelInput
              type="text"
              required
              label="HOST"
              labelSx={{ textAlign: 'left' }}
              name="databaseAddress"
              value={formData.databaseAddress}
              placeholder={'127.0.0.1'}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, databaseAddress: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'DB' && (
            <LabelInput
              type="text"
              required
              label="PORT"
              labelSx={{ textAlign: 'left' }}
              name="databasePort"
              onlyNumber
              value={formData.databasePort}
              placeholder={'5432'}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, databasePort: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'DB' && (
            <LabelInput
              type="text"
              required
              label="DB NAME"
              labelSx={{ textAlign: 'left' }}
              name="databaseName"
              value={formData.databaseName}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, databaseName: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'DB' && (
            <LabelInput
              type="text"
              required
              label="ID"
              labelSx={{ textAlign: 'left' }}
              name="databaseUser"
              value={formData.databaseUser}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, databaseUser: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'DB' && (
            <LabelInput
              type="text"
              required
              label="PASSWORD"
              htmlType="password"
              labelSx={{ textAlign: 'left' }}
              name="databasePassword"
              value={formData.databasePassword}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, databasePassword: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'DB' && (
            <Stack sx={{ height: '100%' }} direction={'row'} alignItems={'center'} spacing={1.5}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '42px',
                  padding: '0 15px',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  backgroundColor: theme.palette.grey[50],
                  borderRight: '1px solid',
                  borderColor: theme.palette.grey[300],
                }}
                className={'text inputText req'}
                dangerouslySetInnerHTML={{ __html: '사용자 테이블 정보' }}
              />

              <Stack direction="row" spacing={2}>
                <Button component="label" variant="contained">
                  파일 업로드
                  <input
                    type="file"
                    name="userColumnFile"
                    hidden
                    onChange={(e) => {
                      let file = e.target.files[0];
                      let fileReader = new FileReader();
                      fileReader.onload = () => {
                        if (fileReader.result.split('|').length < 2) {
                          openModal({
                            message: '데이터 포맷이 맞지 않습니다. (ex) 테이블이름|컬럼1,컬럼2,...',
                            onConfirm: () => {},
                          });
                          return;
                        }
                        const userTableName = fileReader.result.split('|')[0];
                        const userColumnList = fileReader.result.split('|')[1].split(',');
                        setFormData((state) => {
                          return {
                            ...state,
                            userTableName: userTableName,
                            userColumns: userColumnList,
                          };
                        });
                        setTestPassed(false);
                      };
                      if (file != undefined) fileReader.readAsText(file);
                    }}
                  />
                </Button>

                <Button
                  component="label"
                  variant="contained"
                  onClick={() => handleFileDownload('originalUserColumn')}
                >
                  {editType == 'update' ? '기존 컬럼 다운로드' : '서식 다운로드'}
                </Button>
              </Stack>
            </Stack>
          )}

          {formData.connectionType == 'DB' && (
            <Stack sx={{ height: '100%' }} direction={'row'} alignItems={'center'} spacing={1.5}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '42px',
                  padding: '0 15px',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  backgroundColor: theme.palette.grey[50],
                  borderRight: '1px solid',
                  borderColor: theme.palette.grey[300],
                }}
                className={'text inputText req'}
                dangerouslySetInnerHTML={{ __html: '부서 테이블 정보' }}
              />

              <Stack direction="row" spacing={2}>
                <Button component="label" variant="contained">
                  파일 업로드
                  <input
                    type="file"
                    name="deptColumnFile"
                    hidden
                    onChange={(e) => {
                      let file = e.target.files[0];
                      let fileReader = new FileReader();
                      fileReader.onload = () => {
                        if (fileReader.result.split('|').length < 2) {
                          openModal({
                            message: '데이터 포맷이 맞지 않습니다. (ex) 테이블이름|컬럼1,컬럼2,...',
                            onConfirm: () => {},
                          });
                          return;
                        }
                        const deptTableName = fileReader.result.split('|')[0];
                        const deptColumnList = fileReader.result.split('|')[1].split(',');
                        setFormData((state) => {
                          return {
                            ...state,
                            deptTableName: deptTableName,
                            deptColumns: deptColumnList,
                          };
                        });
                        setTestPassed(false);
                      };
                      if (file != undefined) fileReader.readAsText(file);
                    }}
                  />
                </Button>

                <Button
                  component="label"
                  variant="contained"
                  onClick={() => handleFileDownload('originalDeptColumn')}
                >
                  {editType == 'update' ? '기존 컬럼 다운로드' : '서식 다운로드'}
                </Button>
              </Stack>
            </Stack>
          )}

          {formData.connectionType == 'LDAP' && (
            <LabelInput
              type="select"
              required
              label="LDAP TYPE"
              name="ldapType"
              value={formData.ldapType}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, ldapType: event.target.value };
                });
              }}
              list={[
                { value: 'LDAP', label: 'LDAP' },
                { value: 'LDAPS', label: 'LDAPS' },
              ]}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'LDAP' && (
            <LabelInput
              type="text"
              required
              label="HOST"
              name="ldapAddress"
              value={formData.ldapAddress}
              placeholder={'127.0.0.1'}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, ldapAddress: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'LDAP' && (
            <LabelInput
              type="text"
              required
              label="PORT"
              name="ldapPort"
              onlyNumber
              value={formData.ldapPort}
              placeholder={'5432'}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, ldapPort: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'LDAP' && (
            <LabelInput
              type="text"
              required
              label="ID"
              name="ldapUser"
              value={formData.ldapUser}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, ldapUser: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'LDAP' && (
            <LabelInput
              type="text"
              required
              label="PASSWORD"
              htmlType="password"
              name="ldapPassword"
              value={formData.ldapPassword}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, ldapPassword: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}

          {formData.connectionType == 'LDAP' && (
            <Stack sx={{ height: '100%' }} direction={'row'} alignItems={'center'} spacing={1.5}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '42px',
                  padding: '0 15px',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  backgroundColor: theme.palette.grey[50],
                  borderRight: '1px solid',
                  borderColor: theme.palette.grey[300],
                }}
                className={'text inputText req'}
                dangerouslySetInnerHTML={{ __html: '사용자 Attribute 정보' }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  component="label"
                  variant="contained"
                  color={formData.userAttributes.length > 0 ? 'success' : 'primary'}
                >
                  파일 업로드
                  <input
                    type="file"
                    name="userAttributesFile"
                    hidden
                    onChange={(e) => {
                      let file = e.target.files[0];
                      let fileReader = new FileReader();
                      fileReader.onload = () => {
                        if (fileReader.result.split('|').length < 2) {
                          openModal({
                            message: '데이터 포맷이 맞지 않습니다. (ex) basedn|attr1,attr2,...',
                            onConfirm: () => {},
                          });
                          return;
                        }
                        const basedn = fileReader.result.split('|')[0];
                        const userAttributes = fileReader.result.split('|')[1].split(',');
                        setFormData((state) => {
                          return {
                            ...state,
                            ldapBasedn: basedn,
                            userAttributes: userAttributes,
                          };
                        });
                        setTestPassed(false);
                      };
                      if (file != undefined) fileReader.readAsText(file);
                    }}
                  />
                </Button>

                <Button
                  component="label"
                  variant="contained"
                  onClick={() => handleFileDownload('originalUserColumn')}
                >
                  {editType == 'update' ? '기존 컬럼 다운로드' : '서식 다운로드'}
                </Button>
              </Stack>
            </Stack>
          )}

          {formData.connectionType == 'LDAP' && (
            <Stack sx={{ height: '100%' }} direction={'row'} alignItems={'center'} spacing={1.5}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '42px',
                  padding: '0 15px',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  backgroundColor: theme.palette.grey[50],
                  borderRight: '1px solid',
                  borderColor: theme.palette.grey[300],
                }}
                className={'text inputText req'}
                dangerouslySetInnerHTML={{ __html: '부서 Attribute 정보' }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  component="label"
                  variant="contained"
                  color={formData.deptAttributes.length > 0 ? 'success' : 'primary'}
                >
                  파일 업로드
                  <input
                    type="file"
                    name="deptAttributeFile"
                    hidden
                    onChange={(e) => {
                      let file = e.target.files[0];
                      let fileReader = new FileReader();
                      fileReader.onload = () => {
                        if (fileReader.result.split('|').length < 2) {
                          openModal({
                            message:
                              '데이터 포맷이 맞지 않습니다. (ex) groupBasedn|attr1,attr2,...',
                            onConfirm: () => {},
                          });
                          return;
                        }
                        const groupBasedn = fileReader.result.split('|')[0];
                        const deptAttributes = fileReader.result.split('|')[1].split(',');
                        setFormData((state) => {
                          return {
                            ...state,
                            ldapGroupBasedn: groupBasedn,
                            deptAttributes: deptAttributes,
                          };
                        });
                        setTestPassed(false);
                      };
                      if (file != undefined) fileReader.readAsText(file);
                    }}
                  />
                </Button>

                <Button
                  component="label"
                  variant="contained"
                  onClick={() => handleFileDownload('originalDeptColumn')}
                >
                  {editType == 'update' ? '기존 컬럼 다운로드' : '서식 다운로드'}
                </Button>
              </Stack>
            </Stack>
          )}

          {formData.connectionType == 'FILE' && (
            <LabelInput
              type="text"
              required
              label="파일 경로"
              name="filePath"
              value={formData.filePath}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, filePath: event.target.value };
                });
              }}
              labelBackgroundFlag
            />
          )}
          {editType == 'update' && (
            <LabelInput
              type="select"
              required
              label="사용여부"
              name="useYn"
              value={formData.useYn}
              onChange={(event) => {
                setFormData((state) => {
                  return { ...state, useYn: event.target.value };
                });
              }}
              list={[
                { value: 'Y', label: '사용' },
                { value: 'N', label: '미사용' },
              ]}
              labelBackgroundFlag
            />
          )}
          <MainCard title="접속결과">
            <List
              dense
              sx={{
                width: '100%',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 100,
              }}
            >
              {connectionStatus.map((element, index) => {
                return (
                  <ListItem key={index} sx={{ margin: 0, padding: 0 }}>
                    <ListItemText
                      primary={`${element.message} ${
                        element.exception == undefined ? '' : element.exception
                      } ${element.code == undefined ? '' : element.code}`}
                      key={index}
                      sx={{ margin: 0, padding: 0 }}
                      primaryTypographyProps={{
                        variant: 'h6',
                        color: element.status == 200 ? 'black' : 'red',
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </MainCard>
        </GridItem>
      </GridItem>
    </PopUp>
  );
}

ConnectionModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ConnectionModal;
