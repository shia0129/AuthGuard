import { TableRow } from '@mui/material';

const ReactRow = ({ row, children, theme, id, ...rest }) => {
  // row.getRowProps()에서 key와 style 분리
  const rowProps = row.getRowProps ? row.getRowProps() : {};
  const { key: rowKey, style, ...otherRowProps } = rowProps;
  const finalKey = rowKey || `fallback-key-${new Date().getTime()}`;

  return (
    <TableRow
      key={finalKey}
      className="CMM-rt-tableArea-reactRow-tableRow"
      {...rest}
      {...otherRowProps}
      sx={{
        bgcolor: row.isSelected ? theme.palette.primary.lighter : 'inherit',
        '&.MuiTableRow-root:hover': {
          '& .MuiTableCell-root': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          },
        },
        '& [data-sticky-td]': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? row.isSelected
                ? theme.palette.primary.lighter
                : '#1E1E1E'
              : row.isSelected
              ? theme.palette.primary.lighter
              : theme.palette.common.white,
        },
        height: id !== 'PermissionForm' && (rest?.height ? rest.height : 40),
        // style 병합
        ...style,
        ...(rest?.style || {}),
      }}
    >
      {children}
    </TableRow>
  );
};

export default ReactRow;
