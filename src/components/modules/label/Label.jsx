import { Box, InputLabel, Tooltip } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/material/styles';
import ReactTable from '../table/ReactTable';
import GridItem from '../grid/GridItem';
import PropTypes from 'prop-types';

/**
 * Label Input 함수 컴포넌트
 * @param {String} type type명
 * @param {String} label label명
 * @param {Object} labelSx label에 적용할 style
 * @param {Object} labelOptions label 설정 정보.
 * @param {String} data data명
 * @param {Object} dataOptions data 설정 정보.
 * @param {String} direction Label + data 나열 방향
 * @param {Boolean} required label 필수 입력 여부(default false)
 * @param {Boolean} labelBackgroundFlag label background 여부(default false)
 * @param {Object} tableOptions type="table" 인경우 기존 reacttable 설정 정보.
 * @param {Boolean} gridItemNoneFlag gridItem없이 단독으로 쓰이는경우(default false)
 * @param {Boolean} labelOverflow label 내용이 길어질 경우, 표시방법 변경.
 */
function Label({
  type = 'text',
  label,
  labelSx,
  labelOptions,
  data,
  dataTooltipFlag = true,
  dataOptions,
  direction = 'row',
  required = false,
  labelBackgroundFlag = false,
  tableOptions,
  children,
  gridItemNoneFlag = false,
  labelOverflow = false,
  boxSx,
}) {
  const theme = useTheme();
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  return (
    <GridItem
      item
      container
      direction={direction}
      directionVertical={type === 'table' ? 'stretch' : 'center'}
      sx={{
        flexWrap: 'nowrap',
        height: type === 'table' ? 'unset' : '100%',
      }}
      columnSpacing={0}
      divideColumn={type === 'table' || gridItemNoneFlag ? 2 : null}
      borderFlag={(type === 'table' || gridItemNoneFlag) && true}
    >
      {labelBackgroundFlag ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '41px',
            padding: '0 15px',
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            backgroundColor: theme.palette.grey[50],
            borderRight: '1px solid ',
            borderColor: theme.palette.grey[300],
            ...labelSx,
          }}
          className={required ? 'text labelText req' : 'text labelText'}
        >
          {label}
        </div>
      ) : (
        <InputLabel
          className={required ? 'text labelText req' : 'text labelText'}
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '41px',
            padding: '0 15px',
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            ...(!labelOverflow && {
              whiteSpace: 'unset',
              textOverflow: 'unset',
              overflow: 'unset',
            }),
            ...labelSx,
          }}
          {...labelOptions}
        >
          {label}
        </InputLabel>
      )}
      <Box
        sx={{
          padding: type === 'text' ? '0 8px' : 0,
          width: '100%',
          height: '100%',
          minHeight: '41px',
          overflow: 'hidden',
          // label: {
          //   margin: '0 auto !important',
          //   display: 'block !important',
          // },
          ...(type !== 'table' && { display: 'flex', alignItems: 'center' }),
          ...(type === 'text' && { fontSize: '14px' }),
          ...boxSx,
        }}
        childtype="dom"
      >
        {type === 'text' && data ? (
          dataTooltipFlag ? (
            <BootstrapTooltip title={data || ''}>
              <InputLabel {...dataOptions}>{data}</InputLabel>
            </BootstrapTooltip>
          ) : (
            <InputLabel {...dataOptions}>{data}</InputLabel>
          )
        ) : type === 'table' ? (
          <ReactTable {...tableOptions} />
        ) : (
          children
        )}
      </Box>
    </GridItem>
  );
}

Label.displayName = 'Label';

Label.propTypes = {
  /**
   * Label Type.
   */
  type: PropTypes.oneOf(['text', 'table']),
  /**
   * Label 항목.
   */
  label: PropTypes.string,
  /**
   * Label 항목에 적용할 스타일.
   */
  labelSx: PropTypes.object,
  /**
   * MUI 전용 InputLabel API 정보 객체.
   * - **labelBackgroundFlag false인 경우만 동작.**
   * - [InputLabel 속성](https://mui.com/material-ui/api/input-label/)
   */
  labelOptions: PropTypes.object,
  /**
   * Label 데이터.
   */
  data: PropTypes.any,
  /**
   * Label 데이터 Tooltip 표시 여부.
   */
  dataTooltipFlag: PropTypes.bool,
  /**
   * Label 데이터에 적용하고자 하는 MUI 전용 InputLabel API 정보 객체.
   * - [InputLabel 속성](https://mui.com/material-ui/api/input-label/)
   */
  dataOptions: PropTypes.object,
  /**
   * Label 항목 및 데이터 나열 방향.
   */
  direction: PropTypes.oneOf(['row', 'column']),
  /**
   * Label 항목 * 표시 여부.
   */
  required: PropTypes.bool,
  /**
   * Label 항목 디자인 적용 여부.
   */
  labelBackgroundFlag: PropTypes.bool,
  /**
   * table type인 경우, ReactTable 컴포넌트 전달 Props.
   */
  tableOptions: PropTypes.object,
  /**
   * Label Custom 데이터.
   */
  children: PropTypes.any,
  /**
   * Label Border 설정 여부.
   */
  gridItemNoneFlag: PropTypes.bool,
  /**
   * Label 항목 overflow 표시 변경 여부
   */
  labelOverflow: PropTypes.bool,
};

export default Label;
