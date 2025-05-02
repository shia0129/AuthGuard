'use client'; 
import PropTypes from 'prop-types';
import Image from 'next/image';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';

// material-ui
import { ButtonBase } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
/*
import largeWhiteHanssak from '@public/images/logo.svg';
import largeBlackHanssak from '@public/images/logoColor.svg';
import smallWhiteHanssak from '@public/images/minilogo.svg';
import smallBlackHanssak from '@public/images/minLogoColor.svg';
*/
import Search from '../../Header/HeaderContent/Search';
import useConfig from '@modules/hooks/useConfig';

// ==============================|| DRAWER HEADER ||============================== //

const largeWhiteHanssak = '/images/logo.svg';
const largeBlackHanssak = '/images/logoColor.svg';
const smallWhiteHanssak = '/images/minilogo.svg';
const smallBlackHanssak = '/images/minLogoColor.svg';

const myLoader = ({ src }) => {
  return src; // 정적 경로 그대로 반환
};

const DrawerHeader = ({ open }) => {
  const { data: session } = useSession();
  const { menuMode, mode } = useConfig();

  const firstPage = session?.user?.firstPage || '/';

  return (
    <>
      <DrawerHeaderStyled open={open}>
        <NextLink href={firstPage} passHref>
          <ButtonBase disableRipple>
            {open ? (
              <Image
                loader={myLoader}
                unoptimized
                src={
                  mode !== 'dark' && (menuMode === 'light' || menuMode === 'gray')
                    ? largeBlackHanssak
                    : largeWhiteHanssak
                }
                alt="Hanssak"
                width={200}
                height={60}
                priority
              />
            ) : (
              <Image
                loader={myLoader}
                unoptimized
                src={
                  mode !== 'dark' && (menuMode === 'light' || menuMode === 'gray')
                    ? smallBlackHanssak
                    : smallWhiteHanssak
                }
                alt="Hanssak"
                width={30}
                height={30}
              />
            )}
          </ButtonBase>
        </NextLink>
      </DrawerHeaderStyled>
      {open && <Search />}
    </>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool,
};

export default DrawerHeader;
