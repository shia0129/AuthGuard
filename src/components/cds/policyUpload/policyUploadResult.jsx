import GridItem from '@components/modules/grid/GridItem';
import MiniTable from '@components/modules/table/MiniTable';
import HsLib from '@modules/common/HsLib';
import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

// MiniTable Columns
const columns = [
  HsLib.makeMiniTableColumn('empty', '', 3, true),
  HsLib.makeMiniTableColumn('default', '기본 정보', 5),
  HsLib.makeMiniTableColumn('object', '객체 정보', 4),
  HsLib.makeMiniTableColumn('schedule', '스케줄 정보', 3),
  HsLib.makeMiniTableColumn('detail', '상세정보', 10),
  HsLib.makeMiniTableColumn('dnat', 'DNAT', 4),
  HsLib.makeMiniTableColumn('snat', 'SNAT', 4),
];

const subColumns = () => {
  const DateRender = (value) => {
    if (value.length === 2) return value;
    else return HsLib.changeDateFormat(value, '$1-$2-$3 $4');
  };

  const ButtonRender = (value = []) => {
    return (
      <GridItem container divideColumn={value.length} spacing={2} sx={{ flexWrap: 'nowrap' }}>
        {value.map((item, index) => (
          <Button
            key={index}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: '#63a3c6',
            }}
          >
            <Typography sx={{ fontSize: '12px' }}>{`${item.name}(${item.value})`}</Typography>
          </Button>
        ))}
      </GridItem>
    );
  };

  return [
    [
      HsLib.makeMiniTableColumn('no', 'no', null, true, {
        textAlign: 'center',
        minWidth: 40,
      }),
      HsLib.makeMiniTableColumn('uploadProcessStatus', '상태', null, true, {
        minWidth: 100,
      }),
      HsLib.makeMiniTableColumn('statusMessage', '상태 메시지', null, true),
      HsLib.makeMiniTableColumn('policyName', '정책명'),
      HsLib.makeMiniTableColumn(
        'systemGroupId',
        '시스템 그룹 ID',
        null,
        null,
        null,
        null,
        'SYSTEM_GROUP_TYPE',
      ),
      HsLib.makeMiniTableColumn(
        'policyDirection',
        '정책방향',
        null,
        null,
        null,
        null,
        'BOUND_TYPE',
      ),
      HsLib.makeMiniTableColumn(
        'serviceMethod',
        '서비스 메소드',
        null,
        null,
        null,
        null,
        'SERVICE_METHOD',
      ),
      HsLib.makeMiniTableColumn('virtualSourceIp', '가상 출발지IP'),
      HsLib.makeMiniTableColumn('destinationIp', '목적지 IP', null, false, null, ButtonRender),
      HsLib.makeMiniTableColumn('destinationPort', '목적지 Port', null, false, null, ButtonRender),
      HsLib.makeMiniTableColumn('sourceIp', '출발지 IP', null, false, null, ButtonRender),
      HsLib.makeMiniTableColumn('description', '설명'),
      HsLib.makeMiniTableColumn('workCycle', '작업주기', null, null, null, null, 'PERIOD_FLAG'),
      HsLib.makeMiniTableColumn('startTime', '시작', null, null, null, DateRender),
      HsLib.makeMiniTableColumn('endTime', '종료', null, null, null, DateRender),
      HsLib.makeMiniTableColumn('enabledType', '활성 여부', null, null, null, null, 'ENABLED_TYPE'),
      HsLib.makeMiniTableColumn(
        'rxTxCheckType',
        'Rx/Tx Check Type',
        null,
        null,
        null,
        null,
        'RX_TX_CHECK_TYPE',
      ),
      HsLib.makeMiniTableColumn('logStatus', '로그기록', null, null, null, null, 'LOG_RECORD_TYPE'),
      HsLib.makeMiniTableColumn('trafficTimeout', '제한시간'),
      HsLib.makeMiniTableColumn('trafficMeasureTime', '측정시간'),
      HsLib.makeMiniTableColumn(
        'monitorStatus',
        '모니터링',
        null,
        null,
        null,
        null,
        'MONITORING_YN',
      ),
      HsLib.makeMiniTableColumn('trafficLimit', '허용량'),
      HsLib.makeMiniTableColumn('trafficIdleTimeout', '세션종료'),
      HsLib.makeMiniTableColumn('option', '옵션'),
      HsLib.makeMiniTableColumn('filter', '필터'),
      HsLib.makeMiniTableColumn('useDnatIp', 'DNAT IP 사용 여부', null, null, null, null, 'USE_YN'),
      HsLib.makeMiniTableColumn('dnatIp', 'DNAT IP'),
      HsLib.makeMiniTableColumn(
        'useDnatPort',
        'DNAT PORT 사용 여부',
        null,
        null,
        null,
        null,
        'USE_YN',
      ),
      HsLib.makeMiniTableColumn('dnatPort', 'DNAT Port'),
      HsLib.makeMiniTableColumn('useSnatIp', 'SNAT IP 사용 여부', null, null, null, null, 'USE_YN'),
      HsLib.makeMiniTableColumn('snatIp', 'SNAT IP'),
      HsLib.makeMiniTableColumn(
        'useSnatPort',
        'SNAT PORT 사용 여부',
        null,
        null,
        null,
        null,
        'USE_YN',
      ),
      HsLib.makeMiniTableColumn('snatPort', 'SNAT Port'),
    ],
  ];
};

function PolicyUploadResult({ titleFlag }) {
  const { uploadFileList } = useSelector((state) => state.policyUpload);
  const { drawerOpen } = useSelector((state) => state.menu);
  return (
    <>
      {Array.isArray(uploadFileList) && uploadFileList.length !== 0 && (
        <>
          <GridItem item>
            <Typography fontWeight="fontWeightBold">{`파일 ${
              titleFlag ? '검증' : '업로드'
            } 결과`}</Typography>
          </GridItem>
          <GridItem item>
            <MiniTable
              sx={{
                subHeadCell: { whiteSpace: 'nowrap' },
                container: { maxWidth: drawerOpen ? 1610 : 1810 },
              }}
              ellipsis
              columns={columns}
              subColumns={subColumns()}
              data={uploadFileList}
            />
          </GridItem>
        </>
      )}
    </>
  );
}

export default PolicyUploadResult;
