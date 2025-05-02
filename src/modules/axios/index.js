import useAccess from '@modules/hooks/useAccess';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import forge from 'node-forge';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '@modules/redux/reducers/loader';
import { useRouter } from 'next/router';
import HsLib from '@modules/common/HsLib';
import useModal from '@modules/hooks/useModal';

import * as CryptoJS from 'crypto-js';

const EXCEPTION_LIST = [
  'SignatureException',
  'ExpiredJwtException',
  'jwtSessionException',
  'accessDeniedException',
  'RSA_PRIVATE_KEY_ERROR',
];

const DefaultInstance = (options) => {
  // 기본 Axios
  const instance = axios.create({
    responseType: 'json',
    ...options,
  });

  instance.interceptors.response.use(
    (response) => {
      // 성공 응답 인터셉터.
      const { status } = response; // 기본 status 2xx

      /**
       * data 및 200 status로 응답값 유무 정확하게 체크.
       * 현재는 응답 성공 코드 200만 사용하지만, 향후 2xx 코드 사용 시 분기처리 필요.
       */
      if (200 <= status < 300) {
        return response;
      }
    },
    (error) => {
      // 실패 응답 인터셉터.

      return Promise.reject(error); // Promise rejected 상태 전송.
    },
  );

  return instance;
};

const jwtInstance = (token) =>
  axios.create({
    headers: {
      Authorization: token,
    },
    responseType: 'json',
  });

/**
 *
 * @param {Object} headers HTTP 추가 헤더 정보.
 * @param {Boolean} tokenReissue 토큰 재발급 요청 여부.
 */
const AuthInstance = ({ headers = {}, tokenReissue = false, ...rest } = {}) => {
  const { data: session, update: sessionUpdate } = useSession();
  const { insert, read, update, remove } = useAccess();
  const dispatch = useDispatch();

  const router = useRouter();
  const openModal = useModal();

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const token = `Bearer ${session.accessToken}`;

  const instance = axios.create({
    headers: {
      Authorization: token,
      ...headers,
    },
    responseType: 'json',
    cancelToken: source.token,
    ...rest,
  });

  instance.interceptors.request.use(
    async (config) => {
      // 파라미터 암호화가 존재하는 경우,
      if (config.data || config.params) {
        // 암호화 목록
        let encryptList = config.data?.['encryptList'];

        if (session?.rsaKey) {
          if (config.data instanceof FormData) encryptList = config.data.get('encryptList');
          const paramEncryptList = config.params?.['encryptList'];

          // AES-128 Random Key and IV 생성.
          const key = CryptoJS.lib.WordArray.random(8).toString();
          const iv = CryptoJS.lib.WordArray.random(8).toString();

          // 서버에 넘겨 줄 RSA로 암호화된 Key와 IV.
          const encryptedKey = forge.util.encode64(
            forge.pki.publicKeyFromPem(session.rsaKey).encrypt(encodeURIComponent(key)),
          );
          const encryptedIv = forge.util.encode64(
            forge.pki.publicKeyFromPem(session.rsaKey).encrypt(encodeURIComponent(iv)),
          );

          // AES-CBC 모드의 cipher 생성.
          const cipher = forge.cipher.createCipher('AES-CBC', key);

          if (typeof encryptList === 'string' || Array.isArray(encryptList)) {
            // FormData 타입의 경우,
            if (config.data instanceof FormData) {
              if (encryptList === 'all') {
                for (let key of config.data.keys()) {
                  if (
                    config.data.get(key) !== '' &&
                    config.data.get(key) !== 'undefined' &&
                    key !== 'encryptList'
                  ) {
                    cipher.start({ iv: iv });
                    cipher.update(
                      forge.util.createBuffer(
                        encodeURIComponent(JSON.stringify(config.data.get(key))),
                      ),
                    );
                    cipher.finish();

                    config.data.set(key, forge.util.encode64(cipher.output.data));
                  }
                }
              } else {
                encryptList.map((key) => {
                  if (
                    config.data.get(key) !== '' &&
                    config.data.get(key) !== 'undefined' &&
                    key !== 'encryptList'
                  ) {
                    cipher.start({ iv: iv });
                    cipher.update(
                      forge.util.createBuffer(
                        encodeURIComponent(JSON.stringify(config.data.get(key))),
                      ),
                    );
                    cipher.finish();
                    config.data.set(key, forge.util.encode64(cipher.output.data));
                  }
                });
              }
              config.headers['X-Encrypt'] = true;
              config.data.set('indexKey', session.indexKey);
              config.data.set('k', encryptedKey);
              config.data.set('i', encryptedIv);
            } else {
              // body로 전달되는 파라미터 암호화 처리.

              // 모든 파라미터 암호화,
              if (encryptList === 'all') {
                for (let key in config.data) {
                  if (
                    config.data[`${key}`] !== '' &&
                    config.data[`${key}`] !== 'undefined' &&
                    key !== 'encryptList'
                  ) {
                    cipher.start({ iv: iv });
                    cipher.update(
                      forge.util.createBuffer(
                        encodeURIComponent(JSON.stringify(config.data[`${key}`])),
                      ),
                    );
                    cipher.finish();
                    config.data[`${key}`] = forge.util.encode64(cipher.output.data);
                  }
                }
              } else {
                // 목록으로 제공되는 경우,
                encryptList.map((key) => {
                  if (
                    config.data[`${key}`] !== '' &&
                    config.data[`${key}`] !== 'undefined' &&
                    key !== 'encryptList'
                  ) {
                    cipher.start({ iv: iv });
                    cipher.update(
                      forge.util.createBuffer(
                        encodeURIComponent(JSON.stringify(config.data[`${key}`])),
                      ),
                    );
                    cipher.finish();
                    config.data[`${key}`] = forge.util.encode64(cipher.output.data);
                  }
                });
              }
            }
            config.headers['X-Encrypt'] = true;
            config.data['indexKey'] = session.indexKey;
            config.data['k'] = encryptedKey;
            config.data['i'] = encryptedIv;
          }
          // 쿼리 스트링 파라미터 암호화 처리.
          if (typeof paramEncryptList === 'string' || Array.isArray(paramEncryptList)) {
            // 모든 파라미터 암호화,
            if (paramEncryptList === 'all') {
              for (let key in config.params) {
                if (
                  config.params[`${key}`] !== '' &&
                  config.params[`${key}`] !== 'undefined' &&
                  key !== 'encryptList'
                ) {
                  cipher.start({ iv: iv });
                  cipher.update(
                    forge.util.createBuffer(
                      encodeURIComponent(JSON.stringify(config.params[`${key}`])),
                    ),
                  );
                  cipher.finish();
                  config.params[`${key}`] = forge.util.encode64(cipher.output.data);
                }
              }
            } else {
              // 목록으로 제공되는 경우,
              config.params.encryptList.map((key) => {
                if (
                  config.params[`${key}`] !== '' &&
                  config.params[`${key}`] !== 'undefined' &&
                  key !== 'encryptList'
                ) {
                  cipher.start({ iv: iv });
                  cipher.update(
                    forge.util.createBuffer(
                      encodeURIComponent(JSON.stringify(config.params[`${key}`])),
                    ),
                  );
                  cipher.finish();
                  config.params[`${key}`] = forge.util.encode64(cipher.output.data);
                }
              });
            }
            config.headers['X-Encrypt'] = true;
            config.params['indexKey'] = session.indexKey;
            config.params['k'] = encryptedKey;
            config.params['i'] = encryptedIv;
          }
        }
      }

      // 사용자 메뉴 접근 권한 확인.
      let isPermit = false;
      switch (config.method) {
        case 'get':
          isPermit = read;
          break;
        case 'post':
          isPermit = insert;
          break;
        case 'put':
          isPermit = update;
          break;
        case 'delete':
          isPermit = remove;
          break;
        default:
          isPermit = true;
          break;
      }

      // X-Common 헤더가 존재하지 않고 isPermit이 false라면, 요청 전송 취소
      if (!config.headers['X-Common'] && !isPermit) {
        source.cancel('Cancel Request');
      }

      // X-Progress 헤더가 존재하면 요청 대기 로딩 컴포넌트 사용.
      if (config.headers['X-Progress']) dispatch(startLoading());

      // 불필요한 헤더 제거.
      delete config.headers['X-Progress'];
      delete config.headers['X-Common'];

      if (tokenReissue) {
        const { sub, exp } = await HsLib.getTokenPayload();
        const expireDate = new Date(exp * 1000);
        const currentDate = new Date();

        // 토큰 만료 시간 <= 5분뒤 시간인 경우, 토큰 재발급.
        if (expireDate <= currentDate.setMinutes(currentDate.getMinutes() + 5)) {
          try {
            const { data, status } = await jwtInstance(token).get('/api/jwtAccessToken', {
              params: { userId: sub },
            });

            if (status === 200) {
              // 현재 요청 재발급된 토큰 사용.
              config.headers.Authorization = `Bearer ${data}`;

              // 재발급된 토큰으로 세션 정보 업데이트.
              sessionUpdate({
                accessToken: data,
              });
            }
          } catch (error) {
            if (error.response) {
              // 요청이 전송되었고, 서버는 2xx 외의 코드로 응답.
              const {
                errorYn,
                error: { errorMessage },
              } = error.response.data;

              if (errorYn) {
                openModal({
                  message: errorMessage || '오류가 발생했습니다. 관리자에게 문의해주시기 바랍니다.',
                  type: 'error',
                });
              }
              return error.response;
            } else if (error.request) {
              // 요청이 전송되었지만, 응답이 수신되지 않음.
              console.log(error.request);
              return error.request;
            } else {
              // 요청을 설정하는 동안 문제발생.
              console.log('Error axios/index.js', error.message);
              return error.message;
            }
          }
        }
      }

      return config;
    },
    (error) => {
      dispatch(stopLoading());
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      // 성공 응답 인터셉터.
      const { status } = response; // 기본 status 2xx
      dispatch(stopLoading());
      /**
       * data 및 200 status로 응답값 유무 정확하게 체크.
       * 현재는 응답 성공 코드 200만 사용하지만, 향후 2xx 코드 사용 시 분기처리 필요.
       */
      if (200 <= status < 300) {
        return response;
      }
    },
    (error) => {
      dispatch(stopLoading());

      // 실패 응답 인터셉터.
      if (error.response) {
        const { status } = error.response;
        if (status === 500) router.replace('/serverError');
        if (400 <= status < 600) {
          const { data } = error.response;

          if ('error' in data) {
            const {
              error: { errorCode, errorMessage },
            } = data;

            if (EXCEPTION_LIST.includes(errorCode)) {
              openModal({
                message: errorMessage,
                type: 'warn',
                onConfirm: () => signOut({ callbackUrl: '/common/login' }),
              });

              return Promise.reject({
                ...error,
                response: { ...error.response, sessionOut: true },
              });
            }

            // TODO: 기존 에러 응답 방식이 변경되면 지워도 무방.
          } else if (!tokenReissue && EXCEPTION_LIST.includes(data.exception)) {
            openModal({
              message: data.message,
              type: 'warn',
              onConfirm: () => signOut({ callbackUrl: '/common/login' }),
            });
          }
        }
      }
      return Promise.reject(error); // Promise rejected 상태 전송.
    },
  );

  return { instance, source };
};

export { AuthInstance, DefaultInstance };
