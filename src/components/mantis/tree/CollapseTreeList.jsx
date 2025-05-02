import { useState } from 'react';

// project import
import Transitions from '@components/@extended/Transitions';
import TreeList from './TreeList';
import TreeListItem from './TreeListItem';
import MainCard from '../MainCard';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// MUI
import { Box, Button } from '@mui/material';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import Measure from 'react-measure';
//import { SizeMe } from 'react-sizeme';
import { useTheme } from '@mui/material/styles';

function CollapseTreeList({ children, menuData = [], defaultOpen = false, btnDisplay = false }) {
  const theme = useTheme();
  // 조건부 아코디언 flag 값
  const [open, setOpen] = useState(defaultOpen);
  // 우클릭 시 contextMenu flag 값
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };
  const measureRef = useRef(null);
  return (
    <Measure bounds onResize={(contentRect) => setSize(contentRect.bounds)}>
      {({ measureRef }) => (
        <Box
          ref={measureRef}
          sx={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            marginRight: '5px',
            zIndex: 1,
          }}
        >
          <Transitions
            type="collapse"
            sx={{
              height: '100%',
              '& .MuiCollapse-wrapper': {
                flexDirection: 'column',
              },
              '& .MuiCollapse-wrapperInner': {
                width: '300px',
              },
              '& .MuiCollapse-horizontal': {
                height: '100%',
              },
            }}
            orientation="horizontal"
            in={open}
          >
            <MainCard
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '0',
                borderColor: theme.palette.grey[300],
                zIndex: 1,
                '&.MuiPaper-root': {
                  maxHeight: `${size.height}px`,
                },
              }}
              contentSX={{ height: '100%' }}
              onContextMenu={handleContextMenu}
            >
              {children}

              {menuData.length !== 0 && (
                <Menu
                  open={contextMenu !== null}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    contextMenu !== null
                      ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                      : undefined
                  }
                >
                  {menuData.map((data, index) => (
                    <MenuItem key={index} onClick={handleClose}>
                      {data}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </MainCard>
          </Transitions>
          {!btnDisplay ? (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => setOpen(!open)}
              sx={{
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.grey[600],
                borderRadius: '0 4px 4px 0',
                padding: '7px',
                minWidth: '10px',
                maxWidth: '10px',
                maxHeight: 'inherit !important',
                height: 'inherit !important',
                fontSize: 'smaller',
                boxShadow: `inset 0px 0px 2px 1px ${theme.palette.grey[200]}`,
              }}
            >
              {open ? <LeftOutlined /> : <RightOutlined />}
            </Button>
          ) : null}
        </Box>
      )}
    </Measure>
  );
}

export default CollapseTreeList;
