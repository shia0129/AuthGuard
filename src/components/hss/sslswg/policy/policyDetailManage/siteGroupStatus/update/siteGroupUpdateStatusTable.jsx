import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslswg/site/siteGroupUpdateStatus';
import HsReduxTable from '@components/modules/table/HsReduxTable';

function SiteGroupUpdateStatusTable() {
  const { deleteList } = useSelector((state) => state.siteGroupUpdateStatus);

  const dispatch = useDispatch();

  const handleChangeChecked = (value) => {
    dispatch(setDeleteList(value));
  };

  return (
    <GridItem item>
      <HsReduxTable
        sx={{
          '.CMM-rt-headerArea-tableHead, .CMM-rt-headerArea-tableHead tr th': {
            height: '35px !important',
            padding: '0',
          },
          '.CMM-rt-tableArea-reactRow': {
            cursor: 'pointer',
            height: 'unset', // 높이 자동 조절!
          },
          '.CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
            lineHeight: '35px',
          },
        }}
        name="siteGroupUpdateStatus"
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
    </GridItem>
  );
}

export default SiteGroupUpdateStatusTable;
