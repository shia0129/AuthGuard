// libraries
import { useState, useCallback, Fragment } from 'react';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Stack,
  usePagination,
  Typography,
  Chip,
  List,
} from '@mui/material';
import { AddCircle, RemoveCircle, ChevronRight, ChevronLeft } from '@mui/icons-material';
import { UserOutlined } from '@ant-design/icons';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import PopUp from '@components/modules/common/PopUp';
// functions
import permissionApi from '@api/system/permissionApi';
import useApi from '@modules/hooks/useApi';

function UserChoiceModal({
  open,
  close,
  count,
  userList,
  parameters,
  setParameters,
  userPermissionId,
  searchCallBack,
  callBack,
}) {
  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();
  // 선택한 사용자 목록 상태값
  const [selectedUserList, setSelectedUserList] = useState([]);
  // 현재페이지 상태값
  const [currentPage, setCurrentPage] = useState(1);
  // 페이징 상태관리 hook
  const { items } = usePagination({
    count: count,
    page: currentPage,
  });
  // 사용자의 권한 수정
  const updateUserPermission = useCallback(async () => {
    if (selectedUserList.length === 0) {
      openModal({ message: '최소 1명의 사용자를 선택해주세요.' });
      return;
    }
    const result = await apiCall(permissionApi.updateUserPermission, {
      adminList: selectedUserList,
      changeUserPermissionId: userPermissionId,
    });
    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 처리되었습니다.`,
        onConfirm: () => callBack(parameters),
      });
      setSelectedUserList([]);
    }
    return true;
  }, [selectedUserList]);
  // 검색조건 입력 변경 이벤트
  const handleOnChange = (event) => {
    // 검색조건 변경
    setParameters({ ...parameters, searchAll: event.target.value });
  };
  // 사용자 삭제 버튼 클릭 이벤트
  const handleDelete = (user) => {
    setSelectedUserList(
      selectedUserList.includes(user.id)
        ? selectedUserList.filter((data) => data !== user.id)
        : [...selectedUserList, user.id],
    );
  };
  // JSX
  return (
    <>
      <PopUp
        title="사용자 추가"
        alertOpen={open}
        closeAlert={close}
        fullWidth
        maxWidth="md"
        callBack={updateUserPermission}
      >
        <Stack spacing={1}>
          <GridItem container directionHorizon="space-between">
            <GridItem item sx={{ width: '50%' }}>
              <OutlinedInput
                size="small"
                name="searchAll"
                type="search"
                sx={{ ml: '15px', width: '80%' }}
                value={parameters.searchAll}
                onChange={handleOnChange}
                placeholder="로그인 ID/ 사용자명/ 권한명/ 부서/ 직급"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchCallBack(parameters);
                  }
                }}
              />
              <Button
                sx={{ ml: '10px', height: '30px' }}
                variant="contained"
                color="primary"
                onClick={() => searchCallBack(parameters)}
              >
                검색
              </Button>
            </GridItem>
            <GridItem item>
              <Stack direction="row">
                <ButtonSet
                  sx={{ height: '30px' }}
                  options={[
                    {
                      label: '선택 초기화',
                      color: 'secondary',
                      variant: 'outlined',
                      callBack: () => setSelectedUserList([]),
                    },
                    {
                      label: '전체 선택',
                      color: 'secondary',
                      variant: 'contained',
                      callBack: () => {
                        if (selectedUserList.length !== userList.length)
                          setSelectedUserList(userList.map((user) => user.id));
                        else setSelectedUserList([]);
                      },
                    },
                  ]}
                />
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem divideColumn={4} spacing={1}>
            <GridItem item colSpan={2}>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                사용자 리스트
              </Typography>
              <List dense>
                {userList.length !== 0 ? (
                  userList
                    .slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10)
                    .map((user) => (
                      <Fragment key={user.id}>
                        <ListItem
                          secondaryAction={
                            <IconButton
                              sx={{ '& svg': { width: '1.3rem' } }}
                              edge="end"
                              onClick={() => handleDelete(user)}
                            >
                              {selectedUserList.includes(user.id) ? (
                                <RemoveCircle color="secondary" />
                              ) : (
                                <AddCircle color="primary" />
                              )}
                            </IconButton>
                          }
                        >
                          <ListItemAvatar sx={{ minWidth: '40px' }}>
                            <Avatar
                              sx={{
                                width: '25px',
                                height: '25px',

                                '& .anticon-user > svg ': { width: '0.8em !important' },
                              }}
                            >
                              <UserOutlined />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primaryTypographyProps={{ variant: 'h6' }}
                            primary={`${user.id} / ${user.userPermissionName} `}
                          />
                        </ListItem>
                        <Divider />
                      </Fragment>
                    ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary="조건에 맞는 사용자가 존재하지 않습니다."
                    />
                  </ListItem>
                )}

                <Stack direction="row" justifyContent="center" alignItems="center">
                  {items.map(({ page, type, ...item }) => {
                    if (type === 'next') {
                      return (
                        <IconButton
                          key={type}
                          onClick={() =>
                            setCurrentPage(currentPage !== count ? currentPage + 1 : currentPage)
                          }
                        >
                          <ChevronRight />
                        </IconButton>
                      );
                    } else if (type === 'previous') {
                      return (
                        <IconButton
                          key={type}
                          onClick={() =>
                            setCurrentPage(currentPage !== 1 ? currentPage - 1 : currentPage)
                          }
                        >
                          <ChevronLeft />
                        </IconButton>
                      );
                    } else if (type === 'page' && page === currentPage) {
                      return (
                        <Typography key={type} {...item}>
                          {page} / {count}
                        </Typography>
                      );
                    }
                  })}
                </Stack>
              </List>
            </GridItem>
            <GridItem item colSpan={2} sx={{ height: '430px', overflow: 'auto' }}>
              <GridItem direction="row" alignItems="center" sx={{ ml: 1 }}>
                <GridItem direction="row" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">사용자 선택&nbsp;&nbsp;&nbsp;</Typography>
                  <Typography color="primary">{selectedUserList.length}</Typography>
                </GridItem>
                <GridItem direction="row">
                  <Stack
                    direction="column"
                    justifyContent="left"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    {selectedUserList.map((selectedUser) => {
                      const user = userList.find((user) => user.id === selectedUser);
                      if (user)
                        return (
                          <Chip
                            sx={{ '& .MuiChip-deleteIcon': { width: '0.7em' } }}
                            key={user.id}
                            icon={<UserOutlined />}
                            variant="contained"
                            color="secondary"
                            onDelete={() => handleDelete(user)}
                            label={`${user.id} / ${user.userPermissionName}`}
                          />
                        );
                    })}
                  </Stack>
                </GridItem>
              </GridItem>
            </GridItem>
          </GridItem>
        </Stack>
      </PopUp>
      {/* {console.log('사용자선택 화면로딩... ')} */}
    </>
  );
}

UserChoiceModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default UserChoiceModal;
