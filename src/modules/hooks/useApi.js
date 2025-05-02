import { signOut } from 'next-auth/react';
import useModal from './useModal';
import HsLib from '@modules/common/HsLib';

const useApi = () => {
  const openModal = useModal();

  /**
   *
   * @param {Function} func API 실행 함수.
   * @param {*} param API 전달 파라미터.
   * @param {Boolean} flag 사용자 정의 예외처리 여부.
   * @returns API 요청 응답 결과.
   */
  const executeApi = async (func, param, flag = false) => {
    const intl = await HsLib.getIntl();
    try {
      return await func(param);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        const { status, message, code } = error.response.data || {};

        // Axios error response session out case.
        if (error.response?.sessionOut)
          return { data: error.response.data, status: error.response.status };

        if (status === 401 || status === 403) {
          try {
            localStorage.clear();
          } catch (e) {
            console.error('스토리지 정리 실패', e);
          }

          signOut({ callbackUrl: '/common/login' });
          return;
        }

        if (status === 500) {
          openModal({
            // 일시적인 서버 오류가 발생했습니다.
            message: intl.formatMessage({ id: 'common.server-msg-error' }),
            type: 'error',
          });
          return error.response;
        }

        // 요청이 전송되었고, 서버는 2xx 외의 코드로 응답.
        if (typeof error.response.data === 'object' && 'errorYn' in error.response.data) {
          const {
            errorYn,
            error: { errorMessage },
          } = error.response.data;

          // 사용자 정의 예외처리 flag 값 true 시 스킵.
          if (!flag && errorYn) {
            openModal({
              //message: message || '오류가 발생했습니다. 관리자에게 문의해주시기 바랍니다.',
              message: message || intl.formatMessage({ id: 'common.api-msg-error-1' }),
              type: 'error',
            });
          }
        }

        return error.response;
      } else if (error.request) {
        // 요청이 전송되었지만, 응답이 수신되지 않음.
        console.log(error.request);
        return error.request;
      } else {
        // 요청을 설정하는 동안 문제발생.
        console.log('Error useApi.js 1', error.message);
        return error.message;
      }
    }
  };

  /**
   *
   * @param {Array} requestAllList Promise 객체 목록.
   * @param {Boolean} flag 사용자 정의 예외처리 여부.
   * @returns
   */
  const executePromiseAllApi = async (requestAllList = [], flag = false) => {
    const intl = await HsLib.getIntl();

    if (Array.isArray(requestAllList) && requestAllList.length !== 0) {
      try {
        return await Promise.all(requestAllList);
      } catch (error) {
        if (error.response) {
          // 요청이 전송되었고, 서버는 2xx 외의 코드로 응답.
          const { status, message, code } = error.response.data || {};

          if (error.response?.sessionOut) {
            return { data: error.response.data, status: error.response.status };
          }

          if (status === 401 || status === 403) {
            try {
              localStorage.clear();
            } catch (e) {
              console.error('스토리지 정리 실패', e);
            }
            signOut({ callbackUrl: '/common/login' });
            return;
          }

          if (status === 500) {
            openModal({
              // 일시적인 서버 오류가 발생했습니다.
              message: intl.formatMessage({ id: 'common.server-msg-error' }),
              type: 'error',
            });
            return error.response;
          }

          // 사용자 정의 예외처리로 인한 스킵.
          if (!flag) {
            openModal({
              //message: message || '오류가 발생했습니다. 관리자에게 문의해주시기 바랍니다.',
              message: message || intl.formatMessage({ id: 'common.api-msg-error-1' }),
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
          console.log('Error useApi.js 2', error.message);
          return error.message;
        }
      }
    } else {
      openModal({
        //message: '요청 내용이 존재하지 않습니다.',
        message: intl.formatMessage({ id: 'common.api-msg-error-2' }),
        type: 'error',
      });
      return [];
    }
  };

  return [executeApi, openModal, executePromiseAllApi];
};

export default useApi;
