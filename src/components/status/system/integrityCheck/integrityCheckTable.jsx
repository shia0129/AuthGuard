import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function IntegrityCheckTable() {
  return (
    <GridItem item>
      <HsReduxTable name="integrityCheck" />
    </GridItem>
  );
}

export default IntegrityCheckTable;
