import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function MessageFilterHistoryTable() {
  return (
    <GridItem item>
      <HsReduxTable name="messageFilterHis" />
    </GridItem>
  );
}

export default MessageFilterHistoryTable;
