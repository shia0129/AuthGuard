import { useDispatch, useSelector } from 'react-redux';
import HsReactTable from '../HsReactTable';

const HsReduxTable = ({ name, tab = '', customColumn = null, sx, checkList, onChangeChecked }) => {
  const state = useSelector((state) => state[name]);
  const stateSelector = tab && state?.[tab] ? state[tab] : state;

  const columns = stateSelector?.columns || [];
  const pageDataList = stateSelector?.pageDataList || [];
  const parameters = stateSelector?.parameters || { current: { page: 0, size: 10 } };
  const listInfo = stateSelector?.listInfo || {};
  const totalElements = stateSelector?.totalElements || 0;

  const dispatch = useDispatch();

  return (
    <HsReactTable
      columns={customColumn || columns}
      data={pageDataList}
      gridInfo={{
        listInfo,
        total: totalElements,
      }}
      parameters={parameters}
      setParameters={(data) =>
        dispatch({ type: `${name}/setParameters`, payload: tab ? { tab, data } : data })
      }
      sx={{ ...sx }}
      {...(checkList && { checkList })}
      {...(onChangeChecked && { onChangeChecked })}
    />
  );
};

export default HsReduxTable;
