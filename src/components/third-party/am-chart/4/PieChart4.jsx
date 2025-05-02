import AmChart4Lib from '@modules/common/AmChart4Lib';
import { useLayoutEffect } from 'react';

/**
 * Am Chart4 XY Chart 컴포넌트.
 * @param {Object} object id: 차트 생성을 위한 div id / style: 차트에 적용할 스타일 / theme: 차트 테마값
 *                        chartData: 차트 생성을 위한 메타데이터
 *                             ㄴ x: x축 key 값 (넘겨준 data에서 선택)
 *                             ㄴ seriesData: 각 라인 데이터 정보 (label: 라인 명, y: y축 key 값 (넘겨준 data에서 선택)
 *                                            fill: 라인 채우기 생상, stroke: 라인 색상, fillOpacity: 라인 채우기 투명도)
 *                             ㄴ data: 차트에 넘겨 줄 데이터 객체 목록.
 *                             ㄴ legendData: 범례 관련 정보 (position: 범례 위치,)
 *                        customHandler: 차트 혹은 선 설정 변경 핸들러.
 * @returns XY Chart 컴포넌트
 */
function PieChart4({
  id,
  style = { width: '100%', height: '100%', fontSize: '10px' },
  theme,
  chartData = {
    seriesData: { labelText: '' },
    data: [],
    legendData: {
      position: 'top',
    },
  },
  customHandler = null,
}) {
  const { seriesData, data, legendData } = chartData;

  useLayoutEffect(() => {
    const loadChart = async () => {
      // 차트 생성
      const chart = await AmChart4Lib.createPieChart({ id, data, theme, legendData });
      // 계열 생성
      const series = await AmChart4Lib.createPieSeries({ chart });
      // 라벨 생성
      await AmChart4Lib.createLabel({ chart, series, seriesData });
      // 생성된 객체 전달받은 함수로 실행.
      if (customHandler && typeof customHandler === 'function') {
        /**
         * chart, 선 객체, 선 객체 인덱스 순으로 파라미터 전달.
         * 호출부에서 함수 정의 후 사용.
         *  */
        customHandler(chart, series);
      }
    };

    loadChart();
  }, [chartData.data, chartData.seriesData]);

  return <div id={id} style={{ ...style }} />;
}

export default PieChart4;
