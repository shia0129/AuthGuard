import NextLink from 'next/link';
import { useEffect, useRef, useState } from 'react';
import HsLib from '@modules/common/HsLib';
import { Box, Button, Link, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setGridCodeCache } from '@modules/redux/reducers/code';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    maxWidth: 230,
  },
}));

export const DefaultCell = ({ props, tableCellWidth }) => {
  const currentCellWidthRef = useRef();
  const buttonRef = useRef();
  const dispatch = useDispatch();

  const [toolTipOpen, setToolTipOpen] = useState(false);

  const { AllCodeList, gridCodeCache } = useSelector((state) => state.common);
  const { value: initialValue, column, cell, row } = props;

  let initValue = initialValue;

  let codeInfo = null;
  const useEffect_0001 = useRef(false);
  // Code Cell type 캐싱 업데이트 로직
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    if (column.cellType === 'Z' && codeInfo) {
      dispatch(
        setGridCodeCache({
          name: column.id,
          value: { [codeInfo.codeValue]: codeInfo.codeDesc },
        }),
      );
    }
  }, [codeInfo]);

  if (column.cellType === 'D')
    initValue = HsLib.reactRegisterDateRender(row, '$1-$2-$3', false, column.id);
  if (column.cellType === 'G') initValue = HsLib.reactRegisterDateRender(row, '$1-$2-$3', true);
  if (column.cellType === 'B') initValue = HsLib.changeDateFormat(initialValue, '$1-$2-$3 $4:$5');
  if (column.cellType === 'H') initValue = HsLib.changeDateFormat(initialValue, '$4:$5');
  if (column.cellType === 'O') initValue = HsLib.changeDateFormat(initialValue, '$1-$2');
  if (column.cellType === 'A')
    initValue = HsLib.changeDateFormat(initialValue, '$1-$2-$3 $4:$5:$6');
  if (column.cellType === 'P') initValue = initialValue + '%';
  if (column.cellType === 'U') initValue = HsLib.bytesToSize(initialValue);
  if (column.cellType === 'I') {
    if (typeof initialValue === 'string' && Number(initialValue)) {
      initValue = Number(initialValue).toLocaleString().toString();
    } else if (typeof initialValue === 'number') {
      initValue = initialValue?.toLocaleString();
    }
  }
  if (column.cellType === 'C') {
    initValue = column.valueOptions.find((option) => {
      if (option.value === initValue?.toString()) return option;
    })?.label;
  }

  if (column.cellType === 'Z') {
    const { code, key } = initValue;

    if (code && key) {
      const cacheData = gridCodeCache[`${column.id}`]?.[`${key}`];
      if (!cacheData) {
        codeInfo = AllCodeList.find((item) => code === item.codeType && key === item.codeValue);

        if (codeInfo) {
          initValue = codeInfo.codeDesc;
        }
      } else {
        initValue = cacheData;
      }
    }
  }

  if (column.attributeType === 'C') {
    const renderCell = cell.render('Cell');

    return (
      <Box
        className="CMM-rt-defaultCell-cType-bootstrapTooltip-box"
        sx={{
          m: 0,
          display: 'inline-block',
          width: 1,
          '& a,p': {
            maxWidth:
              tableCellWidth > 0
                ? tableCellWidth > column.width
                  ? tableCellWidth
                  : column.width
                : '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        {renderCell}
      </Box>
    );
  }

  if (column.attributeType === 'B') {
    return (
      <>
        {'buttonProps' in column ? (
          <Button
            {...column.buttonProps}
            ref={buttonRef}
            variant={column.buttonProps.variant || 'contained'}
            onClick={(event) => {
              if (typeof column?.buttonCallback === 'function')
                column.buttonCallback({ event, cell });
            }}
            sx={{ maxHeight: '100%', width: '100%', ...column.buttonProps.sx }}
          >
            {column.buttonProps?.contents || initValue}
          </Button>
        ) : (
          <Link
            className="CMM-rt-defaultCell-bType-bootstrapTooltip-link"
            onClick={(event) => {
              if (typeof column?.buttonCallback === 'function')
                column.buttonCallback({ event, cell });
            }}
            underline="none"
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              wordBreak: 'break-word',
              color: '#008ABB',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <Box
              ref={buttonRef}
              component="p"
              sx={{ m: 0, display: 'inline-block' }}
              className="CMM-rt-defaultCell-bType-bootstrapTooltip-link-box"
            >
              {initValue}
            </Box>
          </Link>
        )}
      </>
    );
  }

  if (
    'link_url' in row['original'] &&
    typeof initValue === 'string' &&
    initValue.includes('DENY') &&
    initValue.includes('Banned')
  ) {
    const link_url = row['original']['link_url'];

    const parseLog = (logString) => {
      const result = {};
      const actionMatch = logString.match(/^(ALLOW|DENY)/);
      if (actionMatch) {
        result.action = actionMatch[0];
      }

      const regex = /(\w+):(?:"([^"]+)"|([^\s]+))/g; // 키:값 파싱
      let match;
      while ((match = regex.exec(logString)) !== null) {
        const key = match[1];
        const value = match[2] || match[3];
        result[key] = value;
      }

      return result;
    };

    const { Method, ResponseCode, URL, policy_no, reason, src, useragent } = parseLog(initValue);
    const encodedParams = new URLSearchParams({
      url: URL,
      reason: reason,
      ip: src,
      group: 'group' + policy_no,
    }).toString();

    const link_page = `${link_url}?${encodedParams}`;

    return (
      <a
        href={link_page}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none' }}
      >
        <BootstrapTooltip
          className="CMM-rt-defaultCell-bootstrapTooltip"
          title={initValue || ''}
          placement="top"
          open={toolTipOpen}
          onMouseOver={() => {
            if (!toolTipOpen) setToolTipOpen(currentCellWidthRef.current > tableCellWidth);
          }}
          onMouseLeave={() => {
            if (toolTipOpen) setToolTipOpen(!toolTipOpen);
          }}
        >
          <Typography
            className="CMM-rt-defaultCell-bootstrapTooltip-typography"
            ref={(ref) => {
              if (!currentCellWidthRef.current && ref)
                currentCellWidthRef.current = ref.offsetWidth;
            }}
            sx={{
              display: 'inline-block',
              ...(currentCellWidthRef.current > tableCellWidth && {
                maxWidth: tableCellWidth,
                textOverflow: 'ellipsis',
              }),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {initValue}
          </Typography>
        </BootstrapTooltip>
        {/* </NextLink> */}
      </a>
    );
  }

  return (
    <BootstrapTooltip
      className="CMM-rt-defaultCell-bootstrapTooltip"
      title={initValue || ''}
      placement="top"
      open={toolTipOpen}
      onMouseOver={() => {
        if (!toolTipOpen) setToolTipOpen(currentCellWidthRef.current > tableCellWidth);
      }}
      onMouseLeave={() => {
        if (toolTipOpen) setToolTipOpen(!toolTipOpen);
      }}
    >
      <Typography
        className="CMM-rt-defaultCell-bootstrapTooltip-typography"
        ref={(ref) => {
          if (!currentCellWidthRef.current && ref) currentCellWidthRef.current = ref.offsetWidth;
        }}
        sx={{
          display: 'inline-block',
          ...(currentCellWidthRef.current > tableCellWidth && {
            maxWidth: tableCellWidth,
            textOverflow: 'ellipsis',
          }),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {initValue}
      </Typography>
    </BootstrapTooltip>
  );
};
