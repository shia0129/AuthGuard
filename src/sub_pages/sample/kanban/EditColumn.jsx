// libraries
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// components
import LabelInput from '@components/modules/input/LabelInput';

// functions
import config from 'src/config';
import { editColumn } from '@modules/redux/reducers/kanban';

// ==============================|| KANBAN BOARD - COLUMN EDIT ||============================== //

function EditColumn({ column }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { columns } = useSelector((state) => state.kanban);

  const handleColumnRename = (event) => {
    const copyColumns = [...columns];
    const columnIndex = columns.findIndex((item) => item.id === column.id);

    copyColumns.splice(columnIndex, 1, { ...column, title: event.target.value });
    dispatch(editColumn({ columns: copyColumns }));
  };
  return (
    <LabelInput
      fullWidth
      value={column.title}
      onChange={handleColumnRename}
      sx={{
        mb: 1.5,
        fontWeight: 500,
        '& input:focus': {
          bgcolor:
            theme.palette.mode === config.mode
              ? theme.palette.secondary.grey[100]
              : theme.palette.grey[50],
        },
        '& input:hover': {
          bgcolor:
            theme.palette.mode === config.mode
              ? theme.palette.secondary.grey[100]
              : theme.palette.grey[50],
        },
        '& input:hover + fieldset': {
          display: 'block',
        },
        '&, & input': { bgcolor: 'transparent' },
        '& fieldset': { display: 'none' },
        '& input:focus + fieldset': { display: 'block' },
      }}
    />
  );
}

EditColumn.propTypes = {
  column: PropTypes.object,
};

export default EditColumn;
