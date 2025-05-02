import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function PacketcaptureListTable({ packets, onSelectPacket, selectedPacketId }) {
  if (!Array.isArray(packets)) return null;

  const parseFrameInfo = (pkt, index) => {
    const layers = pkt._source?.layers ?? {};

    const raw = layers.frame_raw?.[0];
    const frame = layers.frame || {};
    const ip = layers.ip || {};
    const tcp = layers.tcp || {};
    const udp = layers.udp || {};

    const time = frame["frame.time"] || pkt._source?.timestamp || "Unknown";
    const number = frame["frame.number"] || index + 1;
    const length = frame["frame.len"] || (raw ? raw.length / 2 : "N/A");
    const protocols = frame["frame.protocols"] || Object.keys(layers).join(":");

    const src = ip["ip.src"] || "Unknown";
    const dst = ip["ip.dst"] || "Unknown";
    const proto = tcp ? "TCP" : udp ? "UDP" : "UNKNOWN";

    return { number, time, src, dst, proto, length, protocols };
  };

  // ✅ 조건부로 높이 적용 (10개 초과 시에만 스크롤)
  const enableScroll = packets.length > 10;
  const containerStyles = enableScroll
    ? { maxHeight: 400, overflowY: 'auto' }
    : {};

  return (
    <TableContainer component={Paper} sx={containerStyles}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Protocol</TableCell>
            <TableCell>Length</TableCell>
            <TableCell>Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {packets.map((pkt, index) => {
            const { number, time, src, dst, proto, length, protocols } = parseFrameInfo(pkt, index);

            return (
              <TableRow
                key={index}
                hover
                selected={selectedPacketId === index}
                onClick={() => onSelectPacket(pkt, index)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{number}</TableCell>
                <TableCell>{time}</TableCell>
                <TableCell>{src}</TableCell>
                <TableCell>{dst}</TableCell>
                <TableCell>{proto}</TableCell>
                <TableCell>{length}</TableCell>
                <TableCell>{protocols}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PacketcaptureListTable;
