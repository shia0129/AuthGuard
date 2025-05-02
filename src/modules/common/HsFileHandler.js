import FileSaver from 'file-saver';
import jsPDF from 'jspdf';
// import '@public/font/malgun-normal.js';
import 'jspdf-autotable';
import _ from 'lodash';

const HsFileHandler = {
  saveAsExcel(response, fileName) {
    try {
      const { status, data, headers } = response;
      if (status === 200) {
        let name = decodeURI(headers['content-disposition'].split('filename=')[1]).replace(
          /\+/g,
          ' ',
        );
        // name = name.substring(1, name.length - 1);
        const contentType = headers['content-type'];
        const blob = new Blob([data], { type: contentType + ';charset=utf-8' });

        FileSaver.saveAs(blob, fileName || name);
        return { isSuccess: true, message: '' };
      } else {
        throw Error('파일 다운로드 실패.');
      }
    } catch (error) {
      return { isSuccess: false, message: error.message };
    }
  },

  saveAsGridPDF: async ({
    name,
    horizontal = false,
    searchInfo,
    tableInfo: { columns = [], rows = [] },
  }) => {
    const doc = new jsPDF({
      orientation: horizontal ? 'landscape' : 'portrait',
    });

    // 폰트 설정
    const font = await import('@public/font/malgun-normal.js');
    doc.addFileToVFS('malgun-normal.ttf', font.default);
    doc.addFont('malgun-normal.ttf', 'malgun', 'normal');
    doc.setFont('malgun');

    // 제목 설정
    doc.setFontSize(24);
    doc.text(name, 5, 20);

    // 페이지 너비 계산
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 5;
    const lineHeight = 10; // 각 행의 높이
    const maxItemsPerRow = Math.floor((pageWidth - 2 * margin) / 80); // 한 줄에 배치할 수 있는 최대 항목 수

    if (!_.isEmpty(searchInfo)) {
      const parameters = [...searchInfo].filter((item) => item.value);
      if ('page' in parameters) delete parameters.page;
      if ('size' in parameters) delete parameters.size;

      // 동적 높이 계산을 위한 초기 설정
      const initialYPosition = 30; // 사각형의 초기 Y 위치

      // 필요한 높이 계산
      const totalRows = Math.ceil(parameters.length / maxItemsPerRow);
      const rectHeight = totalRows * lineHeight + 10; // 사각형의 최종 높이 (여유 공간 포함)

      // 사각형 배경 그리기
      doc.setFillColor('#b8c4ff');
      doc.roundedRect(margin, initialYPosition, pageWidth - 2 * margin, rectHeight, 2, 2, 'F');

      // 텍스트 설정
      doc.setFontSize(8);

      // 각 항목의 간격 및 위치 계산
      const startX = margin + 5; // 첫 번째 열의 시작 x 위치
      let startY = initialYPosition + 5; // 첫 번째 행의 y 위치 (사각형 내부 여백 고려)

      let currentX = startX; // 현재 x 위치
      let currentY = startY; // 현재 y 위치
      const labelValueSpacing = 20; // 레이블과 값 사이의 간격

      parameters.forEach((param, index) => {
        // 긴 텍스트가 페이지 너비를 초과하지 않도록 위치 조정
        const textWidth = doc.getTextWidth(param.value);
        if (currentX + textWidth > pageWidth - margin) {
          // 다음 줄로 넘어가기
          currentX = startX;
          currentY += lineHeight;
        }

        // 레이블 및 값 추가
        doc.text(`${param.label} : `, currentX, currentY);
        doc.text(param.value, currentX + labelValueSpacing, currentY);

        // x 위치 조정 (다음 항목을 위한 공간 확보)
        currentX += 80; // 레이블과 값 사이의 간격을 고려하여 이동

        // 다음 줄로 넘어가기
        if ((index + 1) % maxItemsPerRow === 0) {
          currentX = startX;
          currentY += lineHeight;
        }
      });
    }

    // 테이블 추가
    doc.autoTable({
      startY:
        20 + (searchInfo ? Math.ceil(searchInfo.length / maxItemsPerRow) * lineHeight + 10 : 0), // 사각형 아래 위치 조정
      columns, // 테이블 헤더 배열
      body: rows, // 테이블 본문 데이터 배열
      theme: 'striped', // 테이블 테마 (옵션)
      margin: { left: 5, right: 5 }, // 여백 설정
      styles: {
        fontSize: 10, // 글꼴 크기 설정
        font: 'malgun', // 사용자 정의 폰트 설정
      },
    });

    // PDF 저장
    doc.save(`${name}.pdf`);
  },
};

export default HsFileHandler;
