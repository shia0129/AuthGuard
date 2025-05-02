import { useLayoutEffect } from 'react';
import AmChart5Lib from '@modules/common/AmChart5Lib';

/**
 *
 * @param {Object} object id: 차트 생성을 위한 div id / style: 차트에 적용할 스타일 / theme: 차트 테마값
 *                        chartData: 차트 생성을 위한 메타데이터
 *                             ㄴ innerLabel: 파이차트 중앙 레이블 값.
 *                             ㄴ seriesData: 파이 데이터 정보 (value: 값을 나타내는 key 값, category: 그룹핑 key 값 (넘겨준 data에서 선택))
 *                             ㄴ data: 차트에 넘겨 줄 데이터 객체 목록.
 *                             ㄴ legendData: 범례 설정.
 *                                ㄴ x: x좌표
 *                                ㄴ y: y좌표
 *                                ㄴ layout: 레이아웃
 *                        customHandler: 차트 혹은 선 설정 변경 핸들러.
 * @returns Pie Chart 컴포넌트
 */
function PieChart5({
  id,
  style,
  theme,
  chartData = {
    innerLabel: '',
    seriesData: { value: '', category: '' },
    data: [],
    legendData: {
      label: '',
      x: 200,
      y: 0,
      layout: '',
    },
  },
  customHandler = null,
}) {
  const { seriesData, data, innerLabel, legendData } = chartData;

  useLayoutEffect(() => {
    let rootRef;

    const loadChart = async () => {
      const { root, chart, series, label } = await AmChart5Lib.createPieChart({
        id,
        theme,
        data,
        legendData,
        categoryField: seriesData.category,
        valueField: seriesData.value,
        innerLabel,
      });
      rootRef = root;
      // 생성된 객체 전달받은 함수로 실행.
      if (customHandler && typeof customHandler === 'function') {
        /**
         * root, chart, 파이 객체, 파이 중앙 레이블 객체 순으로 파라미터 전달.
         * 호출부에서 함수 정의 후 사용.
         *  */
        customHandler(root, chart, series, label);
      }
    };

    loadChart();

    return () => {
      if (rootRef) rootRef.dispose();
    };
  }, []);

  return (
    <div
      id={id}
      style={{
        width: '100%',
        height: '100%',
        fontSize: '10px',
        ...style,
      }}
    />
  );
}

export default PieChart5;
