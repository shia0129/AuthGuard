import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

const useAccess = () => {
  const customEqual = (oldValue, newValue) => {
    return isEqual(oldValue, newValue);
  };

  const menuRoleList = useSelector((state) => {
    return state.menu.menuRoleList;
  }, customEqual);

  // CRUD, 각 권한 포함 여부.
  return {
    // insert: menuRoleList.includes('2'),
    // read: menuRoleList.includes('1'),
    // update: menuRoleList.includes('3'),
    // remove: menuRoleList.includes('4'),
    insert: true,
    read: true,
    update: true,
    remove: true,
  };
};

export default useAccess;
