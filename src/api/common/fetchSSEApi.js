import { EventSourcePolyfill } from 'event-source-polyfill';

const connectToEventSource = (url, sessionId, accessToken, onOpen, onMessage, onError) => {
  if (sessionId == null || accessToken == null) {
    return null;
  }

  const options = {
    headers: {
      hsssessionid: sessionId,
      'Content-type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
    withCredentials: false,
  };

  const eventSource = new EventSourcePolyfill(url, options);

  eventSource.onopen = () => {
    onOpen();
  };

  eventSource.onmessage = (event) => {
    onMessage(event.data);
  };

  eventSource.onerror = (event) => {
    if (event.type === 'error') {
      if (event.status && event.status != 200) {
        closeEventSource(eventSource);
        onError(event);
      }
    }
  };

  return eventSource;
};

const closeEventSource = (eventSource) => {
  if (eventSource) {
    eventSource.close();
  }
};

export const fetchSSEApi = { connectToEventSource, closeEventSource };
