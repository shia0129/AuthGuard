import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchSSEApi } from '@api/common/fetchSSEApi';

export default function useRealTimeSslvaUsage() {
  const lastHandledRef = useRef(0);
  const { data: session } = useSession();

  const [minuteUsage, setMinuteUsage] = useState(0);
  const [hourlyUsage, setHourlyUsage] = useState(0);
  const [dailyUsage, setDailyUsage] = useState(0);

  useEffect(() => {
    if (!session) return;

    const onMessage = (event) => {
      const now = Date.now();
      if (now - lastHandledRef.current < 60 * 1000) return;
      lastHandledRef.current = now;

      const { attribute } = JSON.parse(event);
      const serverInfo = attribute?.server_info;
      if (!Array.isArray(serverInfo) || !serverInfo[0]?.data) return;

      const usageData = serverInfo[0].data;
      const values = usageData.map((d) => (typeof d[1] === 'number' ? d[1] : 0));

      setMinuteUsage(Math.round(values[0]));
      setHourlyUsage(Math.round(values.slice(0, 60).reduce((sum, v) => sum + v, 0)));
      setDailyUsage(Math.round(values.slice(0, 1440).reduce((sum, v) => sum + v, 0)));
    };

    const eventSource = fetchSSEApi.connectToEventSource(
      '/api/event/netdata?chart=HSS.VA_conn&after=-86400&points=1440',
      session?.user?.hsssessionid,
      session?.accessToken,
      () => {},
      onMessage,
      (err) => console.error('SSE Error:', err),
    );

    return () => fetchSSEApi.closeEventSource(eventSource);
  }, [session]);

  return { minuteUsage, hourlyUsage, dailyUsage };
}
