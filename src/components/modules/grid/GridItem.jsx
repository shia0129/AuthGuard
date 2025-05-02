import { Grid } from '@mui/material';
import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// flex 속성 값 치환 함수.
const convertOption = (value) => {
  switch (value) {
    case 'start':
      return 'flex-start';
    case 'end':
      return 'flex-end';
    default:
      return value;
  }
};

const GridChildren = ({
  list,
  xs,
  sm,
  md,
  lg,
  xl,
  columns,
  borderFlag,
  borderFlagStyle,
  className,
}) => {
  if (Array.isArray(list)) {
    return list.map((data, index) => {
      if (data) {
        let spanXs, spanSm, spanMd, spanLg, spanXl;
        let ratioXs = xs,
          ratioSm = sm,
          ratioMd = md,
          ratioLg = lg,
          ratioXl = xl;
        const colSpan = data.props?.colSpan;

        const childRatioXs = data.props?.xs;
        const childRatioSm = data.props?.sm;
        const childRatioMd = data.props?.md;
        const childRatioLg = data.props?.lg;
        const childRatioXl = data.props?.xl;

        if (childRatioXs) ratioXs = childRatioXs;
        if (childRatioSm) ratioSm = childRatioSm;
        if (childRatioMd) ratioMd = childRatioMd;
        if (childRatioLg) ratioLg = childRatioLg;
        if (childRatioXl) ratioXl = childRatioXl;

        if (colSpan) {
          spanXs = ratioXs * colSpan;
          spanSm = ratioSm * colSpan;
          spanMd = ratioMd * colSpan;
          spanLg = ratioLg * colSpan;
          spanXl = ratioXl * colSpan;
        }

        return data.props?.childtype === 'dom' ? (
          <GridItem
            className={className}
            key={index}
            item
            xs={xs || columns}
            sm={sm || columns}
            md={md || columns}
            lg={lg || columns}
            xl={xl || columns}
            sx={{
              ...(borderFlag && borderFlagStyle),
            }}
          >
            {data}
          </GridItem>
        ) : (
          <GridItem
            className={className}
            key={index}
            item
            xs={spanXs || ratioXs}
            sm={spanSm || ratioSm}
            md={spanMd || ratioMd}
            lg={spanLg || ratioLg}
            xl={spanXl || ratioXl}
            sx={{
              ...(borderFlag && borderFlagStyle),
            }}
          >
            {data}
          </GridItem>
        );
      }
    });
  } else {
    let spanXs, spanSm, spanMd, spanLg, spanXl;
    let ratioXs = xs,
      ratioSm = sm,
      ratioMd = md,
      ratioLg = lg,
      ratioXl = xl;
    if (!list) return '';
    return list.props?.childtype === 'dom' ? (
      <GridItem
        className={className}
        item
        xs={xs || columns}
        sm={sm || columns}
        md={md || columns}
        lg={lg || columns}
        xl={xl || columns}
        sx={{
          ...(borderFlag && borderFlagStyle),
        }}
      >
        {list}
      </GridItem>
    ) : (
      <GridItem
        className={className}
        item
        xs={spanXs || ratioXs}
        sm={spanSm || ratioSm}
        md={spanMd || ratioMd}
        lg={spanLg || ratioLg}
        xl={spanXl || ratioXl}
        sx={{
          ...(borderFlag && borderFlagStyle),
        }}
      >
        {list}
      </GridItem>
    );
  }
};

/**
 * Grid BreakPoint 속성,
 * 지정한 값의 px 이상의 창 크기에서 적용 할 열 개수를 의미.
 * default: xs={12}
 * ex) xs={12}, 0px 이상의 창 크기에서는 12개의 열을 가진다.
 * @param {Node} children GridItem가 감쌀 자식 컴포넌트.
 * @param {Number} xs 브라우저 가로 0px 이상인 경우 차지하는 컬럼 수.
 * @param {Number} sm 브라우저 가로 768px 이상인 경우 차지하는 컬럼 수.
 * @param {Number} md 브라우저 가로 1024px 이상인 경우 차지하는 컬럼 수.
 * @param {Number} lg 브라우저 가로 1266px 이상인 경우 차지하는 컬럼 수.
 * @param {Number} xl 브라우저 가로 1536px 이상인 경우 차지하는 컬럼 수.
 * @param {Boolean} container Grid Layout Container 여부.
 * @param {Boolean} item Grid Layout Item 여부.
 * @param {Number} divideColumn 여러 개의 자식 컴포넌트를 동일하게 배치하기 위한 컬럼 수.
 * @param {String} direction Grid Container 내부의 item 배치 방향.
 * @param {Number} columns 최대 컬럼 수.
 * @param {Number} spacing Grid Layout Item 행, 열 사이 간격.
 * @param {Number} rowSpacing Grid Layout Item 행 사이 간격.
 * @param {Number} columnSpacing Grid Layout Item 열 사이 간격.
 * @param {String} directionHorizon Grid Layout Container 내부의 item 수평 배치 방향.
 * @param {String} directionVertical Grid Layout Container 내부의 item 수직 배치 방향.
 * @param {Boolean} borderFlag 디자인포맷 적용 여부.
 * @returns MUI Grid 컴포넌트
 */
const GridItem = forwardRef(
  (
    {
      children,
      xs,
      sm,
      md,
      lg,
      xl,
      container,
      item,
      divideColumn,
      direction,
      columns = 12,
      spacing,
      rowSpacing,
      columnSpacing,
      directionHorizon,
      directionVertical,
      borderFlag = false,
      className,
      ...rest
    },
    ref,
  ) => {
    let defaultContainer = false;

    // 아래 속성들은 container 속성이 필수이므로 존재하는 경우, defaultContainer 값 true 설정.
    if (
      direction ||
      directionHorizon ||
      directionVertical ||
      spacing ||
      rowSpacing ||
      columnSpacing
    )
      defaultContainer = true;

    // 반응형 breakPoint 계산.
    let childXs = xs || columns;
    let childSm = sm || columns;
    let childMd = md || columns;
    let childLg = lg || columns;
    let childXl = xl || columns;

    // direction column or column-reverse는 breakPoint 동작x && divideColumn 값 지정 시 계산.
    if ((direction !== 'column' || direction !== 'column-reverse') && divideColumn) {
      childXs /= divideColumn;
      childSm /= divideColumn;
      childMd /= divideColumn;
      childLg /= divideColumn;
      childXl /= divideColumn;
    }
    const theme = useTheme();

    let borderFlagStyle = {
      boxShadow: `0 0 0 1px ${theme.palette.grey[300]}`,
      backgroundColor: theme.palette.grey[0],
    };

    return (
      <Grid
        direction={direction}
        xs={xs}
        sm={sm}
        md={md}
        lg={lg}
        xl={xl}
        container={container || defaultContainer}
        item={item}
        spacing={spacing}
        columns={columns}
        rowSpacing={rowSpacing}
        columnSpacing={columnSpacing}
        justifyContent={convertOption(directionHorizon)}
        alignItems={convertOption(directionVertical)}
        ref={ref}
        // className={className}
        className={className ? 'CMM-gi-grid-' + className : 'CMM-gi-grid'}
        {...rest}
      >
        {divideColumn ? (
          <GridChildren
            className={className ? className + '-children' : 'children'}
            list={children}
            xs={childXs}
            sm={childSm}
            md={childMd}
            lg={childLg}
            xl={childXl}
            columns={columns}
            borderFlag={borderFlag}
            borderFlagStyle={borderFlagStyle}
          />
        ) : (
          children
        )}
      </Grid>
    );
  },
);

GridItem.displayName = 'GridItem';

GridItem.propTypes = {
  /**
   * GridItem가 감쌀 자식 컴포넌트.
   */
  children: PropTypes.any,
  /**
   * 브라우저 가로 0px 이상인 경우 차지하는 컬럼 수. **(Direction Row)**
   */
  xs: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.oneOf(['auto'])]),
  /**
   * 브라우저 가로 768px 이상인 경우 차지하는 컬럼 수. **(Direction Row)**
   */
  sm: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.oneOf(['auto'])]),
  /**
   * 브라우저 가로 1024px 이상인 경우 차지하는 컬럼 수. **(Direction Row)**
   */
  md: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.oneOf(['auto'])]),
  /**
   * 브라우저 가로 1266px 이상인 경우 차지하는 컬럼 수. **(Direction Row)**
   */
  lg: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.oneOf(['auto'])]),
  /**
   * 브라우저 가로 1536px 이상인 경우 차지하는 컬럼 수. **(Direction Row)**
   *
   */
  xl: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.oneOf(['auto'])]),
  /**
   * Grid Layout Container 여부.
   */
  container: PropTypes.bool,
  /**
   * Grid Layout Item 여부.
   */
  item: PropTypes.bool,
  /**
   * 여러 개의 자식 컴포넌트를 동일하게 배치하기 위한 컬럼 수. **(Direction Row)**
   */
  divideColumn: PropTypes.number,
  /**
   * Grid Container 내부의 item 배치 방향.
   * - 배열 혹은 객체 전달 시 반응형 지정 가능.
   * - **배열은 xs, sm, md, lg, xl 순으로 지정**
   * 
```javascript
direction={{sm:'column', lg:'row'}}  

direction={['column-reverse' | 'column' | 'row-reverse' | 'row']}
```
   *
   */
  direction: PropTypes.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
  /**
   * 최대 컬럼 수. **(Direction Row)**
   */
  columns: PropTypes.number,
  /**
   * Grid Layout Item 행, 열 사이 간격.
   */
  spacing: PropTypes.number,
  /**
   * Grid Layout Item 행 사이 간격.
   */
  rowSpacing: PropTypes.number,
  /**
   * Grid Layout Item 열 사이 간격.
   */
  columnSpacing: PropTypes.number,
  /**
   * Grid Layout Container 내부의 item 수평 배치 방향.
   * - **justifyContent**
   */
  directionHorizon: PropTypes.oneOf([
    'start',
    'end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  /**
   * Grid Layout Container 내부의 item 수직 배치 방향.
   * - **alignItems**
   */
  directionVertical: PropTypes.oneOf(['start', 'end', 'center', 'stretch', 'baseline']),
  /**
   * 디자인포맷 적용 여부. **(divideColumn 존재하는 경우)**
   */
  borderFlag: PropTypes.bool,
};
export default GridItem;
