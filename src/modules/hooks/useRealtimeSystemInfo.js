import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchSSEApi } from '@api/common/fetchSSEApi';

export function useRealtimeSystemInfo() {
  const { data: session } = useSession();
  const [systemInfo, setSystemInfo] = useState({
    cpu: 0,
    memory: 0,
    disk: null,
    uptime: 0,
    net: {
      rx: 0,
      tx: 0,
    },
  });

  const parseSystemInfo = (serverInfo) => {
    const cpuInfo = serverInfo.find((info) => info.name === 'system.cpu');
    const memoryInfo = serverInfo.find((info) => info.name === 'system.ram');
    const diskInfo = serverInfo.find((info) => info.name === 'disk_space._cf_rootrd');
    const uptimeInfo = serverInfo.find((info) => info.name === 'system.uptime');
    const netInfo = serverInfo.find((info) => info.name === 'system.net');

    const parsed = {
      cpu: 0,
      memory: 0,
      disk: null,
      uptime: 0,
      net: { rx: 0, tx: 0 },
    };

    if (cpuInfo?.dimensions?.idle?.value != null) {
      const totalCpuUsage = 100 - cpuInfo.dimensions.idle.value;
      parsed.cpu = Number(totalCpuUsage.toFixed(2));
    }

    const free = memoryInfo?.dimensions?.free?.value ?? 0;
    const used = memoryInfo?.dimensions?.used?.value ?? 0;
    const cached = memoryInfo?.dimensions?.cached?.value ?? 0;
    const totalMem = free + used + cached;
    if (totalMem > 0) {
      parsed.memory = Number(((used / totalMem) * 100).toFixed(2));
    }

    const avail = diskInfo?.dimensions?.avail?.value;
    const usedDisk = diskInfo?.dimensions?.used?.value;
    const reserved = diskInfo?.dimensions?.reserved_for_root?.value;
    if (avail != null && usedDisk != null && reserved != null) {
      const total = avail + usedDisk + reserved;
      const usagePercent = ((usedDisk / total) * 100).toFixed(2);
      parsed.disk = {
        total,
        used: usedDisk,
        avail,
        usagePercent,
      };
    }

    parsed.uptime = uptimeInfo?.dimensions?.uptime?.value ?? 0;

    const rx = Math.max(netInfo?.dimensions?.InOctets?.value ?? 0, 0) / 8;
    const tx = Math.max(netInfo?.dimensions?.OutOctets?.value ?? 0, 0) / 8;
    parsed.net = { rx, tx };

    return parsed;
  };

  useEffect(() => {
    if (!session) return;

    const onMessage = (event) => {
      const { attribute } = JSON.parse(event);
      const serverInfo = attribute?.server_info || [];
      const parsed = parseSystemInfo(serverInfo);
      setSystemInfo(parsed);
    };

    const eventSource = fetchSSEApi.connectToEventSource(
      '/api/event/netdata/realtime?names=system.cpu,system.ram,disk_space._cf_rootrd,system.uptime,system.net',
      session?.user?.hsssessionid,
      session?.accessToken,
      () => {},
      onMessage,
      (err) => console.error('SystemInfo SSE Error:', err),
    );

    return () => {
      fetchSSEApi.closeEventSource(eventSource);
    };
  }, [session]);

  return systemInfo;
}
