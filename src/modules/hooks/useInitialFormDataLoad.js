import { useEffect, useState, useRef } from 'react';

/**
 * 초기 데이터 불러오기용 커스텀 훅
 * @param {Object} config
 * @param {boolean} config.enabled - 로딩 트리거
 * @param {Function} config.fetcher - 비동기 API 호출 함수
 * @param {Function} config.onLoaded - 데이터 받아온 후 처리 함수
 * @returns {boolean} isInitLoading - 로딩 중 여부
 */
function useInitialFormDataLoad({ enabled = false, fetcher, onLoaded }) {
  const [isInitLoading, setIsInitLoading] = useState(enabled);
  const calledRef = useRef(false); // 무한 호출 방지

  useEffect(() => {
    if (!enabled || calledRef.current) return;

    calledRef.current = true;

    const fetchData = async () => {
      setIsInitLoading(true);
      try {
        const result = await fetcher();
        onLoaded?.(result);
      } catch (e) {
        console.error('초기 데이터 로딩 실패:', e);
      } finally {
        setIsInitLoading(false);
      }
    };

    fetchData();
  }, [enabled]); //, fetcher, onLoaded]);

  // 컴포넌트 언마운트 시 ref 초기화
  useEffect(() => {
    return () => {
      calledRef.current = false;
    };
  }, []);

  return isInitLoading;
}

export default useInitialFormDataLoad;
