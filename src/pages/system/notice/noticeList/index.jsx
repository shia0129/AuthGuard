import { useState, useEffect, useCallback ,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import noticeApi from '@api/system/noticeApi';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import NoticeSearchForm from '@components/system/notice/noticeSearchForm';
import NoticeActionButtons from '@components/system/notice/noticeActionButtons';
import NoticeTable from '@components/system/notice/noticeTable';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import { setNoticeList, setColumns } from '@modules/redux/reducers/notice';
import { setParameters } from '@modules/redux/reducers/notice';

function NoticeList() {
  const { instance, source } = AuthInstance();

  noticeApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.notice);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: noticeApi,
    parameters: parameterData.parameters,
    listInfo: {},
    total: 0,
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('NoticeList', noticeApi);

    setGridInfo((prev) => {
      return { ...prev, listInfo: gridInfo.listInfo };
    });

    dispatch(
      setParameters({
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: Number(gridInfo.listInfo.size),
      }),
    );

    await getNoticeList(parameterData.parameters.current);

    makeColumns(gridInfo.columns);
  };

  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'boardUseYn':
          column.valueOptions = [
            { value: '0', label: '사용안함' },
            { value: '1', label: '사용' },
          ];
          break;
        case 'boardDisplayLocation':
          column.valueOptions = [
            { value: '0', label: '전체' },
            { value: '1', label: 'weblink' },
            { value: '2', label: 'netlink' },
          ];
          break;
        default:
          break;
      }
      return column;
    });

    dispatch(setColumns({ columns: gridColumns }));
  };

  const getNoticeList = useCallback(async (param) => {
    const result = await apiCall(noticeApi.getNoticeList, param);

    setGridInfo((prev) => {
      return { ...prev, total: result.data.data.totalElements };
    });

    dispatch(setNoticeList({ noticeList: result.data.data.content }));
  }, []);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();

    return () => source.cancel();
  }, []);

  return (
    <GridItem spacing={2} container direction="column">
      <NoticeSearchForm />
      <NoticeActionButtons onSearchButtonClick={getNoticeList} />
      <NoticeTable gridInfo={gridInfo} setGridInfo={setGridInfo} />
    </GridItem>
  );
}

NoticeList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default NoticeList;
