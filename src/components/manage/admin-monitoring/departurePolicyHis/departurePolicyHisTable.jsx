import GridItem from '@components/modules/grid/GridItem';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

function DeparturePolicyHisTable() {
  const { columns } = useSelector((state) => state.departurePolicyHis);

  const makeColumns = () =>
    columns.map((column) => {
      switch (column.accessor) {
        case 'jobEnd':
        case 'jobStart':
          return {
            ...column,
            Cell: (props) => {
              return renderTimeCell(props);
            },
          };

        default:
          break;
      }
      return column;
    });

  const renderTimeCell = useCallback(({ value }) => `${value.slice(0, 2)}:${value.slice(2)}`, []);

  return (
    <GridItem item>
      <HsReduxTable name="departurePolicyHis" customColumn={makeColumns()} />
    </GridItem>
  );
}

export default DeparturePolicyHisTable;
