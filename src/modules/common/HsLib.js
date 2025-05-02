import * as jwt_decode from 'jwt-decode';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import _ from 'lodash';
import { createIntl, createIntlCache } from 'react-intl';

/*

// ZONE 상태 수정 (재시도 로직 포함)
async function updateZoneStatusInternal(id, retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const result = await zoneApi.axios.post('/api/sslvpn/zone', {
      run_type: 'put',
      status: true,
      name: id,
      signal,
    });
    if (!result.data.errorYn) {
      return 'ZONE 상태 정보가 수정 되었습니다.';
    }
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateZoneStatusInternal(id, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      const errorMessage = error.response.data.error.errorMessage;
      let finalErrorMessage = '';
      if (typeof errorMessage === 'object') {
        finalErrorMessage = Object.values(errorMessage).flat().shift();
      } else {
        finalErrorMessage = errorMessage;
      }
      return finalErrorMessage;
    }
    return 'ZONE 상태 정보 수정이 실패되었습니다.';
  }
}
*/
async function getGridInfoInternal(listCode, api, openModal, callbackList = [], retryCount = 3) {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const gridInfo = await api.axios.get('/api/gridInfo?listCode=' + listCode, { signal });
    return HsLib.getGridColumn(gridInfo.data, api, callbackList, openModal);
  } catch (error) {
    if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getGridInfoInternal(listCode, api, openModal, callbackList, retryCount - 1);
    }
    if (error.response && error.response.data.errorYn) {
      const errorMessage = error.response.data.error.errorMessage;
      let finalErrorMessage = '';
      if (typeof errorMessage === 'object') {
        finalErrorMessage = Object.values(errorMessage).flat().shift();
      } else {
        finalErrorMessage = errorMessage;
      }
      return finalErrorMessage;
    }
    return { listInfo: {}, columns: [] };
  }
}

async function getGridColumnInternal(gridInfo, api, callbackList, openModal, retryCount = 3) {
  const listInfo = gridInfo.listInfo;
  const columnInfo = gridInfo.cellInfo;

  let columns = [];
  if (!_.isEmpty(listInfo) && listInfo[0].useChecked === 'Y') {
    columns = [
      {
        id: 'row-selection-chk',
        accessor: 'Selection',
        sticky: listInfo[0].fixCells !== 0 ? 'left' : undefined,
        width: 50,
        minWidth: 50,
        // maxWidth: '50px',
      },
    ];
  }
  // 컬럼 추가 정보
  let addColumn = {};

  // Editable 가능 컬럼
  let editColumn = [];

  // no 컬럼을 사용하는지 확인.
  const existNo = columnInfo.find((data) => data.cellName === 'no');
  for (let i = 0; i < columnInfo.length; i++) {
    const column = columnInfo[`${i}`];
    let newValue;
    column['valueOptions'] = [];

    // 컬럼 고정
    if (listInfo[0].fixCells !== 0 && i + 1 <= listInfo[0].fixCells) column.sticky = 'left';

    // 컬럼 타입 설정
    const cellType = column.cellType;
    // Text
    if (cellType === 'T') {
      column.type = 'string';
      newValue = '';
      // Number or Number(,)
    } else if (cellType === 'M' || cellType === 'I') {
      column.type = 'number';
      newValue = 0;
      // Date
    } else if (cellType === 'D') {
      column.type = 'date';
      newValue = '';
      // Combo
    } else if (cellType === 'C') {
      try {
        const controller = new AbortController();
        const signal = controller.signal;
        column.type = 'select';
        const codeResult = await api.axios.get(
          '/api/system/codes/all?codeType=' + column.cellParam + '&deleteYn=N',
          { signal },
        );
        const codes = codeResult.data.resultData;
        if (codes.length > 0) {
          codes.forEach((code) => {
            column['valueOptions'].push({ value: code.codeValue, label: code.codeDesc });
          });
          newValue = codes[0].codeValue;
        } else {
          column.type = 'string';
          newValue = '';
        }
      } catch (error) {
        if ((error.name === 'CanceledError' || error.code === 'ERR_CANCELED') && retryCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return getGridColumnInternal(gridInfo, api, callbackList, openModal, retryCount - 1);
        }
        if (error.response) {
          const {
            errorYn,
            error: { errorMessage },
          } = error.response.data;

          if (errorYn) {
            openModal({
              message: errorMessage || '오류가 발생했습니다. 관리자에게 문의해주시기 바랍니다.',
              type: 'error',
            });
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      }
    } else if (cellType === 'o') {
      column.type = 'select';
      // No
    } else if (cellType === 'N') {
      column.type = 'number';
      newValue = '-';
    }

    // attribute type이 Button인 경우, 콜백 함수 설정.
    if (column.attributeType === 'B') {
      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[`${i}`].accessor === column.cellName) {
          column.buttonCallback = callbackList[`${i}`].func;
          break;
        }
      }
    }

    // 변환된 컬럼 정보 colums에 추가
    // if(i===columns.length-1 ) column.cellWidth = null;
    columns.push(HsLib.getReactTableColumnAuto(column));

    // 추가할 컬럼의 초기값 입력
    addColumn[column.cellName] = newValue;

    // 컬럼 수정 여부
    // if (column.editableYn === 'N') editColumn.push(column.cellName);
  }
  // no 컬럼이 존재하지 않는 경우, EditableCell 동작할 수 있게 값 추가.
  if (!existNo) {
    addColumn['no'] = '-';
  }
  // 컬럼 추가 Row 구분 Flag.
  addColumn['addColumnFlag'] = true;
  // 컬럼 추가시 초기 상태
  addColumn['status'] = 'I';
  return {
    columns: columns,
    addColumn: addColumn,
    editColumn: editColumn,
    listInfo: listInfo[0] || {},
  };
}

const HsLib = {
  //
  /**
   *  MUI Table Column 객체 반환 함수.
   *
   * @param {String} field 서버로부터 받은 데이터 속성 값.
   * @param {String} headerName column 이름.
   * @param {Number} flex 컬럼 넓이 비율.(전체 컬럼 넓이 분배.)
   * @param {String} align 컬럼 정렬. (left, center, right)
   * @param {String} headerAlign 해더 정렬
   * @param {Function} renderCell 해당 컬럼에 적용할 렌더 함수.
   * @param {String} type 해당 컬럼 타입.
   * @param {boolean} editable 해당 컬럼 수정가능 여부.
   * @param {boolean} nullCheck Null 체크
   * @param {Array}valueOptions
   * @returns MUI Table Column 객체
   */
  getColumn: (
    field,
    headerName,
    flex,
    align = 'left',
    headerAlign = null,
    renderCell,
    type = 'string',
    editable = false,
    nullCheck = false,
    valueOptions,
    width = null,
  ) => {
    return {
      field,
      headerName,
      sortable: false,
      flex,
      align,
      headerAlign: headerAlign || align,
      renderCell,
      type,
      editable,
      valueOptions: valueOptions,
      nullCheck,
      valueFormatter: (params) => {
        if (type === 'singleSelect') {
          for (let i = 0; i < valueOptions.length; i++) {
            if (params.value === valueOptions[`${i}`]['value'])
              return valueOptions[`${i}}`]['label'];
          }
        }
        return params.value;
      },
      width: 150,
      pinned: width,
    };
  },
  getColumnAuto: (column) => {
    return {
      field: column.cellName,
      headerName: column.cellHead,
      sortable: false,
      align: column.cellAlign === 'C' ? 'center' : column.cellAlign === 'L' ? 'left' : 'right',
      headerAlign:
        column.cellAlign === 'R' ? 'right' : column.cellAlign === 'L' ? 'left' : 'center',
      renderCell: null,
      type: column.cellType,
      editable: true,
      valueOptions: column.valueOptions,
      nullCheck: column.nullCheck === 'Y',
      width: column.cellWidth,
      valueFormatter: (params) => {
        if (column.cellType === 'singleSelect') {
          for (let i = 0; i < column.valueOptions.length; i++) {
            if (params.value === column.valueOptions[`${i}`]['value'])
              return column.valueOptions[`${i}`]['label'];
          }
        }
        return params.value;
      },
    };
  },
  /**
   * React-table Column 객체 반환 함수.
   * @param {String} accessor 서버로부터 받은 데이터 속성 값.
   * @param {String} Header column 이름.
   * @param {Function} Cell 해당 컬럼에 적용할 렌더 함수.
   * @param {String} sticky 고정 컬럼 위치.(left || right)
   * @param {Number} width 컬럼 넓이.
   * @param {String} headerAlign 헤더 정렬 위치.
   * @param {String} rowAlign 데이터 정렬 위치.
   * @param {String} type 데이터 타입.
   * @returns React-table Column 객체.
   */
  getReactTableColumn: (
    accessor,
    Header,
    Cell = null,
    sticky,
    width,
    headerAlign,
    rowAlign,
    type,
  ) => {
    if (Cell)
      return {
        Header,
        accessor,
        Cell,
        sticky,
        width,
        minWidth: width,
        headerAlign: 'center',
        rowAlign,
        type,
      };
    else
      return {
        Header,
        accessor,
        sticky,
        width,
        minWidth: width,
        headerAlign: 'center',
        rowAlign,
        type,
      };
  },
  /**
   * React-table Column 객체 반환 함수.
   */
  getReactTableColumnAuto: (column) => {
    if (column.Cell)
      return {
        Header: column.cellHead,
        accessor: column.cellName,
        Cell: column.Cell,
        sticky: column.sticky,
        width: column.cellWidth === 0 ? 100 || column.cellWidth === undefined : column.cellWidth,
        minWidth: column.cellWidth === 0 ? 100 || column.cellWidth === undefined : column.cellWidth,
        headerAlign: 'center',
        // column.cellAlign === 'C' ? 'center' : column.cellAlign === 'L' ? 'left' : 'right',
        rowAlign: column.cellAlign === 'C' ? 'center' : column.cellAlign === 'L' ? 'left' : 'right',
        type: column.type,
        cellType: column.cellType,
        valueOptions: column.valueOptions,
        nullCheck: column.notNull === 'Y',
        maxLength: column.maxLength,
        defaultYn: column.defaultYn,
        editableYn: column.editableYn,
        attributeType: column.attributeType,
        attribute: column.attribute,
        buttonCallback: column?.buttonCallback,
      };
    else
      return {
        Header: column.cellHead,
        accessor: column.cellName,
        sticky: column.sticky,
        width: column.cellWidth === 0 || column.cellWidth === undefined ? 100 : column.cellWidth,
        minWidth: column.cellWidth === 0 ? 100 || column.cellWidth === undefined : column.cellWidth,
        headerAlign: 'center',
        // column.cellAlign === 'C' ? 'center' : column.cellAlign === 'L' ? 'left' : 'right',
        rowAlign: column.cellAlign === 'C' ? 'center' : column.cellAlign === 'L' ? 'left' : 'right',
        type: column.type,
        cellType: column.cellType,
        valueOptions: column.valueOptions,
        nullCheck: column.notNull === 'Y',
        maxLength: column.maxLength,
        defaultYn: column.defaultYn,
        editableYn: column.editableYn,
        attributeType: column.attributeType,
        attribute: column.attribute,
        buttonCallback: column?.buttonCallback,
      };
  },

  /**
   * react-grid-layout Grid 객체 반환 함수.
   *
   * @param {String} id Grid id 값.
   * @param {Number} x Grid x좌표.
   * @param {Number} y Grid y좌표.
   * @param {Number} width Grid 가로 길이.
   * @param {Number} minWidth Grid 가로 최소 길이.
   * @param {Number} maxWidth Grid 가로 최대 길이.
   * @param {Number} height Grid 높이 길이.
   * @param {Number} minHeight Grid 높이 최소 길이.
   * @param {Number} maxHeight Grid 높이 최대 길이.
   * @param {Array} resizeHandles Resize Handle 위치 배열.
   * @returns react-grid-layout Grid 객체
   */
  getGrid: (id, x, y, width, minWidth, maxWidth, height, minHeight, maxHeight, resizeHandles) => {
    return {
      i: id,
      x,
      y,
      w: width,
      mimW: minWidth,
      maxW: maxWidth,
      h: height,
      minH: minHeight,
      maxH: maxHeight,
      resizeHandles,
    };
  },
  /**
   * Dashboard Card 정보 객체 반환 함수.
   *
   * @param {String} id card id 값.
   * @param {String} type card type 값. (table, tree, lineChart, doughnutChart)
   * @param {String} title card title 값.
   * @returns Dashboard Card 정보 객체
   */
  getDefaultCard: (id, type, title) => {
    return {
      id,
      type,
      title,
    };
  },
  /**
   * Dashboard Card Line Chart Card 객체 반환 함수.
   *
   * @param {String} id card id 값.
   * @param {String} type card type 값. (table, tree, lineChart, doughnutChart)
   * @param {String} title card title 값.
   * @param {String} width line chart 가로 길이.
   * @param {String} height line chart 세로 길이.
   * @param {Array} datasets line chart dataset 배열.
   * @param {Number} minY y축 최소 값.
   * @param {Number} maxY y축 최대 값.
   * @param {String} xText x축 타이틀 값.
   * @param {String} yText y축 타이틀 값.
   * @returns Dashboard Card Line Chart Card 객체
   */
  getLineCard: (id, type, title, width, height, datasets, minY, maxY, xText, yText) => {
    return {
      id,
      type,
      title,
      chart: {
        width,
        height,
        data: {
          datasets,
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'timeseries',
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'HH',
                  minute: 'HH:mm',
                  second: 'HH:mm:ss',
                },
              },
              ticks: {
                source: 'data',
              },
              title: {
                display: true,
                text: xText,
              },
              stacked: true,
            },
            y: {
              min: minY,
              max: maxY,
              title: {
                display: true,
                text: yText,
              },
            },
          },
          plugins: {
            zoom: {
              zoom: {
                drag: {
                  enabled: true,
                },
                mode: 'x',
              },
            },
          },
          transitions: {
            zoom: {
              animation: {
                duration: 1000,
                easing: 'easeOutCubic',
              },
            },
          },
        },
      },
    };
  },
  /**
   * Dashboard Card Doughnut Chart Card 객체 반환 함수.
   *
   * @param {*} id card id 값.
   * @param {*} type card type 값. (table, tree, lineChart, doughnutChart)
   * @param {*} title card title 값.
   * @param {*} width line chart 가로 길이.
   * @param {*} height line chart 세로 길이.
   * @param {*} datasets doughnut chart dataset 배열.
   * @returns Dashboard Card Doughnut Chart Card 객체
   */
  getDoughnutCard: (id, type, title, width, height, datasets) => {
    return {
      id,
      type,
      title,
      chart: {
        width,
        height,
        data: {
          datasets,
        },
        options: {
          maintainAspectRatio: false,

          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (item) => `${item.label}: ${item.dataset.label[item.dataIndex]}`,
              },
            },
          },
        },
      },
    };
  },
  /**
   * DB String date 14자리 포맷 변경 함수.
   *
   * @param {String} dateString DB String date 14자리.
   * @param {String} format 변경 포맷. ($1: YYYY, $2: MM, $3: DD, $4:HH, $5:mm, $6:ss)
   * @returns format 날짜
   */
  changeDateFormat: (dateString = '', format) => {
    return dateString
      ? dateString?.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, format)
      : '-';
  },
  /**
   * Date String에서 '-'(하이픈)을 제거하는 포맷 함수
   *
   * @param {String} dateString Date String 10자리.
   * @returns format 날짜
   */
  removeDateFormat: (dateString = '') => {
    return dateString ? dateString?.replace(/-/g, '') : '';
  },

  /**
   * Date String에서 '-'(하이픈), ':'(콜론), ' '(공백)을 제거하는 포맷 함수
   *
   * @param {String} dateString Date String 14자리. (YYYY-MM-DD HH:mm:ss)
   * @returns format 날짜 (YYYYMMDDHHmmss)
   */
  removeDateTimeFormat: (dateTime = '') => {
    return dateTime.replace(/[-:\s]/g, '');
  },

  /**
   * REGISTER_DATE 컬럼 값에 따른 렌더링 값 반환 함수.
   *
   * @param {Object} record MUI Table 컴포넌트 Row 데이터.
   * @param {*} format 출력 Date 포맷.
   * @param {*} flag 등록일 여부, true 기간 false 등록일.
   * @returns REGISTER_DATE 컬럼 값에 따른 렌더링 값
   */
  registerDateRender: (record, format, flag) => {
    if (flag) {
      const { startDate, endDate } = record.row;
      return `${startDate.replace(
        /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
        format,
      )} ~ ${endDate.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, format)}`;
    } else {
      return record.row.registerDate.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, format);
    }
  },
  /**
   * React-table REGISTER_DATE 컬럼 값에 따른 렌더링 값 반환 함수.
   * @param {Object} record React-table 컴포넌트 Row 데이터.
   * @param {*} format 출력 Date 포맷.
   * @param {*} flag 등록일 여부, true 기간 false 등록일.
   * @returns REGISTER_DATE 컬럼 값에 따른 렌더링 값
   */
  reactRegisterDateRender: (record, format, flag, columnId) => {
    if (flag) {
      const { startDate, endDate } = record.original;
      return `${startDate?.replace(
        /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
        format,
      )} ~ ${endDate?.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, format)}`;
    } else {
      return record.original[`${columnId}`]?.replace(
        /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
        format,
      );
    }
  },
  /**
   * USE_YN 컬럼 값에 따른 렌더링 값 반환 함수.
   *
   * @param {String} params 서버로부터 전달받은 USE_YN 값.
   * @returns USE_YN 컬럼 값에 따른 렌더링 값
   */
  useYnRender: (params) => {
    return params.value === 'Y' ? '사용 중' : '사용 중지';
  },

  /**
   * 함수 직렬화 함수.
   * @param {Function} func
   * @returns 함수 문자열 정보.
   */
  serializeFunction: (func) => func.toString(),

  /**
   * 함수 역직렬화 함수.
   * @param {*} funcString
   * @returns 함수(deserializeFunction(funcString)() 방식으로 실행.)
   */
  deserializeFunction: (funcString) => new Function(`return ${funcString}`)(),
  checkValidity: (dataList, columns, openModal) => {
    let count = 0;
    for (let i = 0; i < dataList.length; i++) {
      const status = dataList[`${i}`].status;
      if (status !== null && status !== '') {
        count++;
        break;
      }
    }
    if (count === 0) {
      if (openModal)
        openModal({
          message: '수정된 내용이 없습니다.',
        });
      return true;
    }
    for (let i = 0; i < dataList.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (
          columns[`${j}`].nullCheck &&
          (dataList[`${i}`][columns[`${j}`].accessor] === null ||
            dataList[`${i}`][columns[`${j}`].accessor] === undefined ||
            dataList[`${i}`][columns[`${j}`].accessor] === '')
        ) {
          let message = columns[`${j}`].Header + '을 입력하세요';
          if (openModal)
            openModal({
              message: message,
            });
          return true;
        }
      }
    }
  },
  //그리드 정보 조회
  getGridInfo: getGridInfoInternal,

  // 그리드 컬럼 정보 조회
  getGridColumn: getGridColumnInternal,

  // 그리드 마지막 ID 조회
  getId: (table) => {
    return (
      BigInt(
        table.length > 0
          ? table.reduce(function (prev, current) {
              return prev.id > current.id ? prev : current;
            }).id
          : 0,
      ) + 1n
    ).toString();
  },

  // 그리드 마지막 ID 조회
  getIdx: (table) => {
    return (
      BigInt(
        table.length > 0
          ? table.reduce(function (prev, current) {
              return prev.idx > current.idx ? prev : current;
            }).idx
          : 0,
      ) + 1n
    ).toString();
  },

  /**
   * React Table Cell 파라미터 설정 코드 목록 반환 함수.
   * @param {Array} columns 전체 컬럼 목록.
   * @param {String} name Cell accessor 값.
   * @returns 해당 Cell의 파라미터 설정 코드 목록
   */
  getCellSelectList: (columns, name) => {
    if (columns.length !== 0)
      return columns.find((column) => column.accessor === name).valueOptions;
    else return [];
  },

  /**
   *
   * 날짜 기간 검증 함수,
   * 시작 날짜 > 종료날짜 false
   * 종료날짜 < 시작날짜 false
   * @param {Date} startDate  YYYY-MM-DD 포맷 날짜.
   * @param {Date} endDate YYYY-MM-DD 포맷 날짜.
   * @returns
   */
  isValidDatePeriod: (startDate, endDate) => {
    if (!moment.isMoment(startDate) || !moment.isMoment(endDate)) return;

    if (moment(startDate).isAfter(endDate) || moment(endDate).isBefore(startDate)) {
      return '기간을 확인해주세요.';
    }

    return true;
  },

  /**
   * JWT Token payload 객체 반환 함수.
   * @returns JWT Token payload 객체.
   */
  getTokenPayload: async (req) => {
    const { accessToken } = await getSession(req);
    return jwt_decode(accessToken);
  },

  /**
   * Select용 코드 목록 반환 함수.
   * @param {Array} list 코드목록
   * @returns Label, value 객체 목록.
   */
  makeCodeList: (list) => {
    return list.data.content.map((code) => {
      return { label: code.codeDesc, value: code.codeValue };
    });
  },

  /**
   * 날짜 계산 함수.
   * @param {Function, String, String, String, String}
   * setParameters 변수, [ F(이전) || E(이후) ], [ 1D || 1M || 1Y ], 시작날 변수명, 종료날 변수명
   * param1: setParameters 객체
   * param2: 'F' => param3 이전 날짜부터 현재 날짜,
   *         'E' => 현재 날짜부터 param3 이후 날짜
   * param3: 'D' => 1D (1일)
   *         'M' => 1M (1달)
   *         'Y' => 1Y (1년)
   * param4: 검색 조건 시작날(변수명) default : fday
   * param5: 검새 조건 종료날(변수명) default : eday
   *
   * @returns fday, eday 계산된 날짜
   */
  getDefaultDateInput: (
    setParameters,
    flag,
    param,
    firstDateColNm = 'fday',
    lastDateColNm = 'eday',
  ) => {
    param = param.toUpperCase();
    flag = flag.toUpperCase();

    let countDay = Number(param.slice(0, param.length - 1));
    const gubun = param.charAt(param.length - 1); // D, M, Y

    const today = new Date();
    let newDate = null;

    if (flag === 'F') countDay = countDay * -1;

    switch (gubun) {
      case 'D': // 일
        newDate = new Date(today.setDate(today.getDate() + countDay)).toLocaleDateString();
        break;

      case 'M': // 달
        newDate = new Date(today.setMonth(today.getMonth() + countDay)).toLocaleDateString();
        break;

      case 'Y': // 년
        newDate = new Date(today.setFullYear(today.getFullYear() + countDay)).toLocaleDateString();
        break;
    }

    let arrNewDate = newDate.replace(/ /g, '').split('.');
    let arrToday = new Date();

    if (arrNewDate[1].length == 1) {
      arrNewDate[1] = arrNewDate[1].padStart(2, '0');
    }
    if (arrNewDate[2].length == 1) {
      arrNewDate[2] = arrNewDate[2].padStart(2, '0');
    }
    const year = arrToday.getFullYear();
    const month = arrToday.getMonth() + 1;
    const day = arrToday.getDate();

    if (flag === 'F')
      return setParameters((prev) => ({
        ...prev,
        [firstDateColNm]: arrNewDate[0] + '-' + arrNewDate[1] + '-' + arrNewDate[2],
        [lastDateColNm]: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0',
        )}`,
      }));
    else
      return setParameters((prev) => ({
        ...prev,
        [firstDateColNm]: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0',
        )}`,
        [lastDateColNm]: arrNewDate[0] + '-' + arrNewDate[1] + '-' + arrNewDate[2],
      }));
  },

  /**
   * 날짜 계산 함수.
   * @param {Function, String, String, String, String}
   * setValues, [ F(이전) || E(이후) ], [ 1D || 1M || 1Y ], 시작날 변수명, 종료날 변수명
   * param1: setValue 함수
   * param2: 'F' => param3 이전 날짜부터 현재 날짜,
   *         'E' => 현재 날짜부터 param3 이후 날짜
   * param3: 'D' => 1D (1일)
   *         'M' => 1M (1달)
   *         'Y' => 1Y (1년)
   * param4: 검색 조건 시작날(변수명) default : fday
   * param5: 검새 조건 종료날(변수명) default : eday
   *
   */
  getDefaultDateForm: (setValue, flag, param, firstVarNm = 'fday', lastVarNm = 'eday') => {
    param = param.toUpperCase();
    flag = flag.toUpperCase();

    let countDay = Number(param.slice(0, param.length - 1));
    const gubun = param.charAt(param.length - 1);

    if (flag === 'F') countDay *= -1;

    const today = new Date();
    let newDate = null;

    switch (gubun) {
      case 'D':
        newDate = new Date(today.setDate(today.getDate() + countDay)).toLocaleDateString('ko-KR');
        break;
      case 'M':
        newDate = new Date(today.setMonth(today.getMonth() + countDay)).toLocaleDateString('ko-KR');
        break;
      case 'Y':
        newDate = new Date(today.setFullYear(today.getFullYear() + countDay)).toLocaleDateString(
          'ko-KR',
        );
        break;
    }

    const arrNewDate = newDate.replace(/ /g, '').split('.');
    let arrToday = new Date();

    if (arrNewDate[1].length == 1) {
      arrNewDate[1] = arrNewDate[1].padStart(2, '0');
    }
    if (arrNewDate[2].length == 1) {
      arrNewDate[2] = arrNewDate[2].padStart(2, '0');
    }
    const year = arrToday.getFullYear();
    const month = arrToday.getMonth() + 1;
    const day = arrToday.getDate();

    if (flag === 'F') {
      setValue(firstVarNm, `${arrNewDate[0]}-${arrNewDate[1]}-${arrNewDate[2]}`);
      setValue(
        lastVarNm,
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      );
    } else {
      setValue(
        firstVarNm,
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      );
      setValue(lastVarNm, `${arrNewDate[0]}-${arrNewDate[1]}-${arrNewDate[2]}`);
    }
  },

  /**
   * 날짜 계산 함수.
   *
   * @return 'YYYY-MM-DD' 형식의 오늘 날짜 String.
   */
  getTodayDate: () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  },

  /**
   * 날짜 시간 계산 함수.
   *
   * @return 'YYYY-MM-DD HH:mm:ss' 형식의 오늘 날짜 String.
   */
  getTodayDateTime: (beforeDateInfo = '') => {
    let date = new Date();

    let param = beforeDateInfo.toUpperCase();

    let countDay = Number(param.slice(0, -1));
    const gubun = param.charAt(param.length - 1);

    switch (gubun) {
      case 'D':
        date.setDate(date.getDate() - countDay);
        break;
      case 'M':
        date.setMonth(date.getMonth() - countDay);
        break;
      case 'Y':
        date.setFullYear(date.getFullYear() - countDay);
        break;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
      2,
      '0',
    )} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`;

    return formattedDate;
  },

  /**
   * 날짜 계산 함수.
   * @param {String, String}
   * eday, [ 1D || 1M || 1Y ]
   * param1: 'D' => 1D (1일)
   *         'M' => 1M (1달)
   *         'Y' => 1Y (1년)
   * param2: 종료일
   *
   * @return eday에서 param 이전의 날짜 값
   */
  getBeforeDate: (param, eday = HsLib.getTodayDate()) => {
    param = param.toUpperCase();

    let countDay = Number(param.slice(0, param.length - 1));
    const gubun = param.charAt(param.length - 1);

    const edate = new Date(eday);
    let newDate = new Date(eday);

    switch (gubun) {
      case 'D':
        newDate = new Date(edate.setDate(edate.getDate() - countDay));
        break;
      case 'M':
        newDate = new Date(edate.setMonth(edate.getMonth() - countDay));
        break;
      case 'Y':
        newDate = new Date(edate.setFullYear(edate.getFullYear() - countDay));
        break;
    }

    const year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  },

  /**
   * 날짜 계산 함수.
   * @param {String, String}
   * fday, [ 1D || 1M || 1Y ]
   * param1: 'D' => 1D (1일)
   *         'M' => 1M (1달)
   *         'Y' => 1Y (1년)
   * param2: 시작일
   *
   * @return fday에서 param 이후의 날짜 값
   */
  getAfterDate: (param, fday = HsLib.getTodayDate()) => {
    param = param.toUpperCase();

    let countDay = Number(param.slice(0, param.length - 1));
    const gubun = param.charAt(param.length - 1);

    const fdate = new Date(fday);
    let newDate = null;

    switch (gubun) {
      case 'D':
        newDate = new Date(fdate.setDate(fdate.getDate() + countDay)).toLocaleDateString();
        break;
      case 'M':
        newDate = new Date(fdate.setMonth(fdate.getMonth() + countDay)).toLocaleDateString();
        break;
      case 'Y':
        newDate = new Date(fdate.setFullYear(fdate.getFullYear() + countDay)).toLocaleDateString();
        break;
    }

    const arrNewDate = new Date();

    const year = arrNewDate.getFullYear();
    const month = arrNewDate.getMonth() + 1;
    const day = arrNewDate.getDate();

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  },

  /**
   * 날짜 계산 함수.
   * @param {String, Function, String, String}
   * fday, setValues, [ 1D || 1M || 1Y ], 종료날 변수명
   * param1: 시작일
   * param2: setValue 함수
   * param3: 'D' => 1D (1일)
   *         'M' => 1M (1달)
   *         'Y' => 1Y (1년)
   * param4: 검새 조건 종료날(변수명) default : eday
   *
   */
  setFormEndDate: (fday, setValue, param, lastVarNm = 'eday') => {
    const afterDate = HsLib.getAfterDate(param, fday);
    setValue(lastVarNm, afterDate);
  },

  // input 박스 값이 변경되었을 경우
  searchInputChange: (e, parameters, setParameters, useGroup) => {
    if (e.keyCode === 13) return;
    if (!useGroup) {
      return setParameters({
        ...parameters,
        searchUserSeq: '',
        searchUserInfo: e.target.value,
      });
    } else {
      return setParameters({ ...parameters, grpSeq: '', grpName: e.target.value });
    }
  },

  // select box 선택했을 경우
  searchSelectTag: (value, parameters, setParameters, useGroup) => {
    if (value != null) {
      let labelValue = value && value.label ? value.label.split('^^^^&')[0] : value;
      if (!useGroup) {
        return setParameters({
          ...parameters,
          searchUserSeq: value.searchUserSeq,
          searchUserInfo: labelValue,
        });
      } else {
        return setParameters({
          ...parameters,
          grpSeq: value.grpSeq,
          grpName: labelValue,
        });
      }
    } else {
      if (!useGroup) {
        return setParameters({
          ...parameters,
          searchUserSeq: '',
          searchUserInfo: '',
        });
      } else {
        return setParameters({ ...parameters, grpSeq: '', grpName: '' });
      }
    }
  },
  /**
   * 숫자에 Comma를 추가하여 반환하는 함수.
   *
   * @param {String, Number} value
   * @returns 입력받은 숫자에 comma가 추가된 String
   */
  addNumberComma: (value = '') => {
    try {
      const parts = value.toString().split('.');
      // eslint-disable-next-line security/detect-unsafe-regex
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    } catch (e) {
      return value;
    }
  },
  /**
   * 숫자에서 Comma를 제거하여 반환하는 함수.
   *
   * @param {String} value
   * @returns 입력받은 숫자에서 comma가 제거된 String
   */
  removeNumberComma: (value = '') => {
    try {
      return value.toString().replace(/,/g, '');
    } catch (e) {
      return value;
    }
  },

  removeTimeFormat: (timeString = '') => {
    return timeString ? timeString?.replace(/:/g, '') : '';
  },

  /**
   * 개행문자가 포함된 문자열을 받아 <br />을 추가하여 반환하는 함수.
   *
   * @param {String} value
   * @returns 개행문자를 <br />로 변환하여 반환
   */
  formatNewlineString: (value = '') => {
    const childrenKey = Math.random().toString(16).substring(2, 8);
    return value.split('\n').map((text, i) => {
      return (
        <span key={`content-${childrenKey}-${i}`}>
          {text}
          <br />
        </span>
      );
    });
  },

  /**
   * 날짜 계산 함수.
   * @param {Object, Function, (Object || Function), Object, boolean}
   * Event 오브젝트, setEnabledFlag 함수, methods(form) 또는 setParameters(useInput), disabled 처리할 오브젝트 {inputName : ['처리할 값1','처리할 값2']}, selecbox 기본 값(= '') 선택 시 true 리턴
   * param1: 이벤트 객체
   * param2: setEnabledFlag 함수
   *         구조: enabledFlag : {inputNameFlag: false, inputNameFlag2: true, ...}
   * param3: methods(form) 또는 setParameters(useInput)
   * param4: useState(enabledFlag)에 정의된 key 값과 selectbox의 특정 값 리스트(enabled true할 값)
   *         구조: {inputNameFlag: ['D', 'I'], inputNameFlag2: ['A', 'G'], ...}
   * param5: 기본 값(= '') 선택 시 true 리턴 (true 일 경우 활성화) && 값 초기화 X
   *
   * @returns [ list안에 값이 일치하면 true 리턴 || false일 경우 input val 값 '' 으로 초기화 ] && 선택한 요소의 value 값 세팅(setParameters 한정)
   */
  flagStatusChange: (event, setFlag, setValObj, list, defaultEnabledTrue = false) => {
    let val = '';
    try {
      val = event._reactName === 'onClick' ? event.target.dataset.value : event.target.value;
    } catch {
      val = event;
    }
    const listArray = Object.entries(list);
    listArray.map(([key, value]) => {
      const flag = value.includes(val);
      if (!defaultEnabledTrue) {
        // 값이 선택 되었을 때
        // list 안에 포함되면 flag = true 리턴 && 값 초기화 X
        if (val !== '' && val !== undefined) {
          return [
            setFlag((prevState) => ({
              ...prevState,
              [key]: flag,
            })),
            flag === false
              ? typeof setValObj.handleSubmit !== 'undefined'
                ? // form 일 경우
                  setValObj.setValue(key, '')
                : // setParameters 인 경우
                  setValObj((prev) => ({ ...prev, [key]: '', [event.target.name]: val }))
              : null,
          ];
          // 값이 선택되지 않았을 때
          // 모든 값 초기화 && flag = false 리턴
        } else {
          if (val === undefined) return null;
          return [
            setFlag((prevState) => ({
              ...prevState,
              [key]: false,
            })),
            typeof setValObj.handleSubmit !== 'undefined'
              ? // form 일 경우
                setValObj.setValue(key, '')
              : // setParameters 인 경우
                setValObj((prev) => ({ ...prev, [key]: '', [event.target.name]: val })),
          ];
        }
      } else {
        // 값이 선택 되었을 때
        // list 안에 포함되면 flag = true 리턴 && 값 초기화 X
        if (val !== '' && val !== undefined) {
          return [
            setFlag((prevState) => ({
              ...prevState,
              [key]: flag,
            })),
            flag === false
              ? typeof setValObj.handleSubmit !== 'undefined'
                ? // form 일 경우
                  setValObj.setValue(key, '')
                : // setParameters 인 경우
                  setValObj((prev) => ({ ...prev, [key]: '', [event.target.name]: val }))
              : null,
          ];
        } else {
          if (val === undefined) return null;
          // 값이 선택되지 않았을 때
          // 모든 값 초기화 X && flag = true 리턴
          return [
            setFlag((prevState) => ({
              ...prevState,
              [key]: true,
            })),
            // setParameters 인 경우
            typeof setValObj.handleSumbit === 'undefined'
              ? setValObj((prev) => ({ ...prev, [event.target.name]: val }))
              : null,
          ];
        }
      }
    });
  },
  /**
   * 첨부파일명 특수문자 확인 함수.
   * @param {Array} fileList 파일목록
   * @returns newFileList, message 객체 목록.
   */
  fileNameCheck: (fileList) => {
    let message = '';

    if (fileList != undefined || fileList.length != 0) {
      fileList.map((data) => {
        const pattern = /[\\{\\}\\/?,;:|*~`!^\\+<>@\\#$%&\\\\=\\'\\"]/gi;

        if (pattern.test(data.name)) {
          fileList.pop(data.name);
          message = "파일명에 허용된 특수문자는 '-', '_', '(', ')', '[', ']', '.' 입니다.";
        }
      });
    }

    return { newFileList: fileList, message: message };
  },

  openPopup(openUrl, openName, dWithd, dHeight) {
    let x = 0,
      y = 0;
    let dlgWidth = dWithd;
    let dlgHeight = dHeight;
    x = (window.screen.availWidth - dlgWidth) / 2 + window.screenX;
    y = (window.screen.availHeight - dlgHeight) / 2 + window.screenY;
    let win = window.open(
      openUrl,
      openName,
      'left=' +
        x +
        ',top=' +
        y +
        ',width=' +
        dlgWidth +
        ',height=' +
        dlgHeight +
        ',toolbar=0,menubar=0,resizable=no,status=1,scrollbars=yes',
    );
    win.focus();

    return win;
  },

  isValidId(userId, { idMinLen, idEminLen, idNminLen }) {
    if (userId.length < parseInt(idMinLen)) return false;

    let eCnt = 0,
      nCnt = 0;

    for (const userIdChar of userId) {
      if (userIdChar.search(/^.*([A-Za-z]+).*$/) != -1) eCnt++;
      if (userIdChar.search(/^.*([0-9]+).*$/) != -1) nCnt++;
    }

    if (eCnt < parseInt(idEminLen)) return false;
    if (nCnt < parseInt(idNminLen)) return false;

    return true;
  },

  isValidPassword(loginPassword, userInfoRules, userId, userName) {
    if (
      loginPassword.length < parseInt(userInfoRules.pwdMinLen) ||
      loginPassword.length > parseInt(userInfoRules.pwdMaxLen)
    )
      return false;

    if (userId && userInfoRules.idPwdInId === 'Y' && loginPassword.indexOf(userId) > -1)
      return false;

    if (userName && userInfoRules.idPwdInName === 'Y' && loginPassword.indexOf(userName) > -1)
      return false;

    // eslint-disable-next-line security/detect-non-literal-regexp
    const regx = new RegExp('.*(.)\\1{' + (parseInt(userInfoRules.scCntLimit) - 1) + '}.*');
    if (loginPassword.search(regx) != -1) return false;

    if (!HsLib.checkConsecutiveCharacters(loginPassword, parseInt(userInfoRules.ccCntLimit)))
      return false;

    let nCnt = 0,
      esCnt = 0,
      ebCnt = 0,
      scCnt = 0;

    for (const loginPasswordChar of loginPassword) {
      if (loginPasswordChar.search(/^.*([0-9]+).*$/) != -1) nCnt++;
      if (loginPasswordChar.search(/^.*([a-z]+).*$/) != -1) esCnt++;
      if (loginPasswordChar.search(/^.*([A-Z]+).*$/) != -1) ebCnt++;
      if (loginPasswordChar.search(/^.*([^A-Za-z0-9]+).*$/) != -1) scCnt++;
    }

    if (nCnt < parseInt(userInfoRules.numMinLen)) return false;
    if (esCnt < parseInt(userInfoRules.esMinLen)) return false;
    if (ebCnt < parseInt(userInfoRules.ebMinLen)) return false;
    if (scCnt < parseInt(userInfoRules.scMinLen)) return false;

    return true;
  },

  checkConsecutiveCharacters(str, limit) {
    let o,
      d,
      p,
      n = 0,
      l = limit;

    for (const i of str) {
      const c = str.charCodeAt(i);
      if (i > 0 && (p = o - c) > -2 && p < 2 && (n = p == d ? n + 1 : 0) > l - 3) return false;
      (d = p), (o = c);
    }

    return true;
  },

  camelCaseToSnakeCase(inputString) {
    let result = inputString.replace(/([A-Z])/g, ' $1');
    return result.split(' ').join('_').toLowerCase();
  },

  windowResize(width, height) {
    const borderWidth = window.outerWidth - window.innerWidth;
    const borderHeight = window.outerHeight - window.innerHeight;

    window.resizeTo(width + borderWidth, height + borderHeight);
  },

  comboList: async (api, codeType) => {
    const comboResultList = await api.getComboList(codeType);

    let resultList = [];
    comboResultList.forEach((item) =>
      resultList.push({ label: item.codeDesc, value: item.codeValue }),
    );

    return resultList;
  },
  bytesToSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[`${i}`]}`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[`${i}`]}`;
  },
  findCodeDescFromCache(value, codeType, codeCacheList) {
    if (!value) return '';
    const codeInfo = codeCacheList[`${codeType}`].find((code) => code.value === value);

    if (!codeInfo) return null;
    return codeInfo.label;
  },
  makeMiniTableColumn(id, label, colSpan, sticky = false, options, render = null, codeType) {
    const column = { id, label, sticky };

    if (colSpan) column.colSpan = colSpan;
    if (options) column.options = options;
    if (render) column.render = render;
    if (codeType) column.codeType = codeType;

    return column;
  },

  loadLocaleData: (locale) => {
    switch (locale) {
      case 'en':
        return import('@modules/utils/locales/merge-en');
      default:
        return import('@modules/utils/locales/merge-ko');
    }
  },

  getIntl: async () => {
    const locale = JSON.parse(localStorage.getItem('hsck-web-config'))?.i18n;
    const messages = await HsLib.loadLocaleData(locale).then((d) => {
      return d.default;
    });

    const cache = createIntlCache();
    const intl = createIntl({ locale, messages }, cache);
    return intl;
  },
};

export default HsLib;
