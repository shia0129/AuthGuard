import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function TransmissionTable() {
  return (
    <GridItem item>
      <HsReduxTable name="transHistory" />
    </GridItem>
  );
}
export default TransmissionTable;
