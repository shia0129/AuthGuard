import AmChart5Lib from '@modules/common/AmChart5Lib';
import { useLayoutEffect } from 'react';

/**
 * Am Chart5 XY Chart 컴포넌트.
 * @param {Object} object id: 차트 생성을 위한 div id / style: 차트에 적용할 스타일 / theme: 차트 테마값
 *                        chartData: 차트 생성을 위한 메타데이터
 *                             ㄴ x: x축 key 값 (넘겨준 data에서 선택)
 *                             ㄴ seriesData: 각 라인 데이터 정보 (label: 라인 명, y: y축 key 값 (넘겨준 data에서 선택)
 *                                            fill: 라인 채우기 생상, stroke: 라인 색상, fillOpacity: 라인 채우기 투명도)
 *                             ㄴ data: 차트에 넘겨 줄 데이터 객체 목록.
 *                             ㄴ legendData: 범례 설정.
 *                                ㄴ x: x좌표
 *                                ㄴ y: y좌표
 *                                ㄴ layout: 레이아웃
 *                        customHandler: 차트 혹은 선 설정 변경 핸들러.
 * @returns XY Chart 컴포넌트
 */
function XYChart5_tmp({
  id,
  style = {},
  theme,
  chartData = {
    x: '',
    tooltipText: '',
    seriesData: [{ label: '', y: '', fill: '', stroke: '', fillOpacity: 0 }],
    data: [],
    legendData: {
      x: '',
      y: '',
      layout: '',
    },
  },
  customHandler = null,
}) {
  const { x, seriesData, data, tooltipText, legendData } = chartData;

  useLayoutEffect(() => {
    let rootRef;
    const loadChart = async () => {
      const { root, chart, xAxis, yAxis, legend } = await AmChart5Lib.hss_createXYChart({
        id,
        theme,
        legendData,
      });
      rootRef = root;
      seriesData.map((item, index) => {
        const series = AmChart5Lib.hss_createLineSeries({
          root,
          chart,
          data,
          name: item.label,
          xAxis,
          yAxis,
          valueX: x,
          valueY: item.y,
          fill: item.fill,
          stroke: item.stroke,
          fillOpacity: item.fillOpacity,
          tooltipText,
        });
        // 생성된 객체 전달받은 함수로 실행.
        if (customHandler && typeof customHandler === 'function') {
          /**
           * chart, 선 객체, 선 객체 인덱스 순으로 파라미터 전달.
           * 호출부에서 함수 정의 후 사용.
           *  */
          customHandler(chart, series, index + 1);
        }
      });

      legend.data.setAll(chart.series.values);

      return root;
    };

    const timeout = setTimeout(loadChart, 0);

    return () => {
      clearTimeout(timeout);
      if (rootRef) rootRef.dispose();
    };
  }, []);
  return <div id={id} style={{ width: '100%', height: 'inherit', fontSize: '12px', ...style }} />;
}

export default XYChart5_tmp;
