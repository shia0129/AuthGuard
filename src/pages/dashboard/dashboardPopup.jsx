import Layout from '@components/layouts';
// Icon

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';

import dynamic from 'next/dynamic';

const SystemDashboardPopup = dynamic(() => import('./systemDashboardPopup'), { ssr: false });
const SslvaDashboardPopup = dynamic(() => import('./sslvaDashboardPopup'), { ssr: false });
const SslswgDashboardPopup = dynamic(() => import('./sslswgDashboardPopup'), { ssr: false });

import { Box, IconButton } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';
// project import

const firstPageIndex = 0;
const lastPageIndex = 2;

function DashboardPopup() {
  const [swiper, setSwiper] = useState(null);
  const divElementRef = useRef(null);
  const mouseMoveTimer = useRef(null);
  const rightButtonRef = useRef(null);
  const leftButtonRef = useRef(null);

  const fullscreenFlag = useRef(false);
  const [renderFlag, setRenderFlag] = useState(true);

  const rightSwipePage = useCallback(
    (currentIndex) => {
      if (currentIndex !== lastPageIndex) {
        const nextIndex = currentIndex + 1;
        swiper.slideTo(nextIndex);
      }
    },
    [swiper],
  );

  const leftSwipePage = useCallback(
    (currentIndex) => {
      if (currentIndex !== firstPageIndex) {
        const nextIndex = currentIndex - 1;
        swiper.slideTo(nextIndex);
      }
    },
    [swiper],
  );

  const onSlideEvent = useCallback(() => {
    const idx = swiper.activeIndex;
    if (idx === firstPageIndex) {
      leftButtonRef.current.style.opacity = 0; // 숨기기
      leftButtonRef.current.style.pointerEvents = 'none'; // 클릭 불가능하게 만들기
    } else {
      leftButtonRef.current.style.opacity = 0.4;
      leftButtonRef.current.style.pointerEvents = 'auto'; // 클릭 가능하게 만들기
    }

    if (idx === lastPageIndex) {
      rightButtonRef.current.style.opacity = 0; // 숨기기
      rightButtonRef.current.style.pointerEvents = 'none'; // 클릭 불가능하게 만들기
    } else {
      rightButtonRef.current.style.opacity = 0.4;
      rightButtonRef.current.style.pointerEvents = 'auto'; // 클릭 가능하게 만들기
    }
  }, [swiper]);

  useEffect(() => {
    const divElement = divElementRef.current;

    divElement.addEventListener('mousemove', () => {
      if (mouseMoveTimer.current !== undefined) {
        clearTimeout(mouseMoveTimer.current);
      }

      if (leftButtonRef.current)
        if (swiper?.activeIndex === firstPageIndex) {
          leftButtonRef.current.style.opacity = 0; // 숨기기
          leftButtonRef.current.style.pointerEvents = 'none'; // 클릭 불가능하게 만들기
        } else {
          leftButtonRef.current.style.opacity = 0.4;
          leftButtonRef.current.style.pointerEvents = 'auto'; // 클릭 가능하게 만들기
        }

      if (rightButtonRef.current)
        if (swiper?.activeIndex === lastPageIndex) {
          rightButtonRef.current.style.opacity = 0; // 숨기기
          rightButtonRef.current.style.pointerEvents = 'none'; // 클릭 불가능하게 만들기
        } else {
          rightButtonRef.current.style.opacity = 0.4;
          rightButtonRef.current.style.pointerEvents = 'auto'; // 클릭 가능하게 만들기
        }

      mouseMoveTimer.current = setTimeout(() => {
        rightButtonRef.current.style.opacity = 0;
        leftButtonRef.current.style.opacity = 0;
      }, 300);
    });

    // 키 이벤트 리스너 추가
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        // 오른쪽 화살표키
        rightSwipePage(swiper.activeIndex);
      } else if (event.key === 'ArrowLeft') {
        // 왼쪽 화살표키
        leftSwipePage(swiper.activeIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [swiper]);

  const toggleFullScreen = (elem) => {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setRenderFlag((prev) => !prev);
      fullscreenFlag.current = true;
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setRenderFlag((prev) => !prev);
      fullscreenFlag.current = false;
    }
  };

  // F11 키 눌렀을 때 전체화면 토글 처리
  const handleKeyDown = (event) => {
    if (event.key === 'F11') {
      event.preventDefault(); // F11의 기본 동작 (브라우저의 전체화면) 막기
      toggleFullScreen(document.documentElement); // 전체화면 토글
    }
  };
  // F11와 Fullscreen 버튼 눌렀을 때 연계 동작을 위함.
  // F11 키 누를 때 fullscreenFlag.current 값 변경을 위함.
  useEffect(() => {
    // F11 키 눌렀을 때 전체화면 상태 변경
    window.addEventListener('keydown', handleKeyDown);

    // 전체화면 상태 변화시 처리
    const handleFullscreenChange = () => {
      fullscreenFlag.current = !!document.fullscreenElement;
      setRenderFlag((prev) => !prev); // 상태가 변하면 리렌더링
    };

    // 전체화면 변경 이벤트 리스너 추가
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Box
      className="page-container"
      sx={{
        fontSize: '32pxs',
        background: '#1F2B48',
        '&::after': swiper
          ? {
              content: '""',
              width: 1,
              height: 45,
              bgcolor: '#1E232E',
              display: 'inline-block',
              position: 'absolute',
              top: 0,
              left: 0,
            }
          : {},
      }}
      ref={divElementRef}
    >
      <div>
        <Swiper
          className="home-banner"
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          onSwiper={setSwiper}
          onSlideChange={onSlideEvent}
        >
          <SwiperSlide>
            <SystemDashboardPopup
              fullscreenFlag={fullscreenFlag}
              renderFlag={renderFlag}
              setRenderFlag={setRenderFlag}
            />
          </SwiperSlide>
          <SwiperSlide>
            <SslvaDashboardPopup
              fullscreenFlag={fullscreenFlag}
              renderFlag={renderFlag}
              setRenderFlag={setRenderFlag}
            />
          </SwiperSlide>
          <SwiperSlide>
            <SslswgDashboardPopup
              fullscreenFlag={fullscreenFlag}
              renderFlag={renderFlag}
              setRenderFlag={setRenderFlag}
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <IconButton
        sx={{
          position: 'absolute',
          top: 350,
          right: 0,
          left: null,
          height: '135px',
          width: '150px',
          zIndex: 1001,
          opacity: 0,
          transition: 'opacity 1s',
          color: '#fff',
        }}
        ref={rightButtonRef}
        size="large"
        onClick={() => rightSwipePage(swiper.activeIndex)}
      >
        <KeyboardArrowRight sx={{ fontSize: '150px' }} />
      </IconButton>

      <IconButton
        sx={{
          position: 'absolute',
          top: 350,
          right: null,
          left: 0,
          height: '135px',
          width: '150px',
          zIndex: 1001,
          opacity: 0,
          transition: 'opacity 1s',
          color: '#fff',
        }}
        ref={leftButtonRef}
        size="large"
        onClick={() => leftSwipePage(swiper.activeIndex)}
      >
        <KeyboardArrowLeft sx={{ fontSize: '150px' }} />
      </IconButton>
    </Box>
  );
}

DashboardPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="monPopup" title="시스템 모니터링" isDashboard>
      {page}
    </Layout>
  );
};

export default DashboardPopup;
