// libraries
import { DeleteOutlined } from '@ant-design/icons';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import EditColumn from './EditColumn';
import AlertColumnDelete from './AlertColumnDelete';
import AddItem from './AddItem';
import GridItem from '@components/modules/grid/GridItem';
import Items from './Items';

// functions
import config from 'src/config';
import { openSnackbar } from '@modules/redux/reducers/snackbar';
import { deleteColumn } from '@modules/redux/reducers/kanban';

// column drag wrapper
const getDragWrapper = (isDragging, draggableStyle, theme, radius) => {
  return {
    minWidth: 250,
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: radius,
    userSelect: 'none',
    margin: `0 ${16}px 0 0`,
    height: '100%',
    ...draggableStyle,
  };
};

// column drop wrapper
const getDropWrapper = (isDraggingOver, theme, radius) => {
  const bgcolor =
    theme.palette.mode === config.mode
      ? theme.palette.background.default
      : theme.palette.secondary.lighter;
  const bgcolorDrop =
    theme.palette.mode === config.mode
      ? theme.palette.text.disabled
      : theme.palette.secondary.light + 65;

  return {
    background: isDraggingOver ? bgcolorDrop : bgcolor,
    padding: '8px 16px 14px',
    width: 'auto',
    borderRadius: radius,
  };
};

// ==============================|| KANBAN BOARD - COLUMN ||============================== //

function Columns({ column, index }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { items, columns, columnsOrder } = useSelector((state) => state.kanban);
  const columnItems = column.itemIds.map((itemId) => items.filter((item) => item.id === itemId)[0]);

  const [open, setOpen] = useState(false);

  const handleColumnDelete = () => {
    setOpen(true);
  };

  const handleClose = (status) => {
    setOpen(false);
    if (status) {
      const copyColumns = [...columns];
      const copyColumnOrder = [...columnsOrder];

      const columnIndex = copyColumns.findIndex((item) => item.id === column.id);
      const orderIndex = copyColumnOrder.findIndex((item) => item === column.id);

      copyColumns.splice(columnIndex, 1);
      copyColumnOrder.splice(orderIndex, 1);

      dispatch(deleteColumn({ columns: copyColumns, columnsOrder: copyColumnOrder }));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
    }
  };

  const nodeRef = useRef(null);
  return (
    <>
      {column && (
        <Draggable draggableId={column.id} index={index} nodeRef={nodeRef}>
          {(provided, snapshot) => (
            <div
              ref={nodeRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getDragWrapper(
                snapshot.isDragging,
                provided.draggableProps.style,
                theme,
                `4px`,
              )}
            >
              <Droppable droppableId={column.id} type="item">
                {(providedDrop, snapshotDrop) => (
                  <div
                    ref={providedDrop.innerRef}
                    {...providedDrop.droppableProps}
                    style={getDropWrapper(snapshotDrop.isDraggingOver, theme, `4px`)}
                  >
                    <GridItem container directionVertical="center" spacing={3}>
                      <GridItem item xs zeroMinWidth>
                        <EditColumn column={column} />
                      </GridItem>
                      <GridItem item sx={{ mb: 1.5 }}>
                        <Tooltip title="Delete Column">
                          <IconButton
                            onClick={handleColumnDelete}
                            aria-controls="menu-simple-card"
                            aria-haspopup="true"
                            color="error"
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                        <AlertColumnDelete
                          title={column.title}
                          open={open}
                          handleClose={handleClose}
                        />
                      </GridItem>
                    </GridItem>
                    {columnItems.map((item, i) => (
                      <Items key={i} item={item} index={i} />
                    ))}
                    {providedDrop.placeholder}
                    <AddItem columnId={column.id} />
                  </div>
                )}
              </Droppable>
            </div>
          )}
        </Draggable>
      )}
    </>
  );
}

Columns.propTypes = {
  column: PropTypes.object,
  index: PropTypes.number,
};

export default Columns;
