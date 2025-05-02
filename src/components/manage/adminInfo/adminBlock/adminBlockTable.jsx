import GridItem from '@components/modules/grid/GridItem';
import HsReactTable from '@components/modules/table/HsReactTable';
import { setAdminBlockList, setParameters } from '@modules/redux/reducers/adminBlock';
import { useDispatch, useSelector } from 'react-redux';

function AdminBlockTable(props) {
  const { columns, gridInfo, setGridInfo } = props;

  const parameterData = useSelector((state) => state.adminBlock);
  const dispatch = useDispatch();

  return (
    <GridItem item>
      <HsReactTable
        columns={columns}
        data={parameterData.adminBlockList}
        gridInfo={gridInfo}
        setGridInfo={setGridInfo}
        parameters={parameterData.parameters}
        setParameters={(data) => dispatch(setParameters(data))}
        setData={(data) => dispatch(setAdminBlockList(data))}
      />
    </GridItem>
  );
}

export default AdminBlockTable;
