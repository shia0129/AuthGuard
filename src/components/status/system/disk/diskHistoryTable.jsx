import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function DiskHistoryTable() {
  return (
    <GridItem item>
      <HsReduxTable name="diskHis" />
    </GridItem>
  );
}
export default DiskHistoryTable;
