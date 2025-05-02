import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function CpuMemoryTable() {
  return (
    <GridItem item>
      <HsReduxTable name="cpuMemoryHis" />
    </GridItem>
  );
}
export default CpuMemoryTable;
