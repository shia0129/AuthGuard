import { CloseCircleFilled } from '@ant-design/icons';
import IconButton from '@components/@extended/IconButton';
import { Draggable } from '@hello-pangea/dnd';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createPortal } from 'react-dom';

const QuickMenuItem = ({ item, index, handleDelete }) => {
  const theme = useTheme();

  // item drag wrapper style
  const getDragWrapper = (isDragging, draggableStyle, theme, radius) => {
    const bgcolor = theme.palette.secondary.lighter;
    const bgcolorDrag = theme.palette.secondary.light + 65;

    return {
      userSelect: 'none',
      margin: `0 0 ${8}px 0`,
      padding: 8,
      border: '1px solid',
      borderColor: theme.palette.divider,
      backgroundColor: isDragging
        ? theme.palette.mode === 'dark'
          ? bgcolor
          : bgcolorDrag
        : bgcolor,
      borderRadius: radius,
      ...draggableStyle,
    };
  };

  return (
    <>
      {item && (
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {(provided, snapshot) => {
            const usePortal = snapshot.isDragging;

            const child = (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getDragWrapper(
                  snapshot.isDragging,
                  provided.draggableProps.style,
                  theme,
                  `4px`,
                )}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      display: 'inline-block',
                      width: 'calc(100% - 34px)',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(index)}
                    aria-haspopup="true"
                  >
                    <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                </Stack>
              </div>
            );
            if (!usePortal) return child;
            const portal = document.getElementById('portal');
            return createPortal(child, portal);
          }}
        </Draggable>
      )}
    </>
  );
};

export default QuickMenuItem;
