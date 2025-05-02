// libraries
import PropTypes from 'prop-types';
import { useState, useEffect,useRef } from 'react';
import { useMediaQuery, Button, Stack, Typography, Tab, Tabs } from '@mui/material';
import { format } from 'date-fns';
import {
  AppstoreOutlined,
  LayoutOutlined,
  LeftOutlined,
  OrderedListOutlined,
  PicCenterOutlined,
  RightOutlined,
} from '@ant-design/icons';

// components
import IconButton from '@components/@extended/IconButton';
import GridItem from '@components/modules/grid/GridItem';

// functions

// constant
const viewOptions = [
  {
    label: '월간',
    value: 'dayGridMonth',
    icon: AppstoreOutlined,
  },
  {
    label: '주간',
    value: 'timeGridWeek',
    icon: LayoutOutlined,
  },
  {
    label: '일간',
    value: 'timeGridDay',
    icon: PicCenterOutlined,
  },
  {
    label: '목록',
    value: 'listWeek',
    icon: OrderedListOutlined,
  },
];

// ==============================|| CALENDAR - TOOLBAR ||============================== //

function Toolbar({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView, ...others }) {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [viewFilter, setViewFilter] = useState(viewOptions);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (matchDownSM) {
      const filter = viewOptions.filter(
        (item) => item.value !== 'dayGridMonth' && item.value !== 'timeGridWeek',
      );
      setViewFilter(filter);
    } else {
      setViewFilter(viewOptions);
    }
  }, [matchDownSM]);

  const handleTabChage = (_, newValue) => {
    onChangeView(newValue);
  };
  return (
    <>
      <GridItem directionVertical="center" container justifyContent="center" {...others}>
        <Stack direction="row" alignItems="center" spacing={matchDownSM ? 1 : 3}>
          <IconButton
            color="secondary"
            onClick={onClickPrev}
            size={matchDownSM ? 'small' : 'large'}
          >
            <LeftOutlined />
          </IconButton>
          <Typography variant={matchDownSM ? 'h4' : 'h3'} color="textPrimary">
            {format(date, 'yyyy.MM')}
          </Typography>
          <IconButton
            color="secondary"
            onClick={onClickNext}
            size={matchDownSM ? 'small' : 'large'}
          >
            <RightOutlined />
          </IconButton>
        </Stack>
        <Button
          color="secondary"
          onClick={onClickToday}
          size={matchDownSM ? 'small' : 'medium'}
          sx={{ fontWeight: 'bold', marginLeft: '0' }}
        >
          오늘
        </Button>
      </GridItem>
      <GridItem>
        <Tabs className="tabGr" value={view} onChange={handleTabChage}>
          {viewFilter.map((viewOption) => {
            return (
              <Tab
                key={viewOption.value}
                size={matchDownSM ? 'small' : 'medium'}
                className={viewOption.value === view ? 'contained' : 'outlined'}
                value={viewOption.value}
                label={viewOption.label}
              />
            );
          })}
        </Tabs>
      </GridItem>
    </>
  );
}

Toolbar.propTypes = {
  date: PropTypes.object,
  view: PropTypes.string,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  onClickToday: PropTypes.func,
  onChangeView: PropTypes.func,
};

export default Toolbar;
