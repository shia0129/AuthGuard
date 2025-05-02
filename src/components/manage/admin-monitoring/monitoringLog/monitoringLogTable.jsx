import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function MonitoringLogTable() {
  return (
    <GridItem item>
      <HsReduxTable name="monitoringLog" />
    </GridItem>
  );
}

export default MonitoringLogTable;
