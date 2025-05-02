import GridItem from '@components/modules/grid/GridItem';
import HsReactTable from '@components/modules/table/HsReactTable';
import { setModalParameters, setPasswordFailList } from '@modules/redux/reducers/adminBlock';
import { useDispatch, useSelector } from 'react-redux';

function AdminPasswordFailTable(props) {
  const { columns, gridInfo, setGridInfo } = props;

  const parameterData = useSelector((state) => state.adminBlock);
  const dispatch = useDispatch();

  return (
    <GridItem spacing={2} container direction="column">
      <GridItem item>
        <HsReactTable
          columns={columns}
          data={parameterData.passwordFailList}
          setData={(data) => dispatch(setPasswordFailList(data))}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={parameterData.parameters}
          setParameters={(data) => dispatch(setModalParameters(data))}
        />
      </GridItem>
    </GridItem>
  );
}

export default AdminPasswordFailTable;
