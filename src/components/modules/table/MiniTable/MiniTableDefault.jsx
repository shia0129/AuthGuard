import { Box, Typography } from '@mui/material';

function MiniTableDefault({ children, ellipsis, onClick, column, item }) {
  const handleCellClick = (event) => {
    if (onClick) {
      onClick(event, column.id, item);
    }
  };
  return (
    <Box
      component="div"
      onClick={handleCellClick}
      sx={{
        ...(ellipsis && {
          '& p,a': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            verticalAlign: 'middle',
            whiteSpace: 'nowrap',
          },
        }),
      }}
    >
      {column.render ? (
        column.render(children)
      ) : (
        <Typography className={column.id} sx={{ fontSize: '12px' }}>
          {children}
        </Typography>
      )}
    </Box>
  );
}

export default MiniTableDefault;
