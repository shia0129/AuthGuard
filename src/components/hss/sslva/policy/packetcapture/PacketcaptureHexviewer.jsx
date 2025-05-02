import React from 'react';
import { Box, Typography } from '@mui/material';

const formatHexDump = (hexString) => {
  try {
    const hex = hexString.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    const bytes = hex.match(/.{1,2}/g) || [];

    let output = '';
    for (let i = 0; i < bytes.length; i += 16) {
      const offset = i.toString(16).padStart(4, '0');
      const hexPart = bytes.slice(i, i + 16).map(b => b.padEnd(2, ' ')).join(' ');
      const asciiPart = bytes.slice(i, i + 16)
        .map(b => {
          const char = String.fromCharCode(parseInt(b, 16));
          return /[ -~]/.test(char) ? char : '.';
        })
        .join('');

      output += `${offset}  ${hexPart.padEnd(48, ' ')}  ${asciiPart}\n`;
    }

    return output;
  } catch (e) {
    return '[Invalid Hex Format]';
  }
};

const PacketcaptureHexViewer = ({ hexData }) => {
  // ✅ hexData가 배열이라면 첫 번째 값만 사용
  const rawHex = Array.isArray(hexData) ? hexData[0] : hexData;

  if (!rawHex || typeof rawHex !== 'string') return null;

  const formattedHex = formatHexDump(rawHex);

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="subtitle1" gutterBottom>
        Frame Raw (HEX + ASCII)
      </Typography>
      <Box
        component="pre"
        sx={{
          fontFamily: 'monospace',
          fontSize: 12,
          overflowX: 'auto',
          whiteSpace: 'pre',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 1,
          p: 1,
        }}
      >
        {formattedHex}
      </Box>
    </Box>
  );
};

export default PacketcaptureHexViewer;
