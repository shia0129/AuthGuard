import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

import { useLayoutEffect } from 'react';

function PieChart({ id, centerLabel, data }) {
  useLayoutEffect(() => {
    let root = am5.Root.new(id);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(70),
        layout: root.horizontalLayout,
      }),
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'label',
        legendLabelText: '[#fff]{category}[/]',
      }),
    );

    series.data.setAll(data);

    // 차트에 라벨, 값 나오지않게 설정하는 부분
    series.labels.template.set('visible', false);
    series.ticks.template.set('visible', false);

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerY: am5.percent(50),
        y: am5.percent(50),
        layout: root.verticalLayout,
      }),
    );

    // legend label 관련 속성설정
    legend.labels.template.setAll({
      fontSize: 14,
    });
    // label value 형태에서 label만 보여줄 경우
    legend.valueLabels.template.setAll({
      visible: false,
    });
    legend.data.setAll(series.dataItems);

    // 파이차트 가운데 표시될 라벨
    if (centerLabel !== undefined) {
      let label = series.children.push(
        am5.Label.new(root, {
          fontSize: 20,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          populateText: true,
          oversizedBehavior: 'fit',
          fill: am5.color('#fff'),
        }),
      );

      label.set('text', centerLabel);
    }

    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <div id={id} style={{ width: '250px', height: '150px' }} />;
}

export default PieChart;
