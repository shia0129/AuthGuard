import baseApi from '@api/common/baseApi';

const dbsyncApi = {
  ...baseApi,
  postConnection: (requestBody) => {
    const config = {
      transitional: {
        forcedJSONParsing: false,
      },
    };
    return dbsyncApi.axios.post('/api/system/dbsync/connection', requestBody, config);
  },
  postDbConnection: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/database', requestBody);
  },
  postLdapConnection: (requestBody) => {
    console.log('ldap requestbody', requestBody);
    return dbsyncApi.axios.post('/api/system/dbsync/ldap', requestBody);
  },
  postApprLinePolicy: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/policy', requestBody);
  },
  putDbConnection: (requestBody) => {
    return dbsyncApi.axios.put('/api/system/dbsync/database', requestBody);
  },
  putLdapConnection: (requestBody) => {
    return dbsyncApi.axios.put('/api/system/dbsync/ldap', requestBody);
  },
  putApprLinePolicy: (requestBody) => {
    return dbsyncApi.axios.put('/api/system/dbsync/policy', requestBody);
  },
  putApprPolicy: (requestBody) => {
    return dbsyncApi.axios.put('/api/system/dbsync/approve', requestBody);
  },
  deleteConnection: (parameters) => {
    return dbsyncApi.axios.delete(`/api/system/dbsync/connection`, {
      data: JSON.stringify(parameters.connectionSeq),
      headers: {
        'content-type': 'application/json',
      },
    });
  },
  deleteMappingData: (parameters) => {
    return dbsyncApi.axios.delete('/api/system/dbsync/mapping', {
      data: JSON.stringify(parameters),
      headers: {
        'content-type': 'application/json',
      },
    });
  },
  putConnectionInfo: (requestBody) => {
    return dbsyncApi.axios.put('/api/system/dbsync/connection', requestBody);
  },
  getConnectionList: () => {
    return dbsyncApi.axios.get('/api/system/dbsync/connection');
  },
  getApprLinePolicy: (parameters) => {
    return dbsyncApi.axios.get('/api/system/dbsync/policy', { params: parameters });
  },
  getBatchList: (parameters) => {
    return dbsyncApi.axios.get(`/api/system/dbsync/scheduler/${parameters.connectionSeq}`);
  },
  deleteBatch: (parameters) => {
    return dbsyncApi.axios.delete('/api/system/dbsync/scheduler', {
      data: JSON.stringify(parameters),
      headers: {
        'content-type': 'application/json',
      },
    });
  },
  postBatch: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/scheduler', requestBody);
  },
  putBatch: (requestBody) => {
    return dbsyncApi.axios.put('/api/system/dbsync/scheduler', requestBody);
  },

  getScheduleLog: (parameters) => {
    // return { data: [], status: 200 };
    return dbsyncApi.axios.get('/api/system/dbsync/log/schedule', {
      params: parameters,
    });
  },

  getExecutionLog: (parameters) => {
    // return { data: [], status: 200 };
    return dbsyncApi.axios.get('/api/system/dbsync/log', {
      params: parameters,
    });
  },

  getApprPolicy: (parameters) => {
    return dbsyncApi.axios.get('/api/system/dbsync/approve', {
      params: parameters,
    });
  },
  deleteApprLinePolicy: (parameters) => {
    return dbsyncApi.axios.delete('/api/system/dbsync/policy', {
      data: JSON.stringify(parameters),
      headers: {
        'content-type': 'application/json',
      },
    });
  },
  deleteApprLine: (parameters) => {
    return dbsyncApi.axios.delete('/api/system/dbsync/approve', {
      data: JSON.stringify(parameters),
      headers: {
        'content-type': 'application/json',
      },
    });
  },
  getDbConnection: (parameters) => {
    return dbsyncApi.axios.get(`/api/system/dbsync/database/${parameters.connectionSeq}`);
  },
  getLdapConnection: (parameters) => {
    return dbsyncApi.axios.get(`/api/system/dbsync/ldap/${parameters.connectionSeq}`);
  },

  postCheckDbConnection: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/database/checkDbConnection', requestBody);
  },
  postCheckLdapConnection: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/ldap/checkLDAPConnection', requestBody);
  },
  getMappingData: (parameters) => {
    return dbsyncApi.axios.get('/api/system/dbsync/mapping', {
      params: parameters,
    });
  },
  getMappingFile: (parameters) => {
    return dbsyncApi.axios.get('/api/system/dbsync/mapping/file', {
      params: parameters,
    });
  },
  putMappingData: (requestBody) => {
    return dbsyncApi.axios.put('/api/system/dbsync/mapping', requestBody);
  },
  postMappingData: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/mapping', requestBody);
  },
  getApprLineTestResult: (parameters) => {
    return dbsyncApi.axios.get('/api/system/dbsync/policy/verification', {
      params: parameters,
    });
  },

  getApprTestResult: () => {
    return {
      data: [
        {
          approveId: 1,
          approveRank: '',
          privacyYn: 'N',
          approveGrade: 1,
          result: '성공',
          updateCount: 21,
        },
        {
          approveId: '',
          approveRank: '팀장',
          privacyYn: 'N',
          approveGrade: 2,
          result: '성공',
          updateCount: 11,
        },

        {
          approveId: '',
          approveRank: '팀원',
          privacyYn: 'Y',
          approveGrade: 1,
          result: '실패',
          updateCount: 121,
        },
      ],
      status: 200,
    };
  },

  getMappingTestResult: (parameters) => {
    return dbsyncApi.axios.get('/api/system/dbsync/mapping/verification', {
      params: parameters,
    });
  },
  postBatchTestResult: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/run/single', requestBody);
  },

  getTestResult: () => {
    return {
      data: {
        content: [
          {
            step: 'Step1',
            processName: '고객사 user 조회',
            result: '성공',
            insertCount: 1,
            updateCount: 2,
            deleteCount: 3,
            errorMsg: '-',
          },
          {
            step: 'Step1',
            processName: 'user 임시테이블 저장',
            result: '성공',
            insertCount: 1,
            updateCount: 2,
            deleteCount: 3,
            errorMsg: '-',
          },
          {
            step: 'Step2',
            processName: 'dept 임시테이블 저장',
            result: '실패',
            insertCount: 1,
            updateCount: 2,
            deleteCount: 3,
            errorMsg: 'SQL ERROR [1000] at... 30..',
          },
        ],
      },
      status: 200,
    };
  },

  postApprPolicy: (requestBody) => {
    return dbsyncApi.axios.post('/api/system/dbsync/approve', requestBody);
  },
};

export default dbsyncApi;
