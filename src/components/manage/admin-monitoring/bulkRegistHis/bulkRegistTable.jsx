import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import Image from 'next/image';
import ExcelIcon from '@public/images/excel.gif';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
const myLoader = ({ src }) => {
  return src; // 정적 경로 그대로 반환
};
function BulkRegistTable() {
  const { columns } = useSelector((state) => state.bulkRegistHis);
  const makeColumns = () =>
    columns.map((column) => {
      switch (column.accessor) {
        case 'failFileDownload':
          return {
            ...column,
            Cell: (props) => {
              return renderFailFileDownloadCell(props);
            },
          };
        default:
          break;
      }
      return column;
    });
  const renderFailFileDownloadCell = useCallback(({ value }) => {
    const getFailFileDownloadExcel = () => {
      // TODO: 실패 파일 다운로드 API 연결.
    };
    return (
      <Image
        loader={myLoader}
        unoptimized
        style={{ cursor: 'pointer' }}
        src={ExcelIcon}
        alt="failFileExcel"
        onClick={getFailFileDownloadExcel}
      />
    );
  }, []);

  return (
    <GridItem item>
      <HsReduxTable name="bulkRegistHis" customColumn={makeColumns()} />
    </GridItem>
  );
}

export default BulkRegistTable;
