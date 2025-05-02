import { useEffect, useRef } from 'react';

// 전역에서 효과 추적을 위한 Map
const effectMap = new Map();

// 호출한 파일 경로 + 라인 번호를 기반으로 고유 키 생성
function getCallerKey() {
  try {
    const err = new Error();
    const stackLines = err.stack?.split('\n');

    // 호출자 위치 찾기 (3번째 줄 기준)
    const callerLine = stackLines?.[2] ?? stackLines?.[1];

    const match = callerLine?.match(/at\s+(?:.*\()?(.+):(\d+):(\d+)\)?/);
    if (match) {
      const file = match[1]?.split('/').slice(-2).join('/'); // 마지막 두 경로만
      const line = match[2];
      return `${file}:${line}`;
    }
  } catch (e) {
    console.warn('getCallerKey failed:', e);
  }

  // fallback: 무작위 키
  return `unknown:${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * 일반 useEffect를 한 번만 실행되도록 감싸는 훅
 * @param {Function} callback 실행할 함수
 * @param {Array} deps 의존성 배열
 * @param {string} key (선택) 고유 키 수동 지정
 */
export function useOnceEffect(callback, deps = [], key) {
  const keyRef = useRef(key || getCallerKey());
  const useEffect_0001 = useRef(false);
 
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (effectMap.has(keyRef.current)) return;

    effectMap.set(keyRef.current, true);
    callback?.();
  }, deps);
}

/**
 * 비동기 useEffect를 한 번만 실행되도록 감싸는 훅
 * @param {Function} asyncCallback 실행할 async 함수
 * @param {Array} deps 의존성 배열
 * @param {string} key (선택) 고유 키 수동 지정
 */
export function useOnceAsyncEffect(asyncCallback, deps = [], key) {
  const keyRef = useRef(key || getCallerKey());
  const useEffect_0002 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (effectMap.has(keyRef.current)) return;

    effectMap.set(keyRef.current, true);
    asyncCallback?.().catch((e) => {
      console.error('useOnceAsyncEffect error:', e);
    });
  }, deps);
}
