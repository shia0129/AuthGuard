import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

import { useLayoutEffect } from 'react';

function BarChart({ id, dataList, chartColor }) {
  useLayoutEffect(() => {
    let root = am5.Root.new(id);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
      }),
    );

    let yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 30 });

    yRenderer.grid.template.set('visible', false);

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: 'label',
        renderer: yRenderer,
        visible: false,
      }),
    );

    let xRenderer = am5xy.AxisRendererX.new(root, {});
    // xRenderer.grid.template.set('visible', false);

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 100,
        renderer: xRenderer,
        visible: false,
      }),
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Series 1',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'value',
        categoryYField: 'label',
        fill: am5.color(chartColor),
      }),
    );

    let columnTemplate = series.columns.template;

    columnTemplate.setAll({
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
    });

    let data = dataList;

    yAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);

    chart.appear(1000, 100);
  });

  return (
    <div
      id={id}
      style={{ width: '100%', height: '50px', marginTop: '-10px', marginBottom: '-9px' }}
    />
  );
}

export default BarChart;
