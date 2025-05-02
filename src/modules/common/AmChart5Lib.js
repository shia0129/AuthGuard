import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locale_ko_kr from '@amcharts/amcharts5/locales/ko_KR';

/**
 * AM Chart 5 관련 라이브러리.
 */
const AmChart5Lib = {
  /**
   * XY Chart 생성 함수.
   * @param {Object} object id: 차트 생성 div id / theme: 차트 테마. / legendData: 범례 설정.
   * @returns root, chart, xAxis, yAxis, legend가 포함된 객체.
   */
  createXYChart: async ({
    id,
    theme,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    const chartDateFormat = 'yyyy-MM-dd';

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 전역 데이트 포맷 설정,
    root.dateFormatter.set('dateFormat', chartDateFormat);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX: true, // x축 드래그
        panY: true, // y축 드래그
        wheelX: 'panX', // x축 휠 시
        wheelY: 'zoomX', // y축 휙 시
        paddingLeft: -5,
        // paddingTop: 0,
        paddingRight: 20,
        // paddingBottom: 0,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
      }),
    );

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 20,
        }),
        startLocation: 0.5,
        endLocation: 0.5,
      }),
    );

    // x축 그리드 설정.
    xAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 50,
        }),
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 범례 설정 값.
    const { x, y, layout } = legendData;
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: layout ?? root.horizontalLayout,
        position: 'absolute',
        x,
        y,
        useDefaultMarker: true,
        paddingLeft: 20,
        opacity: 0.8,
      }),
    );

    // 범례 항목 설정.
    legend.markers.template.setAll({
      width: 13,
      height: 8,
      // marginRight: 4,
      // marginTop: 0,
    });
    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  /**
   * Line 데이터 생성 함수.
   * @param {Object} object  root: 차트 전역 설정 객체 / chart: 설정이 완료된 chart 객체
   *                         data: 차트 데이터 / name: 데이터 라인명 / xAxis: 설정이 완료된 x축 객체.
   *                         yAxis: 설정이 완료된 y축 객체 / valueX: x축 key 값 / valueY: y축 key 값
   *                         fill: 채우기 색상 / stroke: 라인 색상 / fillOpacity: 채우기 투명도
   *                         tooltipText: 라인 데이터 툴팁
   * @returns 설정이 완료된 데이터 라인 객체
   */
  createLineSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '{name}\n {valueX.formatDate()}: {valueY}',
  }) => {
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name,
        xAxis,
        yAxis,
        valueXField: valueX,
        valueYField: valueY,
        sequencedInterpolation: true,
        sequencedDelay: 100,
        stroke,
        fill,
        fillOpacity,
        strokeWidth: 1,
        tooltip: am5.Tooltip.new(root, {
          labelText: tooltipText,
        }),
      }),
    );

    // 선형 그라데이션 설정.
    series.fills.template.set(
      'fillGradient',
      am5.LinearGradient.new(root, {
        stops: [
          {
            opacity: 0,
            color: am5.color(fill),
            offset: [0, 1],
          },
          {
            opacity: 1,
            color: am5.color(fill),
            offset: [0, 1],
          },
        ],
        rotation: 90,
      }),
    );
    series.fills.template.setAll({
      visible: true,
      fillOpacity: 1,
    });

    // date 형식 데이터 처리기 설정.
    series.data.processor = am5.DataProcessor.new(root, {
      numericFields: [valueY],
      dateFields: [valueX],
      dateFormat: 'yyyy-MM-dd',
    });

    // 데이터 삽입.
    series.data.setAll(data);

    return series;
  },

  // ================================================ 접근제어 모니터링 관련 차트 시작
  createRowBarChart: async ({
    id,
    theme,
    categoryName,
    panX = false,
    panY = false,
    wheelX = 'none',
    wheelY = 'none',
    paddingLeft = 5,
    paddingRight = 5,
    yOption = {},
    xOption = {},
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX, // x축 드래그
        panY, // y축 드래그
        wheelX, // x축 휠 시
        wheelY, // y축 휙 시
        paddingLeft,
        paddingRight,
      }),
    );

    chart.get('colors').set('colors', ['#A7C4D6', '#9CDCAB', '#FFDAB5', '#FFCCBC', '#CDC1C5']);

    chart.zoomOutButton.set('forceHidden', true);

    let yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 1,
      minorGridEnabled: true,
      ...yOption,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: categoryName,
        renderer: yRenderer,
      }),
    );

    // y축 그리드 설정.
    yAxis.get('renderer').grid.template.setAll({
      location: 0.5,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        numberFormatter: am5.NumberFormatter.new(root, {
          numberFormat: '#,###a',
        }),
        extraMax: 0.1,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0,
          minGridDistance: 100,
          ...xOption,
        }),
      }),
    );

    // x축 그리드 설정
    xAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis };
  },

  createColumnSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '{categoryY}: {valueX}',
  }) => {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name,
        xAxis,
        yAxis,
        valueXField: valueX,
        categoryYField: valueY,
        // stroke,
        // fill,
        // fillOpacity,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'left',
          labelText: tooltipText,
        }),
      }),
    );

    series.columns.template.setAll({ cornerRadiusTR: 5, cornerRadiusBR: 5, strokeOpacity: 0 });

    // Make each column to be of a different color
    series.columns.template.adapters.add('fill', function (fill, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    // 데이터 삽입.
    series.data.setAll(data);

    chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
        xAxis: xAxis,
        yAxis: yAxis,
      }),
    );

    return series;
  },

  createBarAndLineChart: async ({
    id,
    theme,
    categoryName,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
    panX = false,
    panY = false,
    wheelX = 'none',
    wheelY = 'none',
    paddingLeft = 5,
    paddingRight = 5,
    yOption = {},
    xOption = {},
    minGridDistance = 20,
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX, // x축 드래그
        panY, // y축 드래그
        wheelX, // x축 휠 시
        wheelY, // y축 휙 시
        paddingLeft,
        paddingRight,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
        layout: root.verticalLayout,
      }),
    );

    chart.zoomOutButton.set('forceHidden', true);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: minGridDistance,
    });

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: categoryName,
        renderer: xRenderer,
      }),
    );

    xAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          strokeOpacity: 0.1,
        }),
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 범례 설정 값.
    const { x, y, layout } = legendData;
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: layout ?? root.horizontalLayout,
        position: 'absolute',
        x: am5.percent(30),
        y,
        useDefaultMarker: true,
        paddingLeft: 20,
        opacity: 0.8,
      }),
    );

    // 범례 항목 설정.
    legend.markers.template.setAll({
      width: 13,
      height: 8,
      // marginRight: 4,
      // marginTop: 0,
    });
    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  createDiffColorBarAndLineChart: async ({
    id,
    theme,
    categoryName,
    legendData = [], // 범례 데이터 기본값 설정
    panX = false,
    panY = false,
    wheelX = 'none',
    wheelY = 'none',
    paddingLeft = 5,
    paddingRight = 5,
    yOption = {},
    xOption = {},
    barColor,
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX, // x축 드래그
        panY, // y축 드래그
        wheelX, // x축 휠 시
        wheelY, // y축 휙 시
        paddingLeft,
        paddingRight,
        orientation: 'horizontal', // 가로 방향으로 변경
      }),
    );

    chart.get('colors').set('colors', barColor);
    chart.zoomOutButton.set('forceHidden', true);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      // yRenderer -> xRenderer로 변경
      minGridDistance: 20,
      minorGridEnabled: true,
      ...xOption, // yOption -> xOption으로 변경
    });

    const xAxis = chart.xAxes.push(
      // yAxis -> xAxis로 변경
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: categoryName,
        renderer: xRenderer, // yRenderer -> xRenderer로 변경
      }),
    );

    xAxis.get('renderer').grid.template.setAll({
      // yAxis -> xAxis로 변경
      location: 0.5,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    const yAxis = chart.yAxes.push(
      // xAxis -> yAxis로 변경
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          strokeOpacity: 0.1,
        }),
      }),
    );

    yAxis.get('renderer').grid.template.setAll({
      // xAxis -> yAxis로 변경
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 범례 설정 값.
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: root.verticalLayout,
        position: 'absolute',
        x: am5.percent(41.5),
        y: am5.percent(-15),
        useDefaultMarker: true,
        paddingLeft: 20,
        opacity: 0.8,
        clickTarget: 'none', // 범례 클릭 이벤트 막기
      }),
    );

    // // 범례에서 색상 박스 제거
    legend.markers.template.setAll({
      width: 0, // 마커 너비 설정
      height: 0, // 마커 높이 설정
    });
    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    legend.labels.template.setAll({
      fontSize: 12, // 글자 크기 설정
      fontWeight: 'bold', // 글자 두께 설정
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  createStatisticsChart: async ({
    id,
    theme,
    categoryName,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
    panX = false,
    panY = false,
    wheelX = 'none',
    wheelY = 'none',
    paddingLeft = 5,
    paddingRight = 5,
    yOption = {},
    xOption = {},
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX, // x축 드래그
        panY, // y축 드래그
        wheelX, // x축 휠 시
        wheelY, // y축 휙 시
        paddingLeft,
        paddingRight,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
        layout: root.verticalLayout,
      }),
    );

    chart.zoomOutButton.set('forceHidden', true);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 80,
    });

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: categoryName,
        renderer: xRenderer,
      }),
    );

    xAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    xAxis.get('renderer').labels.template.setAll({
      fontWeight: '500',
      // centerX: am5.percent(0),
    });

    xAxis.get('renderer').labels.template.adapters.add('centerX', function (value, target) {
      if (xAxis?.dataItems.length !== xAxis.get('renderer').labels.values.length - 1) {
        return am5.percent(10);
      } else {
        return value;
      }
    });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        extraMax: 0.2,
        calculateTotals: true,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          strokeOpacity: 0.1,
        }),
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    yAxis.get('renderer').labels.template.setAll({
      fontWeight: '500',
    });

    // 범례 설정 값.
    const { x, y, layout } = legendData;
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: layout ?? root.horizontalLayout,
        position: 'absolute',
        centerX: am5.p50,
        x: am5.p50,
        y,
        useDefaultMarker: true,
        paddingLeft: 50,
        paddingTop: 5,
        opacity: 1,
      }),
    );

    legend.labels.template.setAll({
      fontSize: 13,
      fontWeight: 'bold',
    });

    // 범례 항목 설정.
    legend.markers.template.setAll({
      width: 13,
      height: 8,
      // marginRight: 4,
      // marginTop: 0,
    });
    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  createStatisticsChart2: async ({
    id,
    theme,
    categoryName,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
    panX = false,
    panY = false,
    wheelX = 'none',
    wheelY = 'none',
    paddingLeft = 5,
    paddingRight = 5,
    yOption = {},
    xOption = {},
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX, // x축 드래그
        panY, // y축 드래그
        wheelX, // x축 휠 시
        wheelY, // y축 휙 시
        paddingLeft,
        paddingRight,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
        layout: root.verticalLayout,
      }),
    );

    chart.zoomOutButton.set('forceHidden', true);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 80,
    });

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: categoryName,
        renderer: xRenderer,
      }),
    );

    xAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    xAxis.get('renderer').labels.template.setAll({
      fontWeight: '500',
      // centerX: am5.percent(0),
    });

    xAxis.get('renderer').labels.template.adapters.add('centerX', function (value, target) {
      if (xAxis?.dataItems.length !== xAxis.get('renderer').labels.values.length - 1) {
        return am5.percent(10);
      } else {
        return value;
      }
    });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        extraMax: 0.4,
        calculateTotals: true,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          strokeOpacity: 0.1,
        }),
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    yAxis.get('renderer').labels.template.setAll({
      fontWeight: '500',
    });

    // 범례 설정 값.
    const { x, y, layout } = legendData;
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: am5.GridLayout.new(root, {
          maxColumns: 6,
          fixedWidthGrid: false,
        }),
        position: 'absolute',
        centerX: am5.p50,
        x: am5.p50,
        // y: am5.p0,
        useDefaultMarker: true,
        opacity: 1,
      }),
    );

    legend.labels.template.setAll({
      fontSize: 13,
      fontWeight: 'bold',
    });

    // 범례 항목 설정.
    legend.markers.template.setAll({
      width: 13,
      height: 8,
      // marginRight: 4,
      // marginTop: 0,
    });
    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  createBarSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    barMaxWidth = 13,
  }) => {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name,
        stacked: true,
        xAxis,
        yAxis,
        categoryXField: valueX,
        valueYField: valueY,
        stroke,
        fill,
        fillOpacity,
      }),
    );

    series.columns.template.setAll({ maxWidth: barMaxWidth });
    // 데이터 삽입.
    series.data.setAll(data);

    return series;
  },

  createStatisticsBarSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
  }) => {
    const tooltip = am5.Tooltip.new(root, {
      pointerOrientation: 'horizontal',
      getFillFromSprite: false,
      autoTextColor: false,
    });

    tooltip.get('background').setAll({
      fill: am5.color(0x2f2f2f),
      fillOpacity: 0.8,
      stroke: am5.color(0x2f2f2f),
      strokeOpacity: 0.8,
    });
    tooltip.label.setAll({
      fill: am5.color(0xffffff),
    });

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name,
        stacked: true,
        xAxis,
        yAxis,
        categoryXField: valueX,
        valueYField: valueY,
        valueYShow: 'valueYTotal',
        stroke,
        fill,
        fillOpacity,
        tooltip,
      }),
    );

    series.get('tooltip').label.adapters.add('text', function (text) {
      text = '[bold]{categoryX}[/]';
      chart.series.each(function (series) {
        if (series.isHidden()) return;
        let tooltipDataItem = series.get('tooltipDataItem');
        if (tooltipDataItem) {
          if (['총 건수', 'Total Count'].includes(series.get('name'))) {
            text +=
              '\n　[/] [bold width:100px]' +
              series.get('name') +
              ':[/] ' +
              tooltipDataItem.get('valueYTotal');
          } else {
            text +=
              '\n[' +
              series.get('stroke').toString() +
              ']■[/] [bold width:100px]' +
              series.get('name') +
              ':[/] ' +
              tooltipDataItem.get('valueY');
          }
        }
      });
      return text;
    });

    // 데이터 삽입.
    series.data.setAll(data);

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: '{valueYTotal}',
          centerY: am5.percent(80),
          centerX: am5.p50,
          fontSize: 12,
          fontWeight: '500',
          populateText: true,
        }),
      });
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          strokeWidth: 1,
          stroke,
          radius: 2,
          fill: stroke,
        }),
      });
    });

    return series;
  },

  createBarLineSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipTitleField, // 툴팁상단 제목에 설정할 필드명 -> 없으면 categoryX 값으로 해준다.
  }) => {
    const tooltip = am5.Tooltip.new(root, {
      pointerOrientation: 'horizontal',
      getFillFromSprite: false,
      autoTextColor: false,
    });

    tooltip.get('background').setAll({
      fill: am5.color(0x2f2f2f),
      fillOpacity: 0.8,
      stroke: am5.color(0x2f2f2f),
      strokeOpacity: 0.8,
    });
    tooltip.label.setAll({
      fill: am5.color(0xffffff),
    });

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name,
        xAxis,
        yAxis,
        categoryXField: valueX,
        valueYField: valueY,
        stroke,
        fill,
        fillOpacity,
        tooltip,
      }),
    );

    series.get('tooltip').label.adapters.add('text', function (text) {
      text =
        tooltipTitleField !== null && tooltipTitleField !== undefined && tooltipTitleField !== ''
          ? `[bold]{${tooltipTitleField}}[/]`
          : '[bold]{categoryX}[/]';
      chart.series.each(function (series) {
        let tooltipDataItem = series.get('tooltipDataItem');
        if (tooltipDataItem) {
          text +=
            '\n[' +
            series.get('stroke').toString() +
            ']■[/] [bold width:70px]' +
            series.get('name') +
            ':[/] ' +
            tooltipDataItem.get('valueY');
        }
      });
      return text;
    });

    series.strokes.template.setAll({
      strokeWidth: 2,
    });

    // 데이터 삽입.
    series.data.setAll(data);

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          strokeWidth: 2,
          stroke,
          radius: 2,
          fill: stroke,
        }),
      });
    });

    return series;
  },

  createDonutChart: async ({ id, theme, data, categoryField, valueField, innerLabel }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 파이차트 객체 생성.
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(55),
        radius: am5.percent(80),
        layout: root.verticalLayout,
      }),
    );

    // 파이 객체 설정.
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField,
        categoryField,
      }),
    );

    series.get('colors').set('colors', ['#546E7A', '#26A69A', '#6D597A']);
    series.slices.template.set('tooltipText', '');
    series.slices.template.set('toggleKey', 'none');

    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('visible', false);

    // 파이 데이터 설정.
    series.data.setAll(data);

    series.labels.template.setAll({
      text: '{category}',
    });

    series.ticks.template.setAll({
      stroke: '#a0a0a0',
      strokeWidth: 1,
      strokeOpacity: 0.8,
    });

    // series.slices.template.set('tooltipText', '{value}');

    // 파이차트 중앙 라벨 설정.
    const label = series.children.push(
      am5.Label.new(root, {
        fontSize: 16,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        populateText: true,
        oversizedBehavior: 'fit',
        fill: am5.color('#fff'),
      }),
    );
    label.set('text', innerLabel);

    return { root, chart, series, label };
  },

  // ================================================ 접근제어 모니터링 관련 차트 종료

  /**
   * Pie Chart 생성 함수
   * @param {Object} object id: 차트 생성 div id / theme: 차트 테마. / legendData: 범례 설정.
   *                        data: 데이터 / categoryField: 그룹핑 key 값 / valueField: 지정 값 key
   *                        innerLabel: 파이차트 중앙 레이블
   * @returns root, chart, series, label(중앙 라벨)이 포함된 객체.
   */
  createPieChart: async ({
    id,
    theme,
    data,
    legendData = { label: '[#fff]{category}[/]', x: 200, y: 0, layout: null },
    categoryField,
    valueField,
    innerLabel,
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 파이차트 객체 생성.
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(80),
        radius: am5.percent(100),
        layout: root.horizontalLayout,
      }),
    );

    const { label: legendLabel, x, y, layout } = legendData;
    // 파이 객체 설정.
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField,
        categoryField,
        legendLabelText: legendLabel,
      }),
    );

    // 파이 데이터 설정.
    series.data.setAll(data);

    // Label, tick 미사용
    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('visible', false);

    // 범례 설정
    const legend = chart.children.push(
      am5.Legend.new(root, {
        x,
        y,
        layout: layout ?? root.verticalLayout,
      }),
    );
    // 범례 label 설정.
    legend.labels.template.setAll({
      fontSize: 10,
      maxWidth: 50,
    });
    // 범례 value label 비활성화.
    legend.valueLabels.template.setAll({
      visible: false,
    });
    // 범례 marker 설정.
    legend.markers.template.setAll({
      width: 10,
      height: 10,
    });

    legend.data.setAll(series.dataItems);

    // 파이차트 중앙 라벨 설정.
    const label = series.children.push(
      am5.Label.new(root, {
        fontSize: 14,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        populateText: true,
        oversizedBehavior: 'fit',
        fill: am5.color('#f0f0f0'),
      }),
    );
    label.set('text', innerLabel);

    series.appear(1000, 100);

    return { root, chart, series, label };
  },
  /**
   * XY Chart 생성 함수.
   * @param {Object} object id: 차트 생성 div id / theme: 차트 테마. / legendData: 범례 설정.
   * @returns root, chart, xAxis, yAxis, legend가 포함된 객체.
   */
  createRealXYChart: async ({
    id,
    theme,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
  }) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[amCharts] Chart container with id="${id}" not found.`);
      return null;
    }

    // 기존 root 제거
    const existingRoot = am5.registry.rootElements.find((r) => r.dom === el);
    if (existingRoot && !existingRoot.isDisposed()) {
      existingRoot.dispose();
      am5.registry.rootElements = am5.registry.rootElements.filter((r) => r !== existingRoot);
    }

    // 새로운 root 생성
    const root = am5.Root.new(el);
    if (!root || root.isDisposed()) {
      console.warn('[amCharts] Failed to initialize root or root is already disposed.');
      return null;
    }

    return new Promise(async (resolve) => {
      requestAnimationFrame(async () => {
        if (root.isDisposed()) {
          console.warn('[amCharts] Root is disposed before chart setup.');
          return null;
        }

        const chartDateFormat = 'yyyy-MM-dd';
        let mainColor = '#F0F0F0';
        const themeList = [am5themes_Animated.new(root)];

        // locale
        root.locale = am5locale_ko_kr;

        // 테마 적용
        if (theme === 'dark') {
          try {
            const darkTheme = (await import('@amcharts/amcharts5/themes/Dark')).default;
            themeList.push(darkTheme.new(root));
            mainColor = '#F0F0F0';
          } catch (err) {
            console.error('[amCharts] Failed to load dark theme', err);
          }
        }

        // 테마 설정
        root.setThemes(themeList);

        // 데이트 포맷
        root.dateFormatter.set('dateFormat', chartDateFormat);

        // 차트 생성
        const chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            focusable: false,
            paddingLeft: -5,
            paddingRight: 20,
            cursor: am5xy.XYCursor.new(root, {}),
          }),
        );

        const xAxis = chart.xAxes.push(
          am5xy.DateAxis.new(root, {
            maxDeviation: 0.5,
            groupData: false,
            extraMax: 0.1,
            extraMin: -0.1,
            baseInterval: {
              timeUnit: 'second',
              count: 1,
            },
            renderer: am5xy.AxisRendererX.new(root, {
              minorGridEnabled: true,
              minGridDistance: 50,
            }),
            tooltip: am5.Tooltip.new(root, {}),
          }),
        );

        xAxis.get('renderer').grid.template.setAll({
          location: 0,
          strokeOpacity: 0.2,
          stroke: am5.color(mainColor),
          strokeWidth: 1,
        });

        const yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {
              minGridDistance: 50,
            }),
          }),
        );

        yAxis.get('renderer').grid.template.setAll({
          stroke: am5.color(mainColor),
          strokeOpacity: 0.2,
          strokeWidth: 1,
        });

        const { x, y, layout } = legendData;
        const legend = chart.children.push(
          am5.Legend.new(root, {
            layout: layout ?? root.horizontalLayout,
            position: 'absolute',
            x,
            y,
            useDefaultMarker: true,
            paddingLeft: 20,
            opacity: 0.8,
          }),
        );

        legend.markers.template.setAll({
          width: 13,
          height: 8,
        });

        legend.markerRectangles.template.setAll({
          cornerRadiusBL: 0,
          cornerRadiusBR: 0,
          cornerRadiusTL: 0,
          cornerRadiusTR: 0,
        });

        resolve({ root, chart, xAxis, yAxis, legend });
      });
    });
  },

  createRealRangeXYChart: async ({ id, theme, legendData = { x: 70, y: 0, layout: null } }) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[amCharts] Element with id="${id}" not found`);
      return;
    }

    // 기존 root 제거
    const existingRoot = am5.registry.rootElements.find((r) => r.dom === el);
    if (existingRoot && !existingRoot.isDisposed()) {
      existingRoot.dispose();
      am5.registry.rootElements = am5.registry.rootElements.filter((r) => r !== existingRoot);
    }

    // 새 root 생성
    const root = am5.Root.new(el);
    if (!root || root.isDisposed()) return;

    // 비동기 안정화를 위해 delay 처리
    return new Promise(async (resolve) => {
      requestAnimationFrame(async () => {
        if (root.isDisposed()) return;

        const chartDateFormat = 'yyyy-MM-dd';
        let mainColor = '#F0F0F0';
        const themeList = [am5themes_Animated.new(root)];
        root.locale = am5locale_ko_kr;

        // 테마 처리
        if (theme === 'dark') {
          const darkTheme = (await import('@amcharts/amcharts5/themes/Dark')).default;
          themeList.push(darkTheme.new(root));
          mainColor = '#F0F0F0';
        }

        root.setThemes(themeList);
        root.dateFormatter.set('dateFormat', chartDateFormat);

        // 차트 및 축 생성 등 이후 로직
        const chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            focusable: false,
            paddingLeft: -5,
            paddingRight: 20,
            cursor: am5xy.XYCursor.new(root, {}),
          }),
        );

        const xAxis = chart.xAxes.push(
          am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: 'second', count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {
              minorGridEnabled: true,
              minGridDistance: 50,
            }),
            tooltip: am5.Tooltip.new(root, {}),
          }),
        );
        xAxis.get('renderer').grid.template.setAll({
          location: 0,
          strokeOpacity: 0.2,
          stroke: am5.color(mainColor),
          strokeWidth: 1,
        });

        const yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 50 }),
            max: 100,
            min: 0,
          }),
        );
        yAxis.get('renderer').grid.template.setAll({
          stroke: am5.color(mainColor),
          strokeOpacity: 0.2,
          strokeWidth: 1,
        });

        const { x, y, layout } = legendData;
        const legend = chart.children.push(
          am5.Legend.new(root, {
            layout: layout ?? root.horizontalLayout,
            position: 'absolute',
            x,
            y,
            useDefaultMarker: true,
            paddingLeft: 20,
            opacity: 0.8,
          }),
        );

        legend.markers.template.setAll({ width: 13, height: 8 });
        legend.markerRectangles.template.setAll({
          cornerRadiusBL: 0,
          cornerRadiusBR: 0,
          cornerRadiusTL: 0,
          cornerRadiusTR: 0,
        });

        resolve({ root, chart, xAxis, yAxis, legend });
      });
    });
  },

  createRealTimeLineSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '{name} : {valueY}',
  }) => {
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name,
        xAxis,
        yAxis,
        valueXField: valueX,
        valueYField: valueY,
        sequencedInterpolation: true,
        sequencedDelay: 100,
        stroke,
        fill,
        fillOpacity,
        strokeWidth: 1,
        tooltip: am5.Tooltip.new(root, {
          labelText: tooltipText,
        }),
      }),
    );

    // date 형식 데이터 처리기 설정.
    series.data.processor = am5.DataProcessor.new(root, {
      numericFields: [valueY],
      dateFields: [valueX],
      dateFormat: 'yyyy-MM-dd',
    });

    // 데이터 삽입.
    series.data.setAll(data);

    return series;
  },

  createCoumnXYChart: async ({ id, theme }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: 'panX',
        layout: root.verticalLayout,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
      }),
    );

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          minorGridEnabled: true,
          minGridDistance: 1,
        }),
        categoryField: 'path',
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    // x축 그리드 설정.
    xAxis.get('renderer').grid.template.setAll({
      location: 0,
    });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
        max: 100,
        min: 0,
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis };
  },

  createRangeColumnSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '{name}: {valueY}',
  }) => {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: valueY,
        categoryXField: 'path',
        tooltip: am5.Tooltip.new(root, {
          labelText: tooltipText,
        }),
      }),
    );

    series.columns.template.setAll({ cornerRadiusTR: 5, cornerRadiusBR: 5, strokeOpacity: 0 });

    // Make each column to be of a different color
    series.columns.template.adapters.add('fill', function (fill, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    // 데이터 삽입.
    series.data.setAll(data);

    return series;
  },

  createBarStackSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '{name}: {valueY}',
  }) => {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name,
        stacked: true,
        xAxis,
        yAxis,
        categoryXField: valueX,
        valueYField: valueY,
        stroke,
        fill,
        fillOpacity,
        tooltip: am5.Tooltip.new(root, {
          labelText: tooltipText,
        }),
      }),
    );

    series.columns.template.setAll({ maxWidth: 13 });
    // 데이터 삽입.
    series.data.setAll(data);

    return series;
  },

  createClusteredChart: async ({
    id,
    theme,
    category,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingBottom: 0,
        paddingLeft: 0,
        wheelX: 'panX',
        layout: root.verticalLayout,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
      }),
    );

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          minorGridEnabled: true,
          minGridDistance: 1,
        }),
        categoryField: category,
      }),
    );

    // x축 그리드 설정.
    // xAxis.get('renderer').grid.template.setAll({
    //   location: 1,
    // });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 범례 설정 값.
    const { x, y, layout } = legendData;
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: layout ?? root.horizontalLayout,
        position: 'absolute',
        x: am5.percent(39),
        y,
        useDefaultMarker: true,
        opacity: 0.8,
      }),
    );

    // 범례 항목 설정.
    legend.markers.template.setAll({
      width: 13,
      height: 8,
      // marginRight: 4,
      // marginTop: 0,
    });
    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  createDiffColorBarStackSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '[#fff]{categoryX}: {valueY}',
  }) => {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name,
        xAxis,
        yAxis,
        valueYField: valueX, // valueXField -> valueYField로 변경
        categoryXField: valueY, // categoryYField -> categoryXField로 변경
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'down', // pointerOrientation 수정
          labelText: tooltipText,
        }),
      }),
    );

    series.columns.template.setAll({ strokeOpacity: 0, maxWidth: 30 });

    // Make each column to be of a different color
    series.columns.template.adapters.add('fill', function (fill, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    // 데이터 삽입.
    series.data.setAll(data);

    chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
        xAxis: xAxis,
        yAxis: yAxis,
      }),
    );

    return series;
  },

  createDonutLegendChart: async ({
    id,
    theme,
    data,
    categoryField,
    valueField,
    innerLabel,
    legendData,
    donutColor,
    legendFlag,
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 파이차트 객체 생성.
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(55),
        radius: am5.percent(legendFlag ? 135 : 85),

        layout: root.verticalLayout,
      }),
    );

    // 파이 객체 설정.
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField,
        categoryField,
      }),
    );

    series.get('colors').set('colors', donutColor);
    //series.slices.template.set('tooltipText', '');
    series.slices.template.set('toggleKey', 'none');

    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('visible', false);

    // 파이 데이터 설정.
    series.data.setAll(data);

    series.labels.template.setAll({
      text: '{category}',
    });

    series.ticks.template.setAll({
      stroke: '#a0a0a0',
      strokeWidth: 1,
      strokeOpacity: 0.8,
    });

    // 툴팁 설정 (데이터 표시할게 존재한다면)
    if (data !== null && data[0][categoryField] !== 'emptyData')
      series.slices.template.set('tooltipText', '[#fff]{category}: [#fff]{value}');
    else series.slices.template.set('tooltipText', '');

    // 파이차트 중앙 라벨 설정.
    const label = series.children.push(
      am5.Label.new(root, {
        fontSize: 16,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        populateText: true,
        oversizedBehavior: 'fit',
        fill: am5.color('#fff'),
      }),
    );
    label.set('text', innerLabel);

    let legend = null;
    if (legendFlag) {
      // 범례 설정
      const { x, y, layout } = legendData;
      legend = chart.children.push(
        am5.Legend.new(root, {
          x,
          y,
          layout: layout ?? root.verticalLayout,
          clickTarget: 'none', // 범례 클릭 이벤트 막기
        }),
      );
      // 범례 label 설정.
      legend.labels.template.setAll({
        fontSize: 13,
        maxWidth: 30,
      });
      // 범례 value label 비활성화.
      legend.valueLabels.template.setAll({
        visible: false,
      });
      // // 범례 marker 설정.
      legend.markers.template.setAll({
        width: 15,
        height: 10,
      });

      // 범례 데이터 설정
      legend.data.setAll(series.dataItems);

      // x, y 위치 설정 (차트를 중앙으로 배치)
      chart.set('x', am5.percent(50)); // x 위치를 부모 컨테이너의 50%로 설정 (수평 중앙)
      chart.set('y', am5.percent(68)); // y 위치를 부모 컨테이너의 68%로 설정 (수직 중앙)

      // 추가로, 중앙 정렬을 맞추기 위해 앵커를 설정
      chart.set('centerX', am5.percent(50)); // 수평 방향 중앙
      chart.set('centerY', am5.percent(50)); // 수직 방향 중앙
    }

    if (!legendFlag) return { root, chart, series, label };
    else return { root, chart, series, label, legend };
  },

  createClusteredColumnSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '{name}: {valueY}',
    category,
  }) => {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: valueY,
        categoryXField: valueX,
        stroke,
        fill,
        fillOpacity,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'vertical',
          labelText: '[bold]{categoryX}[/]\n{name}: {valueY}',
        }),
      }),
    );

    series.columns.template.setAll({
      strokeOpacity: 0,
      width: am5.percent(60),
    });

    // // Make each column to be of a different color
    // series.columns.template.adapters.add('fill', function (fill, target) {
    //   return chart.get('colors').getIndex(series.columns.indexOf(target));
    // });
    //
    // series.columns.template.adapters.add('stroke', function (stroke, target) {
    //   return chart.get('colors').getIndex(series.columns.indexOf(target));
    // });

    // 데이터 삽입.
    series.data.setAll(data);
    // legend.data.push(series);

    return series;
  },

  createRowStatusChart: async ({
    id,
    theme,
    categoryName,
    panX = false,
    panY = false,
    wheelX = 'none',
    wheelY = 'none',
    paddingLeft = 5,
    paddingRight = 5,
    yOption = {},
    xOption = {},
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX, // x축 드래그
        panY, // y축 드래그
        wheelX, // x축 휠 시
        wheelY, // y축 휙 시
        paddingLeft,
        paddingRight,
        paddingBottom: 0,
        paddingTop: 0,
      }),
    );

    chart
      .get('colors')
      // .set('colors', ['#FF9AA2', '#FFDA8E', '#85C7DE', '#86DEA3', '#B79CED', '#C2B0BC']);
      .set('colors', ['#64B5F6', '#FFE082', '#4DB6AC', '#81C784', '#9575CD', '#B0BEC5']);

    chart.zoomOutButton.set('forceHidden', true);

    let yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 1,
      minorGridEnabled: true,
      ...yOption,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: categoryName,
        renderer: yRenderer,
      }),
    );

    // y축 그리드 설정.
    yAxis.get('renderer').grid.template.setAll({
      location: 0.5,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        numberFormatter: am5.NumberFormatter.new(root, {
          numberFormat: '#,###a',
        }),
        extraMax: 0.1,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0,
          minGridDistance: 100,
          ...xOption,
        }),
      }),
    );

    // x축 그리드 설정
    xAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis };
  },

  createTransitionChart: async ({
    id,
    theme,
    category,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    const chartDateFormat = 'yyyy-MM-dd';
    root.dateFormatter.set('dateFormat', chartDateFormat);

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        wheelX: 'panX',
        layout: root.verticalLayout,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
      }),
    );

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0,
          cellEndLocation: 1,
          minorGridEnabled: true,
          minGridDistance: 1,
        }),
        categoryField: category,
      }),
    );

    // x축 그리드 설정.
    xAxis.get('renderer').grid.template.setAll({
      location: 0,
    });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 50,
          strokeOpacity: 0.1,
        }),
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 범례 설정 값.
    const { x, y, layout } = legendData;
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: layout ?? root.horizontalLayout,
        position: 'absolute',
        x: am5.percent(30),
        y,
        useDefaultMarker: true,
        opacity: 0.8,
      }),
    );

    // 범례 항목 설정.
    legend.markers.template.setAll({
      width: 20,
      height: 12,
      // marginRight: 4,
      // marginTop: 4,
    });
    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  createTransitionLineSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = '{name} : {valueY}',
  }) => {
    const series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name,
        xAxis,
        yAxis,
        categoryXField: valueX,
        valueYField: valueY,
        // sequencedInterpolation: true,
        // sequencedDelay: 100,
        stroke,
        fill,
        fillOpacity,
        tooltip: am5.Tooltip.new(root, {
          labelText: tooltipText,
        }),
      }),
    );

    // date 형식 데이터 처리기 설정.
    // series.data.processor = am5.DataProcessor.new(root, {
    //   numericFields: [valueY],
    //   dateFields: [valueX],
    //   dateFormat: 'yyyy-MM-dd',
    // });

    series.bullets.push(function () {
      let graphics = am5.Circle.new(root, {
        radius: 3,
        interactive: true,
        cursorOverStyle: 'ns-resize',
        stroke: series.get('stroke'),
        fill: series.get('stroke'),
      });

      return am5.Bullet.new(root, {
        sprite: graphics,
      });
    });

    // 데이터 삽입.
    series.data.setAll(data);
    series.strokes.template.setAll({
      strokeWidth: 1.5,
    });

    return series;
  },
  /**
   * XY Chart 생성 함수.
   * @param {Object} object id: 차트 생성 div id / theme: 차트 테마. / legendData: 범례 설정.
   * @returns root, chart, xAxis, yAxis, legend가 포함된 객체.
   */
  hss_createXYChart: async ({
    id,
    theme,
    legendData = {
      x: 70,
      y: 0,
      layout: null,
    },
  }) => {
    // AM 전역 객체.
    const root = am5.Root.new(id);

    const chartDateFormat = 'yyyy-MM-dd hh:mm:ss';

    let mainColor = '#F0F0F0';

    // 기본 전역 테마 목록.
    const themeList = [am5themes_Animated.new(root)];

    // 전역 로케일 설정.
    root.locale = am5locale_ko_kr;

    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          themeList.push((await import('@amcharts/amcharts5/themes/Dark')).default.new(root));
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }

    // 전역 테마 설정.
    root.setThemes(themeList);

    // 전역 데이트 포맷 설정,
    root.dateFormatter.set('dateFormat', chartDateFormat);

    // 차트 객체 생성.
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false, // Tab 포커스 선택 해제.
        panX: true, // x축 드래그
        panY: true, // y축 드래그
        wheelX: 'panX', // x축 휠 시
        wheelY: 'zoomX', // y축 휙 시
        paddingLeft: -5,
        // paddingTop: 0,
        paddingRight: 20,
        // paddingBottom: 0,
        cursor: am5xy.XYCursor.new(root, {}), // 커서 추가.
      }),
    );

    // x축 객체 생성.
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: 'second', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          //minGridDistance: 20,
        }),
        tooltipDateFormat: 'yyyy-MM-dd HH:mm:ss',
        startLocation: 0.5,
        endLocation: 0.5,
      }),
    );

    // x축 그리드 설정.
    xAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeOpacity: 0.2,
      stroke: am5.color(mainColor),
      strokeWidth: 1,
    });

    // y축 객체 생성.
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          //minGridDistance: 50,
        }),
      }),
    );

    // y축 그리드 설정
    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(mainColor),
      strokeOpacity: 0.2,
      strokeWidth: 1,
    });

    // 범례 설정 값.
    const { x, y, layout } = legendData;
    // 범례 객체 설정 및 생성.
    const legend = chart.children.push(
      am5.Legend.new(root, {
        layout: layout ?? root.horizontalLayout,
        position: 'absolute',
        x,
        y,
        useDefaultMarker: true,
        paddingLeft: 20,
        opacity: 0.8,
      }),
    );

    // 범례 항목 설정.
    legend.markers.template.setAll({
      width: 13,
      height: 8,
      marginRight: 4,
      marginTop: 0,
    });

    // 범례 사각형 둥근정도 조정
    legend.markerRectangles.template.setAll({
      cornerRadiusBL: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
    });

    // 설정 객체 반환.
    return { root, chart, xAxis, yAxis, legend };
  },

  /**
   * Line 데이터 생성 함수.
   * @param {Object} object  root: 차트 전역 설정 객체 / chart: 설정이 완료된 chart 객체
   *                         data: 차트 데이터 / name: 데이터 라인명 / xAxis: 설정이 완료된 x축 객체.
   *                         yAxis: 설정이 완료된 y축 객체 / valueX: x축 key 값 / valueY: y축 key 값
   *                         fill: 채우기 색상 / stroke: 라인 색상 / fillOpacity: 채우기 투명도
   *                         tooltipText: 라인 데이터 툴팁
   * @returns 설정이 완료된 데이터 라인 객체
   */
  hss_createLineSeries: ({
    root,
    chart,
    data,
    name,
    xAxis,
    yAxis,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    //tooltipText = '{valueX.formatDate()}\n{name}: {valueY}',
    tooltipText = '{name}: {valueY}',
  }) => {
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name,
        xAxis,
        yAxis,
        valueXField: valueX,
        valueYField: valueY,
        sequencedInterpolation: true,
        sequencedDelay: 100,
        stroke,
        fill,
        fillOpacity,
        strokeWidth: 1,
        tooltip: am5.Tooltip.new(root, {
          labelText: tooltipText,
        }),
      }),
    );

    // 선형 그라데이션 설정.
    series.fills.template.set(
      'fillGradient',
      am5.LinearGradient.new(root, {
        stops: [
          {
            opacity: 0.5,
            color: am5.color(fill),
            offset: [1, 0],
          },
          {
            opacity: 0,
            color: am5.color(fill),
            offset: [1, 0],
          },
        ],
        rotation: 90,
      }),
    );
    series.fills.template.setAll({
      visible: true,
      fillOpacity: 1,
    });

    // date 형식 데이터 처리기 설정.
    series.data.processor = am5.DataProcessor.new(root, {
      numericFields: [valueY],
      dateFields: [valueX],
      dateFormat: 'yyyy-MM-dd',
    });

    // 데이터 삽입.
    series.data.setAll(data);

    return series;
  },
};

export default AmChart5Lib;
