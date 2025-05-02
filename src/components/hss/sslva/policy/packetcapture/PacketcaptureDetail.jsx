import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PacketcaptureDetail = ({ details }) => {
  if (!details || !details._source || !details._source.layers) return null;

  const layers = details._source.layers;

  const renderValue = (value) => {
    if (typeof value === 'object') {
      return (
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return value;
  };

  return (
    <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
      {Object.entries(layers).map(([layerName, layerData], index) => {
        if (layerName.toLowerCase().endsWith('_raw')) return null;

        return (
          <Accordion key={index} defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{layerName.toUpperCase()}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableBody>
                    {Object.entries(layerData).map(([key, value], i) => {
                      if (key.toLowerCase().endsWith('_raw')) return null;

                      return (
                        <TableRow key={i}>
                          <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            {key}
                          </TableCell>
                          <TableCell>{renderValue(value)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default PacketcaptureDetail;
