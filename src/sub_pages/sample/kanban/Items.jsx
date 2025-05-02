// libraries
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { CardMedia, Link, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';
import { ClusterOutlined, MoreOutlined } from '@ant-design/icons';

// components
import IconButton from '@components/@extended/IconButton';
import AlertItemDelete from './AlertItemDelete';
import { selectItem } from '@modules/redux/reducers/kanban';

// functions

// item drag wrapper
const getDragWrapper = (isDragging, draggableStyle, theme, radius) => {
  const bgcolor = theme.palette.background.paper + 99;
  return {
    userSelect: 'none',
    margin: `0 0 ${8}px 0`,
    padding: 16,
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: isDragging ? bgcolor : theme.palette.background.paper,
    borderRadius: radius,
    ...draggableStyle,
  };
};

// ==============================|| KANBAN BOARD - ITEMS ||============================== //

function Items({ item, index }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { userStory, items, columns } = useSelector((state) => state.kanban);

  const itemStory = userStory.filter(
    (story) => story?.itemIds?.filter((itemId) => itemId === item.id)[0],
  )[0];

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openStoryDrawer, setOpenStoryDrawer] = useState(false);

  const handlerDetails = (id) => {
    dispatch(selectItem({ selectedItem: id }));
  };

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalClose = (status) => {
    setOpen(false);
    if (status) {
      //   dispatch(deleteItem(item.id, items, columns, userStory));
      //   dispatch(
      //     openSnackbar({
      //       open: true,
      //       message: 'Task Deleted successfully',
      //       anchorOrigin: { vertical: 'top', horizontal: 'right' },
      //       variant: 'alert',
      //       alert: {
      //         color: 'success'
      //       },
      //       close: false
      //     })
      //   );
    }
  };

  const handleStoryDrawerOpen = () => {
    setOpenStoryDrawer((prevState) => !prevState);
  };

  const editStory = () => {
    setOpenStoryDrawer((prevState) => !prevState);
  };
  const nodeRef = useRef(null);
  return (
    <Draggable  nodeRef={nodeRef} key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={nodeRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getDragWrapper(snapshot.isDragging, provided.draggableProps.style, theme, `4px`)}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: itemStory ? -0.75 : 0 }}
          >
            <Typography
              onClick={() => handlerDetails(item.id)}
              variant="subtitle1"
              sx={{
                display: 'inline-block',
                width: 'calc(100% - 34px)',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                verticalAlign: 'middle',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {item.title}
            </Typography>

            <IconButton
              size="small"
              color="secondary"
              onClick={handleClick}
              aria-controls="menu-comment"
              aria-haspopup="true"
            >
              <MoreOutlined />
            </IconButton>
            <Menu
              id="menu-comment"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              variant="selectedMenu"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  handlerDetails(item.id);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  setOpen(true);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
            <AlertItemDelete title={item.title} open={open} handleClose={handleModalClose} />
          </Stack>
          {itemStory && (
            <>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Tooltip title="User Story">
                  <ClusterOutlined
                    style={{ color: theme.palette.primary.dark, fontSize: '0.75rem' }}
                  />
                </Tooltip>
                <Tooltip title={itemStory.title}>
                  <Link
                    variant="caption"
                    color="primary.dark"
                    underline="hover"
                    onClick={editStory}
                    sx={{ cursor: 'pointer', pt: 0.5 }}
                  >
                    User Story #{itemStory.id}
                  </Link>
                </Tooltip>
              </Stack>
              {/* <EditStory story={itemStory} open={openStoryDrawer} handleDrawerOpen={handleStoryDrawerOpen} /> */}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}
Items.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
};

export default Items;
