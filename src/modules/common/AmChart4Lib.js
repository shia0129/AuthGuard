import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4lang_ko_kr from '@amcharts/amcharts4/lang/ko_KR';
/**
 * AM Chart 4 관련 라이브러리.
 *  */
const AmChart4Lib = {
    /**
   * XY Chart 생성 함수.
   * @param {Object} object id: 차트 생성 div id / data: 차트 데이터 / theme: 차트 테마. / legendData: 범례 설정 정보
   * @returns chart 설정된 chart 객체.
   */
    hss_createXYChart: async ({ id, data, theme, legendData = { position: 'top' } }) => {
      // 테마 설정.
      am4core.useTheme(am4themes_animated);
  
      let mainColor = '#F0F0F0';
      // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
      switch (theme) {
        case 'dark':
          {
            am4core.useTheme((await import('@amcharts/amcharts4/themes/dark')).default);
            mainColor = '#F0F0F0';
          }
          break;
        default:
          break;
      }
      // XY 차트 객체.

      const chart = am4core.create(id, am4charts.XYChart);
      //chart.dateFormatter.dateFormat = "HH:mm:ss";
  
      // 차트 로케일 설정.
      chart.language.locale = am4lang_ko_kr;
  
      // 차트 데이터 삽입.
      chart.data = data;
  
      // X 축 설정.
      let xAxes1 = chart.xAxes.push(new am4charts.DateAxis());
      //xAxes1.startLocation = xAxes1.endLocation = 0.5;
      xAxes1.renderer.grid.template.location = 0;
      xAxes1.renderer.grid.template.strokeOpacity = 0.2;
      xAxes1.renderer.grid.template.stroke = am4core.color(mainColor);
      xAxes1.renderer.grid.template.strokeWidth = 1;

      // X 축 시간 출력 방식 설정
      xAxes1.baseInterval = { timeUnit: 'second', count: 1};  // 최소단위 지정
      xAxes1.tooltipDateFormat = "yyyy-MM-dd HH:mm:ss";       // 최소 시간 출력단위 지정

      // y축 설정.
      let yAxes1 = chart.yAxes.push(new am4charts.ValueAxis());
      yAxes1.renderer.grid.template.strokeOpacity = 0.2;
      yAxes1.renderer.grid.template.stroke = am4core.color(mainColor);
      yAxes1.renderer.grid.template.strokeWidth = 1;
  
      // 범례 설정.
      chart.legend = new am4charts.Legend();
      // 범례 설정 정보.
      const { position } = legendData;
      chart.legend.position = position ?? 'top';
      chart.legend.paddingLeft = '20';
      chart.legend.fillOpacity = 0.8;
      chart.legend.useDefaultMarker = true;

      let marker = chart.legend.markers.template;
      marker.disposeChildren(); // 커스텀을 위해 기존 범례 항목삭제.
      marker.width = marker.height = 10;
      marker.marginRight = 4;
      marker.marginTop = 0;

      // 범례 항목을 감싸는 요소.
      let boxs = marker.createChild(am4core.Sprite);
      boxs.width = boxs.height = 10;
      boxs.scale = 0.1;
      boxs.verticalCenter = 'top';
      boxs.horizontalCenter = 'left';
      boxs.propertyFields.fill = 'fill';
      boxs.adapter.add('dx', function (dx, target) {
        target.path = target.dataItem.dataContext.dummyData.path;
        return dx;
      });

      // 차트 설정
      chart.paddingLeft = '0';
      chart.paddingTop = '0';
      chart.paddingRight = '20';
      chart.paddingBottom = '0';

      // 커서 설정
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = xAxes1;
      chart.cursor.lineY.disabled = true;
  
      return chart;
    },
    /**
     * Line 데이터 생성 함수.
     * @param {Object} object chart: 설정이 완료된 chart 객체 / name: 데이터 라인명
     *                        valueX: X축 key값 / valueY: Y축 key값 / fill: 채우기 색상
     *                        stroke: 라인 색상 / fillOpacity: 채우기 투명도
     *                        tooltipText: 라인 데이터 툴팁
     * @returns 설정이 완료된 데이터 라인 객체
     */
    hss_createLineSeries: ({
      chart,
      name,
      valueX,
      valueY,
      fill,
      stroke,
      fillOpacity,
      tooltipText = `{name}: {valueY}`,
    }) => {
      let series = chart.series.push(new am4charts.LineSeries());
      series.name = name;

      series.dataFields.dateX = valueX;
      series.dataFields.valueY = valueY;

      series.tooltipText = name+`: {valueY}`;

      // 범례 Sprite 항목에 사용하는 사용자 정의 데이터.
      series.dummyData = { path: 'M 0 0 h 150 v 100 h -150 Z' };

      // 데이터 라인 스타일 설정.
      //if (fill) series.fill = fill;                       // 선 아래 영역의 색상
      //if (stroke) series.stroke = stroke;                 // 선 색상
      //if (fillOpacity) series.fillOpacity = fillOpacity;  // 채우기 투명도
      series.tensionX = 0.8;
      series.strokeWidth = 2;
      
      //series.tooltip.pointerOrientation = "vertical";
      //chart.cursor.snapToSeries = series;
  
      return series;
    },

  /**
   * XY Chart 생성 함수.
   * @param {Object} object id: 차트 생성 div id / data: 차트 데이터 / theme: 차트 테마. / legendData: 범례 설정 정보
   * @returns chart 설정된 chart 객체.
   */
  createXYChart: async ({ id, data, theme, legendData = { position: 'top' } }) => {
    // 테마 설정.
    am4core.useTheme(am4themes_animated);

    let mainColor = '#F0F0F0';
    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          am4core.useTheme((await import('@amcharts/amcharts4/themes/dark')).default);
          mainColor = '#F0F0F0';
        }
        break;
      default:
        break;
    }
    // XY 차트 객체.
    const chart = am4core.create(id, am4charts.XYChart);

    // 차트 로케일 설정.
    chart.language.locale = am4lang_ko_kr;

    // 차트 데이터 삽입.
    chart.data = data;

    // X 축 설정.
    let xAxes1 = chart.xAxes.push(new am4charts.DateAxis());
    xAxes1.startLocation = xAxes1.endLocation = 0.5;
    xAxes1.renderer.minGridDistance = 20;
    xAxes1.renderer.grid.template.location = 0;
    xAxes1.renderer.grid.template.strokeOpacity = 0.2;
    xAxes1.renderer.grid.template.stroke = am4core.color(mainColor);
    xAxes1.renderer.grid.template.strokeWidth = 1;

    // y축 설정.
    let yAxes1 = chart.yAxes.push(new am4charts.ValueAxis());
    yAxes1.renderer.grid.template.strokeOpacity = 0.2;
    yAxes1.renderer.grid.template.stroke = am4core.color(mainColor);
    yAxes1.renderer.grid.template.strokeWidth = 1;

    // 범례 설정.
    chart.legend = new am4charts.Legend();
    // 범례 설정 정보.
    const { position } = legendData;
    chart.legend.position = position ?? 'top';
    chart.legend.paddingLeft = '20';
    chart.legend.fillOpacity = 0.8;
    chart.legend.useDefaultMarker = true;

    // 범례 항목 설정.
    let marker = chart.legend.markers.template;
    marker.disposeChildren(); // 커스텀을 위해 기존 범례 항목삭제.
    marker.width = marker.height = 10;
    marker.marginRight = 4;
    marker.marginTop = 0;

    // 범례 항목을 감싸는 요소.
    let boxs = marker.createChild(am4core.Sprite);
    boxs.width = boxs.height = 10;
    boxs.scale = 0.1;
    boxs.verticalCenter = 'top';
    boxs.horizontalCenter = 'left';
    boxs.propertyFields.fill = 'fill';
    boxs.adapter.add('dx', function (dx, target) {
      target.path = target.dataItem.dataContext.dummyData.path;
      return dx;
    });

    // 차트 설정
    chart.paddingLeft = '-15';
    chart.paddingTop = '0';
    chart.paddingRight = '0';
    chart.paddingBottom = '0';

    // 커서 설정
    chart.cursor = new am4charts.XYCursor();

    return chart;
  },
  /**
   * Line 데이터 생성 함수.
   * @param {Object} object chart: 설정이 완료된 chart 객체 / name: 데이터 라인명
   *                        valueX: X축 key값 / valueY: Y축 key값 / fill: 채우기 색상
   *                        stroke: 라인 색상 / fillOpacity: 채우기 투명도
   *                        tooltipText: 라인 데이터 툴팁
   * @returns 설정이 완료된 데이터 라인 객체
   */
  createLineSeries: ({
    chart,
    name,
    valueX,
    valueY,
    fill,
    stroke,
    fillOpacity,
    tooltipText = `{name}\n {dateX}: {valueY}`,
  }) => {
    // 한 개의 데이터 라인 생성.
    let series = chart.series.push(new am4charts.LineSeries());
    // 라인 명
    series.name = name;
    // Y 축 값 참조키.
    series.dataFields.valueY = valueY;
    // X 축 값 참조키.
    series.dataFields.dateX = valueX;
    // 범례 Sprite 항목에 사용하는 사용자 정의 데이터.
    series.dummyData = { path: 'M 0 0 h 150 v 100 h -150 Z' };

    // 데이터 라인 스타일 설정.
    if (fill) series.fill = fill;
    if (stroke) series.stroke = stroke;
    if (fillOpacity) series.fillOpacity = fillOpacity;
    series.strokeWidth = 1;

    // 데이터 항목 간 전환 여부 및 딜레이 시간 설정.
    //series.sequencedInterpolation = true;
    //series.sequencedInterpolationDelay = 100;

    // 라인 툴팁 텍스트.
    series.tooltipText = tooltipText;

    // 선형 그라데이션 설정.
    let fillModifier = new am4core.LinearGradientModifier();
    fillModifier.opacities = [1, 0];
    fillModifier.offsets = [0, 1];
    fillModifier.gradient.rotation = 90;
    series.segments.template.fillModifier = fillModifier;
  

    return series;
  },

  /**
   * 파이차트 생성 함수.
   * @param {Object} object id: 차트 생성 div id / data: 차트 데이터 / theme: 차트 테마. / legendData: 범례 설정 정보
   * @returns 설정이 완료된 차트 객체.
   */
  createPieChart: async ({ id, data, theme, legendData = { position: 'top' } }) => {
    // 테마 설정.
    am4core.useTheme(am4themes_animated);
    // 값에 따른 테마 설정. 추가 테마 amchart4 공식 사이트 참고.
    switch (theme) {
      case 'dark':
        {
          am4core.useTheme((await import('@amcharts/amcharts4/themes/dark')).default);
        }
        break;
      default:
        break;
    }
    // 파이차트 객체 생성
    const chart = am4core.create(id, am4charts.PieChart);
    chart.radius = am4core.percent(100);
    chart.innerRadius = am4core.percent(80);

    // 차트 로케일 설정.
    chart.language.locale = am4lang_ko_kr;

    // 안쪽 여백
    // chart.paddingLeft = '10';
    // chart.paddingTop = '0';
    // chart.paddingRight = '0';
    // chart.paddingBottom = '0';
    // 차트 데이터 삽입.
    chart.data = data;
    // 범례 생성
    chart.legend = new am4charts.Legend();
    // 범례 설정 정보
    const { position } = legendData;
    chart.legend.position = position ?? 'right';
    chart.legend.valign = 'top';
    chart.legend.height = 0;
    // chart.legend.maxHeight = 80;
    // chart.legend.scrollable = true;
    chart.legend.fontSize = 10;
    // 범례 범주 설정
    chart.legend.labels.template.maxWidth = 50;
    chart.legend.labels.template.truncate = true;
    // chart.legend.itemContainers.template.tooltipText = '{country}';
    // 범례 값 설정
    chart.legend.valueLabels.template.align = 'left';
    chart.legend.valueLabels.template.textAlign = 'start';
    // 범례 간격
    // chart.legend.itemContainers.template.paddingTop = 0;
    // chart.legend.itemContainers.template.paddingBottom = 15;
    // console.log(chart.legend.contentHeight);
    // 마커 사이즈
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    return chart;
  },
  /**
   * 파이계열 생성 함수.
   * @param {Object} object chart: 설정이 완료된 차트 객체
   * @returns 설정이 완료된 계열 객체
   */
  createPieSeries: ({ chart }) => {
    // 파이계열 객체
    let series = chart.series.push(new am4charts.PieSeries());
    // Add and configure Series
    series.dataFields.value = 'value';
    series.dataFields.category = 'category';
    // Disable ticks and labels
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    // Disable tooltips
    // series.slices.template.tooltipText = '';
    return series;
  },
  /**
   * Series 생성 함수.
   * @param {Object} object chart: 설정이 완료된 차트 객체 / series: 설정이 완료된 계열 객체
   *                        seriesData: 계열 데이터
   * @returns 파이차트 안에 라벨 객체
   */
  createLabel: ({ chart, series, seriesData }) => {
    // 컨테이너 생성
    let container = new am4core.Container();
    container.parent = series;
    container.horizontalCenter = 'middle';
    container.verticalCenter = 'middle';
    container.width = am4core.percent(40) / Math.sqrt(2);
    container.fill = 'white';
    // 라벨 생성
    let label = new am4core.Label();
    label.parent = container;
    label.text = seriesData.labelText;
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 13;
    // 라벨크기 조정
    chart.events.on('sizechanged', function () {
      let scale = (series.pixelInnerRadius * 2) / label.bbox.width;
      if (scale > 1) {
        scale = 1;
      }
      label.scale = scale;
      // console.log('scale', scale);
    });
    return label;
  },
};

export default AmChart4Lib;
