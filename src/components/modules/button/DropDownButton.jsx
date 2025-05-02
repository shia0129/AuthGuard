import {
  ButtonGroup,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState, useEffect, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

/**
 * 분할버튼 기능을 수행하는 함수.
 * @param {Array} datas arrow button 클릭시 보여질 데이터.
 * @param {Object} buttonProps button 관련 추가 설정 옵션. (groupProps: 버튼 그룹, labelProps: 첫 번째 버튼, dropPorps: 두 번째 버튼)
 * @param {Object} transitionProps transition 관련 추가 설정 옵션. (popperProps: popper, itemOnClick: drop down 버튼)
 * @param {Function} setIndex 호출 부에 선택된 아이템의 인덱스 값을 전달하는 함수.
 */
const DropDownButton = ({
  datas = [],
  buttonProps = { groupProps: {}, labelProps: {}, dropProps: {} },
  transitionProps = { popperProps: {}, itemOnclick: () => {} },
  setIndex = 0,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const { groupProps, labelProps, dropProps } = buttonProps;
  const { popperProps, itemOnclick } = transitionProps;
  const onClickHandler = datas[`${selectedIndex}`]?.['onClick'];

  const buttonGroupRef = useRef(null);
  const useEffect_0001 = useRef(false);
  // 초기 렌더링 시, 선택된 아이템의 index 값.
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (setIndex) setIndex(0);
  }, []);

  // 화살표 버튼 클릭 이벤트
  const handleToggle = () => {
    setOpen(!open);
  };

  // 클릭해제 이벤트 감지시 실행
  const handleClose = (event) => {
    if (buttonGroupRef.current && buttonGroupRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleMenuItemClick = (event, index) => {
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      if (setIndex) setIndex(index);
      setSelectedIndex(index);
      setOpen(false);
      // 호출 부에서 전달된 추가 실행 함수.
      itemOnclick(datas[`${index}`], index);
    });
  };

  return (
    <>
      <ButtonGroup ref={buttonGroupRef} sx={{ width: '100%' }} {...groupProps}>
        <Button
          onClick={onClickHandler}
          variant="contained"
          size="small"
          sx={{ width: '100%' }}
          {...labelProps}
        >
          {datas[`${selectedIndex}`]?.['label']}
        </Button>
        <Button variant="contained" onClick={handleToggle} size="small" {...dropProps}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        sx={{
          zIndex: 1,
        }}
        anchorEl={buttonGroupRef.current}
        transition
        {...popperProps}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper sx={{ width: `${buttonGroupRef.current.offsetWidth}px` }}>
              {/* ClickAwayListener : 클릭 이벤트가 하위 요소 외부에서 발생하는 시기를 감지 */}
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="menuListId">
                  {datas.map(({ label }, index) => (
                    <MenuItem onClick={(event) => handleMenuItemClick(event, index)} key={index}>
                      {label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default DropDownButton;
