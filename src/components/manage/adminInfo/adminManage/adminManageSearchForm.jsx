import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import { setParameters } from '@modules/redux/reducers/adminManage';
import { useDispatch, useSelector } from 'react-redux';

function AdminManageSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.adminManage);
  const parameters = parameterData.parameters.current;

  const adminPermissionParamList = parameterData.adminPermissionParamList;

  const handleChange = (event) => {
    dispatch(setParameters({ [event.target.name]: event.target.value }));
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput
          label="관리자 ID"
          name="userId"
          value={parameters.userId}
          onChange={handleChange}
        />
        <LabelInput
          label="관리자명"
          name="userName"
          value={parameters.userName}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="관리자 권한명"
          name="userPermissionId"
          list={adminPermissionParamList}
          value={parameters.userPermissionId}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="삭제 여부"
          name="deleteYn"
          list={[
            { value: 'N', label: 'N' },
            { value: 'Y', label: 'Y' },
          ]}
          value={parameters.deleteYn}
          onChange={handleChange}
        />
      </GridItem>
    </SearchInput>
  );
}

export default AdminManageSearchForm;
