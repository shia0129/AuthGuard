import { fetchSSEApi } from '@api/common/fetchSSEApi';
import { useRef } from 'react';

export const useTimerControl = () => {
  const eventSource = useRef(null);

  const disconnectSSE = () => {
    if (eventSource.current) {
      eventSource.current.onerror = null;
      eventSource.current.onmessage = null;
      eventSource.current.onopen = null;
      fetchSSEApi.closeEventSource(eventSource.current);
      eventSource.current = null;
    }
  };

  const connectSSE = (session, onOpen, onMessage, onError) => {
    if (!session?.user?.hsssessionid || !session?.accessToken) {
      disconnectSSE();
      return;
    }

    try {
      eventSource.current = fetchSSEApi.connectToEventSource(
        '/api/event/servertime',
        session.user.hsssessionid,
        session.accessToken,
        onOpen,
        onMessage,
        onError,
      );
    } catch (error) {
      console.error('SSE 연결 중 오류 발생:', error);
    }
  };

  return {
    disconnectSSE,
    connectSSE,
    eventSource,
  };
};
