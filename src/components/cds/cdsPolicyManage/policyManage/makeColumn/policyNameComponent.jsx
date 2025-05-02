import { Link } from '@mui/material';

function PolicyNameComponent({ value, id, onNameColumnClick }) {
  return (
    <Link
      sx={{
        cursor: 'pointer',
        display: 'inline-block',
        height: 1,
        width: 1,
        ml: 1,
      }}
      onClick={() => onNameColumnClick(id)}
    >
      {value}
    </Link>
  );
}

export default PolicyNameComponent;
