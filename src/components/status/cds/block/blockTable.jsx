import GridItem from '@components/modules/grid/GridItem';
import { useDispatch, useSelector } from 'react-redux';
import { setParameters, setTransmissionBlockList } from '@modules/redux/reducers/transBlock';
import HsReactTable from '@components/modules/table/HsReactTable';

function BlockTable({ gridInfo }) {
  const parameterData = useSelector((state) => state.transBlock);
  const dispatch = useDispatch();

  return (
    <GridItem item>
      <HsReactTable
        columns={parameterData.columns}
        data={parameterData.transmissionBlockList || []}
        gridInfo={gridInfo}
        parameters={parameterData.parameters}
        setParameters={(data) => dispatch(setParameters(data))}
        setData={(data) => dispatch(setTransmissionBlockList({ transmissionBlockList: data }))}
      />
    </GridItem>
  );
}
export default BlockTable;
