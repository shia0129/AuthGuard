import { Button } from '@mui/material';

function MiniTableButton({ children, item, className }) {
  return (
    <Button
      variant={item?.variant || 'text'}
      className={className}
      sx={{ padding: '0', width: '100%', ...item.sx }}
      onClick={item.onClick}
    >
      {children}
    </Button>
  );
}

export default MiniTableButton;
