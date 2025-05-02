// libraries
import { useState, useCallback, Fragment, useEffect,useRef } from 'react';
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
import useApi from '@modules/hooks/useApi';
import blackListStatusApi from '@api/hss/sslswg/policy/policyDefaultManage/blackListStatusApi';
import { unstable_batchedUpdates } from 'react-dom';

function BlackListReasonChoiceModal({ open, close, modalParams }) {
  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();
  // 선택한 사유 목록 상태값
  const [selectedReasonIdList, setSelectedReasonIdList] = useState([]);
  // 현재페이지 상태값
  const size = 10;
  const [count, setCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchAll, setSearchAll] = useState('');
  const [id, setId] = useState(null);
  // 페이징 상태관리 hook
  const { items } = usePagination({
    count: count,
    page: currentPage,
  });
  const [reasonList, setReasonList] = useState([]);

  const updateReason = useCallback(async () => {
    if (selectedReasonIdList.length === 0) {
      openModal({
        message: '사유를 선택하지 않아도 정책의 현재 활성화 상태가 그대로 유지됩니다.',
      });
    }

    const params = {
      id: id,
      reasonIdList: selectedReasonIdList,
    };
    const result = await apiCall(blackListStatusApi.updateReasonListWithBlackListId, params);
    if (result) {
      openModal({
        message: `${result.count}건이 처리되었습니다.`,
        onConfirm: () => getReasonList,
      });
      setSelectedReasonIdList([]);
    }

    return true;
  });

  // 검색조건 입력 변경 이벤트
  const handleOnChange = (event) => {
    // 검색조건 변경
    setSearchAll(event.target.value);
  };
  // 사유 삭제 버튼 클릭 이벤트
  const handleDelete = (reason) => {
    setSelectedReasonIdList(
      selectedReasonIdList.includes(reason.id)
        ? selectedReasonIdList.filter((data) => data !== reason.id)
        : [...selectedReasonIdList, reason.id],
    );
  };

  const getReasonList = useCallback(async () => {
    if (!id) return;
    const params = {
      id: id,
      value: searchAll,
    };

    const result = await apiCall(blackListStatusApi.getReasonListAllWithBlackListId, params);
    if (result) {
      const data = result.data ?? [];
      const totalCount = Math.ceil(data.length / size);

      unstable_batchedUpdates(() => {
        setReasonList(data ?? []);
        setCount(totalCount === 0 ? 1 : totalCount);

        if (selectedReasonIdList.length <= 0) {
          const initiallySelectedIds = data
            .filter((reason) => reason.inUsed === 1)
            .map((reason) => reason.id);
          setSelectedReasonIdList(initiallySelectedIds);
        }
      });
    }
  }, [apiCall, id, searchAll, size, currentPage]);
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const { id } = modalParams;
    if (id) {
      setId(id);
    }
  }, [modalParams]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (id) {
      getReasonList(id);
    }
  }, [id, currentPage]);

  // JSX
  return (
    <>
      <PopUp
        title="허용 사유 추가"
        alertOpen={open}
        closeAlert={close}
        fullWidth
        maxWidth="md"
        callBack={updateReason}
        tooltipMessage="관리자가 사유를 선택하면 해당 블랙리스트 정책이 비활성화되어 모든 사용자가 접근할 수 있게 됩니다."
      >
        <Stack spacing={1}>
          <GridItem container directionHorizon="space-between">
            <GridItem item sx={{ width: '50%' }}>
              <OutlinedInput
                size="small"
                name="searchAll"
                type="search"
                sx={{ ml: '15px', width: '80%' }}
                value={searchAll}
                onChange={handleOnChange}
                placeholder="사유 검색"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    getReasonList();
                  }
                }}
              />
              <Button
                sx={{ ml: '10px', height: '30px' }}
                variant="contained"
                color="primary"
                onClick={getReasonList}
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
                      callBack: () => setSelectedReasonIdList([]),
                    },
                    // {
                    //   label: '전체 선택',
                    //   color: 'secondary',
                    //   variant: 'contained',
                    //   callBack: () => {
                    //     if (selectedReasonIdList.length !== reasonList.length)
                    //       setSelectedReasonIdList(reasonList.map((reason) => reason.id));
                    //     else setSelectedReasonIdList([]);
                    //   },
                    // },
                  ]}
                />
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem divideColumn={4} spacing={1}>
            <GridItem item colSpan={2}>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                허용 사유 리스트
              </Typography>
              <List dense>
                {reasonList.length !== 0 ? (
                  reasonList
                    .slice((currentPage - 1) * size, (currentPage - 1) * size + size)
                    .map((reason) => (
                      <Fragment key={reason.id}>
                        <ListItem
                          secondaryAction={
                            <IconButton
                              sx={{ '& svg': { width: '1.3rem' } }}
                              edge="end"
                              onClick={() => handleDelete(reason)}
                            >
                              {selectedReasonIdList.includes(reason.id) ? (
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

                                '& .anticon-reason > svg ': { width: '0.8em !important' },
                              }}
                            >
                              <UserOutlined />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primaryTypographyProps={{ variant: 'h6' }}
                            primary={`${reason.name} / ${reason.value} `}
                          />
                        </ListItem>
                        <Divider />
                      </Fragment>
                    ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary="조건에 맞는 사유가 존재하지 않습니다."
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
                  <Typography variant="subtitle1">허용 사유 선택&nbsp;&nbsp;&nbsp;</Typography>
                  <Typography color="primary">{selectedReasonIdList.length}</Typography>
                </GridItem>
                <GridItem direction="row">
                  <Stack
                    direction="column"
                    justifyContent="left"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    {selectedReasonIdList.map((selectedReason) => {
                      const reason = reasonList.find((reason) => reason.id === selectedReason);
                      if (reason)
                        return (
                          <Chip
                            sx={{ '& .MuiChip-deleteIcon': { width: '0.7em' } }}
                            key={reason.id}
                            icon={<UserOutlined />}
                            variant="contained"
                            color="secondary"
                            onDelete={() => handleDelete(reason)}
                            label={`${reason.name} / ${reason.value}`}
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
      {/* {console.log('사유선택 화면로딩... ')} */}
    </>
  );
}

BlackListReasonChoiceModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BlackListReasonChoiceModal;
