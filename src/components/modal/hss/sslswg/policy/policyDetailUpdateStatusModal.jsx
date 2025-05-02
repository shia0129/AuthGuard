// libraries
import { useState, useCallback, Fragment, useEffect, useMemo, useRef } from 'react';
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
import policyGroupStatusApi from '@api/hss/sslswg/policy/policyGroupStatusApi';
import { unstable_batchedUpdates } from 'react-dom';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';

function PolicyDetailUpdateStatusModal({ open, close, modalParams, getStatusList }) {
  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();
  // 선택한 정책 목록 상태값
  const [selectedPolicyIdList, setSelectedPolicyIdList] = useState([]);
  // 현재페이지 상태값
  const size = 10;
  const [count, setCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchAll, setSearchAll] = useState('');
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  // 페이징 상태관리 hook
  const { items } = usePagination({
    count: count,
    page: currentPage,
  });
  const [policyList, setPolicyList] = useState([]);
  const initialSelectedPolicyIdListRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const updatePolicy = useCallback(async () => {
    if (isLoading) {
      return;
    }

    const isSameSelection = () => {
      const initialSelectedPolicyIdList = initialSelectedPolicyIdListRef.current;
      if (initialSelectedPolicyIdList.length !== selectedPolicyIdList.length) {
        return false;
      }
      const initialSet = new Set(initialSelectedPolicyIdList);
      const currentSet = new Set(selectedPolicyIdList);
      return (
        initialSet.size === currentSet.size && [...initialSet].every((id) => currentSet.has(id))
      );
    };

    if (isSameSelection()) {
      openModal({
        message: '변경된 정책이 없습니다.',
      });
      return false;
    }

    const params = {
      id: id,
      type: type,
      policyIdList: selectedPolicyIdList,
    };

    setIsSaving(true);
    const result = await apiCall(policyGroupStatusApi.updateMappingListWithPolicyGroupId, params);
    setIsSaving(false);
    if (result) {
      openModal({
        message: `${result.count}건이 처리되었습니다.`,
      });
      getStatusList();
      setSelectedPolicyIdList([]);
    }

    return true;
  });

  // 검색조건 입력 변경 이벤트
  const handleOnChange = (event) => {
    // 검색조건 변경
    setSearchAll(event.target.value);
  };
  // 정책 삭제 버튼 클릭 이벤트
  const handleDelete = (policy) => {
    setSelectedPolicyIdList(
      selectedPolicyIdList.includes(policy.id)
        ? selectedPolicyIdList.filter((data) => data !== policy.id)
        : [...selectedPolicyIdList, policy.id],
    );
  };

  const getPolicyList = useCallback(
    async ({ silent = true } = {}) => {
      if (!id || !type) return;

      const params = {
        id,
        value: searchAll,
        contentOnly: true,
        type,
      };

      try {
        if (silent) {
          setIsSearching(true);
        } else {
          setIsLoading(true);
        }

        const result = await apiCall(
          policyGroupStatusApi.getMappingListAllWithPolicyGroupId,
          params,
        );

        if (result) {
          const data = result.data ?? [];
          const totalCount = Math.ceil(data.length / size);

          const typeMapping = {
            url: 'URL',
            site: '도메인',
            regexpheader: 'HEADER',
            regexppayload: 'PAYLOAD',
            regexpurl: 'URL',
            srcip: '출발지IP',
          };

          const formattedData = data.map((item) => ({
            ...item,
            type: typeMapping[item.type] || item.type?.toUpperCase(), // 매핑되지 않은 값은 대문자로 변환
          }));

          unstable_batchedUpdates(() => {
            setPolicyList(formattedData);
            setCount(totalCount === 0 ? 1 : totalCount);

            if (selectedPolicyIdList.length <= 0) {
              const initiallySelectedIds = data
                .filter((policy) => policy.inUsed === 1)
                .map((policy) => policy.id);
              setSelectedPolicyIdList(initiallySelectedIds);
              initialSelectedPolicyIdListRef.current = initiallySelectedIds;
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
    [apiCall, id, searchAll, size, currentPage, type],
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
    const { id, type } = modalParams;
    if (id && type) {
      const titleMap = {
        site: '사이트',
        pattern: '패턴',
        srcip: '출발지IP',
      };

      unstable_batchedUpdates(() => {
        setId(id);
        setType(type);
        setTitle(titleMap[type?.trim()] ?? '기본');
      });
    }
  }, [modalParams]);

  const requestParams = useMemo(() => {
    if (id && type) {
      return { id, type, currentPage };
    }
    return null;
  }, [id, type, currentPage]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (requestParams) {
      getPolicyList({ silent: false });
    }
  }, [requestParams]);

  // JSX
  return (
    <>
      <PopUp
        title={`${title} 정책 설정`}
        alertOpen={open}
        closeAlert={close}
        fullWidth
        maxWidth="md"
        callBack={updatePolicy}
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
                    placeholder="정책명 또는 그룹명"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSearching) {
                        e.preventDefault();
                        getPolicyList();
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
                      await getPolicyList();
                    }}
                  >
                    검색
                  </Button>
                </Stack>
                {/* {isSearching && (
                  <Typography variant="caption" color="textSecondary">
                    검색 중입니다...
                  </Typography>
                )} */}
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
                        callBack: () => setSelectedPolicyIdList([]),
                      },
                      {
                        label: '전체 선택',
                        color: 'secondary',
                        variant: 'contained',
                        callBack: () => {
                          setSelectedPolicyIdList(policyList.map((policy) => policy.id));
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
                  {title} 정책 리스트
                </Typography>
                <List dense>
                  {policyList.length !== 0 ? (
                    policyList
                      .slice((currentPage - 1) * size, (currentPage - 1) * size + size)
                      .map((policy) => (
                        <Fragment key={policy.id}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                sx={{ '& svg': { width: '1.3rem' } }}
                                edge="end"
                                onClick={() => handleDelete(policy)}
                              >
                                {selectedPolicyIdList.includes(policy.id) ? (
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

                                  '& .anticon-policy > svg ': { width: '0.8em !important' },
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
                              primary={`${policy.name} / ${policy.type}${
                                policy.level === 2 ? ' (G)' : ''
                              }`}
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
                    <Typography variant="subtitle1">{title} 정책 선택&nbsp;&nbsp;&nbsp;</Typography>
                    <Typography color="primary">{selectedPolicyIdList.length}</Typography>
                  </GridItem>
                  <GridItem direction="row">
                    <Stack
                      direction="column"
                      justifyContent="left"
                      spacing={1}
                      alignItems="flex-start"
                    >
                      {selectedPolicyIdList.map((selectedPolicy) => {
                        const policy = policyList.find((policy) => policy.id === selectedPolicy);
                        if (policy) {
                          return (
                            <Chip
                              sx={{ '& .MuiChip-deleteIcon': { width: '0.7em' } }}
                              key={policy.id}
                              icon={<UserOutlined />}
                              variant="contained"
                              color="secondary"
                              onDelete={() => handleDelete(policy)}
                              label={`${policy.name} / ${policy.type}${
                                policy.level === 2 ? ' (G)' : ''
                              }`}
                            />
                          );
                        }
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

PolicyDetailUpdateStatusModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyDetailUpdateStatusModal;
