// libraries
import { useState, useCallback, Fragment, useEffect, useRef } from 'react';
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
import patternGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/patternGroupStatusApi';
import { unstable_batchedUpdates } from 'react-dom';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';

function PatternGroupUpdateStatusModal({ open, close, modalParams, getStatusList }) {
  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();
  // 선택한 정책 목록 상태값
  const [selectedPatternIdList, setSelectedPatternIdList] = useState([]);
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
  const [patternList, setPatternList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const updatePattern = useCallback(async () => {
    if (isLoading) {
      return;
    }

    const params = {
      id: id,
      patternIdList: selectedPatternIdList,
    };
    setIsSaving(true);
    const result = await apiCall(patternGroupStatusApi.updateMappingListWithPatternGroupId, params);
    setIsSaving(false);
    if (result) {
      openModal({
        message: `${result.count}건이 처리되었습니다.`,
      });
      getStatusList();
      setSelectedPatternIdList([]);
    }

    return true;
  });

  // 검색조건 입력 변경 이벤트
  const handleOnChange = (event) => {
    // 검색조건 변경
    setSearchAll(event.target.value);
  };
  // 정책 삭제 버튼 클릭 이벤트
  const handleDelete = (pattern) => {
    setSelectedPatternIdList(
      selectedPatternIdList.includes(pattern.id)
        ? selectedPatternIdList.filter((data) => data !== pattern.id)
        : [...selectedPatternIdList, pattern.id],
    );
  };

  const getPatternList = useCallback(
    async ({ silent = true } = {}) => {
      if (!id) return;
      const params = {
        id: id,
        value: searchAll,
        contentOnly: true,
      };

      try {
        if (silent) {
          setIsSearching(true);
        } else {
          setIsLoading(true);
        }

        const result = await apiCall(
          patternGroupStatusApi.getMappingListAllWithPatternGroupId,
          params,
        );

        if (result) {
          const data = result.data ?? [];
          const totalCount = Math.ceil(data.length / size);

          unstable_batchedUpdates(() => {
            setPatternList(data ?? []);
            setCount(totalCount === 0 ? 1 : totalCount);

            if (selectedPatternIdList.length <= 0) {
              const initiallySelectedIds = data
                .filter((pattern) => pattern.inUsed === 1)
                .map((pattern) => pattern.id);
              setSelectedPatternIdList(initiallySelectedIds);
            }
          });
        }
      } finally {
        if (silent) {
          setIsSearching(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [apiCall, id, searchAll, size, currentPage],
  );
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
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
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (id) {
      getPatternList({ silent: false });
    }
  }, [id, currentPage]);

  // JSX
  return (
    <>
      <PopUp
        title="패턴 정책 추가"
        alertOpen={open}
        closeAlert={close}
        fullWidth
        maxWidth="md"
        callBack={updatePattern}
        // tooltipMessage="관리자가 정책를 선택하면 해당 블랙리스트 정책이 비활성화되어 모든 사용자가 접근할 수 있게 됩니다."
      >
        {isSaving && <Loader isGuard />}
        {isLoading ? (
          <CenteredSpinner />
        ) : (
          <Stack spacing={1}>
            <GridItem container directionHorizon="space-between">
              <GridItem item sx={{ width: '50%' }}>
                <Stack
                  direction="row"
                  sx={{
                    opacity: isSearching ? 0.5 : 1,
                    pointerEvents: isSearching ? 'none' : 'auto',
                  }}
                >
                  <OutlinedInput
                    size="small"
                    name="searchAll"
                    type="search"
                    sx={{ ml: '15px', width: '80%' }}
                    value={searchAll}
                    onChange={handleOnChange}
                    placeholder="정책 검색"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSearching) {
                        e.preventDefault();
                        getPatternList();
                      }
                    }}
                    readOnly={isSearching}
                  />
                  <Button
                    sx={{ ml: '10px', height: '30px' }}
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      if (isSearching) return; // 클릭 무시
                      await getPatternList();
                    }}
                  >
                    검색
                  </Button>
                </Stack>
              </GridItem>
              <GridItem item>
                <Stack direction="row">
                  <ButtonSet
                    sx={{
                      height: '30px',
                      opacity: isSearching ? 0.5 : 1,
                      pointerEvents: isSearching ? 'none' : 'auto',
                    }}
                    options={[
                      {
                        label: '선택 초기화',
                        color: 'secondary',
                        variant: 'outlined',
                        callBack: () => setSelectedPatternIdList([]),
                      },
                      {
                        label: '전체 선택',
                        color: 'secondary',
                        variant: 'contained',
                        callBack: () => {
                          setSelectedPatternIdList(patternList.map((pattern) => pattern.id));
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
                  패턴 정책 리스트
                </Typography>
                <List dense>
                  {patternList.length !== 0 ? (
                    patternList
                      .slice((currentPage - 1) * size, (currentPage - 1) * size + size)
                      .map((pattern) => (
                        <Fragment key={pattern.id}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                sx={{ '& svg': { width: '1.3rem' } }}
                                edge="end"
                                onClick={() => handleDelete(pattern)}
                              >
                                {selectedPatternIdList.includes(pattern.id) ? (
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

                                  '& .anticon-pattern > svg ': { width: '0.8em !important' },
                                }}
                              >
                                <UserOutlined />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primaryTypographyProps={{
                                variant: 'h6',
                                sx: {
                                  whiteSpace: 'normal', // 줄바꿈 허용
                                  wordBreak: 'break-all', // 단어 중간이라도 줄바꿈
                                },
                              }}
                              primary={`${pattern.name} / ${pattern.value} `}
                            />
                          </ListItem>
                          <Divider />
                        </Fragment>
                      ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primaryTypographyProps={{ variant: 'h6' }}
                        primary="조건에 맞는 정책이 존재하지 않습니다."
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
                    <Typography variant="subtitle1">패턴 정책 선택&nbsp;&nbsp;&nbsp;</Typography>
                    <Typography color="primary">{selectedPatternIdList.length}</Typography>
                  </GridItem>
                  <GridItem direction="row">
                    <Stack
                      direction="column"
                      justifyContent="left"
                      spacing={1}
                      alignItems="flex-start"
                    >
                      {selectedPatternIdList.map((selectedPattern) => {
                        const pattern = patternList.find(
                          (pattern) => pattern.id === selectedPattern,
                        );
                        if (pattern)
                          return (
                            <Chip
                              sx={{ '& .MuiChip-deleteIcon': { width: '0.7em' } }}
                              key={pattern.id}
                              icon={<UserOutlined />}
                              variant="contained"
                              color="secondary"
                              onDelete={() => handleDelete(pattern)}
                              label={`${pattern.name} / ${pattern.value}`}
                            />
                          );
                      })}
                    </Stack>
                  </GridItem>
                </GridItem>
              </GridItem>
            </GridItem>
          </Stack>
        )}
      </PopUp>
      {/* {console.log('정책선택 화면로딩... ')} */}
    </>
  );
}

PatternGroupUpdateStatusModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PatternGroupUpdateStatusModal;
