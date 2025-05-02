import GridItem from '@components/modules/grid/GridItem';
import ReactTable from '@components/modules/table/ReactTable';
import { useDispatch, useSelector } from 'react-redux';
import { setParameters, setNoticeList } from '@modules/redux/reducers/notice';

function NoticeTable({ gridInfo, setGridInfo }) {
  const parameterData = useSelector((state) => state.notice);
  const dispatch = useDispatch();

  return (
    <GridItem item container direction="row" sx={{ flexWrap: 'nowrap' }} columnSpacing={0}>
      <GridItem item xs sx={{ minWidth: 0 }}>
        <ReactTable
          listFuncName="getNoticeList"
          columns={parameterData.columns}
          data={parameterData.noticeList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={parameterData.parameters}
          setParameters={(data) => dispatch(setParameters(data))}
          setData={(data) => dispatch(setNoticeList({ noticeList: data }))}
          reduxData
        />
      </GridItem>
    </GridItem>
  );
}

export default NoticeTable;
