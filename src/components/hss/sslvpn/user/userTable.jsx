import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { setDeleteList } from '@modules/redux/reducers/hss/sslvpn/user';
import { Link } from '@mui/material';
import UserModal from '@components/modal/hss/sslvpn/userModal';
import HsReduxTable from '@components/modules/table/HsReduxTable';
import AccountListComponent from '@components/hss/makeColumn/accountListComponent';
import GroupListComponent from '@components/hss/makeColumn/groupListComponent';

function UserTable(props) {
  const { getUserList } = props;

  const { columns, deleteList } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [modalParams, setModalParams] = useState({ flag: '', id: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const makeColumns = () =>
    columns.map((column) => ({
      ...column,
      Cell: (props) => {
        const original = props.row.original;
        const value = props.value;

        switch (column.accessor) {
          case 'groupList':
            return <GroupListComponent data={value} />;
          case 'accountList':
            return <AccountListComponent data={value} />;
        }

        return reunderCodeTypeNameCell(value, original.zoneName);
      },
    }));

  const handleUpdateColumnClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };

  const handleChangeChecked = (value) => {
    dispatch(setDeleteList(value));
  };

  const reunderCodeTypeNameCell = (value, id) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => handleUpdateColumnClick('update', id)}
      >
        {value}
      </Link>
    );
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
        name="user"
        customColumn={makeColumns()}
        checkList={deleteList}
        onChangeChecked={handleChangeChecked}
      />
      {modalOpen && (
        <UserModal
          getUserList={getUserList}
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
        />
      )}
    </GridItem>
  );
}

export default UserTable;
