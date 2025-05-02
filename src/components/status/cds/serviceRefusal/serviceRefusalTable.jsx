import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function ServiceRefusalTable() {
  return (
    <GridItem item>
      <HsReduxTable name="serviceRefusalHistory" />
    </GridItem>
  );
}

export default ServiceRefusalTable;
