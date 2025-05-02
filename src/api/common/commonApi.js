import { DefaultInstance } from '@modules/axios/index';
const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

// 회원가입 및 로그인 처리 API
const commonApi = {
  // 기본 Axios.
  axios: DefaultInstance(),

  // RSA Key 요청 함수.
  getRsaKey: (parameters) => {
    const { userId, addAuth } = parameters;
    let prefix = '/';
    if (addAuth) prefix = `${SERVER_ADDRESS}`;

    return commonApi.axios.get(prefix + 'api/rsaKey', { params: { userId } });
  },
  logoutUser: (parameters) => {
    return commonApi.axios.delete('/api/logout-user', {
      data: parameters,
    });
  },

  /** 로그인 요청 함수.
   
  authenticateUser: (credentials, headers) => {
    const { userId, userPassword, indexKey, browserName } = credentials;

    let requestHeader = {};
    if (headers['x-real-ip'] && headers['x-forwarded-for']) {
      requestHeader = {
        'x-real-ip': headers['x-real-ip'],
        'x-forwarded-for': headers['x-forwarded-for'],
      };
    }
    
    return commonApi.axios.post(
      `${SERVER_ADDRESS}api/authenticate`,
      {
        userId,
        userPassword,
        browserName,
        indexKey,
      },
      {
        headers: { ...requestHeader },
      },
    );
  },
  */
};

export default commonApi;
