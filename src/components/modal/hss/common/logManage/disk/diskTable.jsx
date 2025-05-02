import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function DiskTable() {
  return (
    <GridItem item>
      <HsReduxTable name="disk" />
    </GridItem>
  );
}
export default DiskTable;
