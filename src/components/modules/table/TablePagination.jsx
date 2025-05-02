import React, { useEffect, useState,useRef} from 'react';
import PropTypes from 'prop-types';
import { unstable_batchedUpdates } from 'react-dom';
import {
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
  usePagination,
  IconButton,
} from '@mui/material';

import { ChevronRight, ChevronLeft } from '@mui/icons-material';

/**
 * 2023.11.20 - 조회 응답 데이터 (pageSize -> size / pageIndex -> page 로 변경.)
 * 2023.11.21 - 조회 응답 데이터 (resultData -> content / total -> totalElements 로 변경.)
 *
 **/
function TablePagination({
  scrollRef,
  setSize,
  size,
  page,
  setPage,
  setData,
  setUpdateData,
  gridInfo: { total: count, api: listApi },
  setGridInfo,
  setParameters,
  onChangeChecked,
  toggleAllRowsSelected,
  listFuncName,
  searchParameters,
  totalPage,
  pageSelectNum,
  pageInputNum,
  miniPaging,
  parameters,
  sortColumnInformation,
}) {
  const [open, setOpen] = useState(false);

  // 미니페이징 전용 상태 값.
  const [currentPage, setCurrentPage] = useState(1);

  // 데이터 조회 시 전달할 파라미터 생성.
  let param = parameters ? parameters.current : {};
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (!Number.isNaN(param?.page)) setPage(param?.page);
  }, [param]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChangePagination = async (_, value) => {
    scrollRef.current.elements().viewport.scroll({ top: 0, left: 0 });

    const page = value - 1;

    param.page = page;

    if (sortColumnInformation) {
      param.sort = sortColumnInformation;
    }

    const result = await listApi[`${listFuncName}`](
      searchParameters ? searchParameters(param) : param,
      listApi,
    );

    unstable_batchedUpdates(() => {
      if (Object.keys(result).length !== 0) {
        setParameters({ ...param, page: page, size: size, sort: sortColumnInformation ?? '' });

        setGridInfo((prev) => ({
          ...prev,
          total: result.data.totalElements,
        }));

        toggleAllRowsSelected(false);
        if (onChangeChecked) onChangeChecked([]);

        setData(result.data.content);

        if (setUpdateData) {
          setUpdateData(result.data.content);
        }
        setPage(value - 1);
      }
    });
  };

  const handleChange = async (event) => {
    scrollRef.current.elements().viewport.scroll({ top: 0, left: 0 });

    const size = event.target.value;

    param.size = size;
    param.page = 0;

    if (sortColumnInformation) {
      param.sort = sortColumnInformation;
    }

    const result = await listApi[`${listFuncName}`](
      searchParameters ? searchParameters(param) : param,
      listApi,
    );

    unstable_batchedUpdates(() => {
      if (!result) return;

      setParameters({ ...param, page: 0, size: size, sort: sortColumnInformation ?? '' });

      setGridInfo((prev) => ({
        ...prev,
        listInfo: {
          ...prev.listInfo,
          size: size,
        },
        total: result.data.totalElements,
      }));

      toggleAllRowsSelected(false);
      if (onChangeChecked) onChangeChecked([]);

      setData(result.data.content);

      if (setUpdateData) {
        setUpdateData(result.data.content);
      }
      setSize(size);
      setPage(0);
    });
  };

  // 미니페이지 관련 이벤트
  const miniHandleChange = async (currentPage) => {
    scrollRef.current.elements().viewport.scroll({ top: 0, left: 0 });

    const page = currentPage - 1;
    param.page = page;

    if (sortColumnInformation) {
      param.sort = sortColumnInformation;
    }

    const result = await listApi[`${listFuncName}`](
      searchParameters ? searchParameters(param) : param,
      listApi,
    );
    unstable_batchedUpdates(() => {
      if (result && result.status === 200) {
        setGridInfo((prev) => ({
          ...prev,
          total: result.data.totalElements,
        }));
        toggleAllRowsSelected(false);
        if (onChangeChecked) onChangeChecked([]);

        setData(result.data.content);

        if (setUpdateData) {
          setUpdateData(result.data.content);
        }
      }
    });
  };

  // 페이징 hook.
  const { items } = usePagination({
    count: count,
    page: currentPage,
  });

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: 'auto', my: 1, display: miniPaging && 'inline' }}
    >
      {miniPaging ? (
        <Stack direction="row" justifyContent="center" alignItems="center">
          {items.map(({ page, type, ...item }) => {
            if (type === 'next') {
              return (
                <IconButton
                  key={type}
                  onClick={() => {
                    const recentPage =
                      currentPage !== Math.ceil(count / size) ? currentPage + 1 : currentPage;

                    miniHandleChange(recentPage);
                    setCurrentPage(recentPage);
                  }}
                >
                  <ChevronRight />
                </IconButton>
              );
            } else if (type === 'previous') {
              return (
                <IconButton
                  key={type}
                  onClick={() => {
                    const recentPage = currentPage !== 1 ? currentPage - 1 : currentPage;

                    miniHandleChange(recentPage);
                    setCurrentPage(recentPage);
                  }}
                >
                  <ChevronLeft />
                </IconButton>
              );
            } else if (type === 'page' && page === currentPage) {
              return (
                <Typography key={type} {...item}>
                  {page} / {Math.ceil(count / size)}
                </Typography>
              );
            }
          })}
        </Stack>
      ) : (
        <>
          <Grid item>
            <Stack direction="row" spacing={1} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                {totalPage && (
                  <>
                    <Typography variant="caption" color="secondary">
                      전체
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {count}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      건
                    </Typography>
                  </>
                )}
                {pageSelectNum && (
                  <>
                    <Typography variant="caption" color="secondary">
                      {totalPage && '/ '}
                      페이지당
                    </Typography>
                    <FormControl sx={{ m: 1 }}>
                      <Select
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={size || 10}
                        onChange={handleChange}
                        size="small"
                        sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" color="secondary">
                      건 표시
                    </Typography>
                  </>
                )}
                {pageInputNum && (
                  <>
                    <Typography variant="caption" color="secondary">
                      {(pageSelectNum || totalPage) && '/ '} 전체
                    </Typography>
                    <Typography variant="h5" color="secondary">
                      {Math.ceil(count / size)}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      페이지 중
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      value={page + 1}
                      onChange={async (e) => {
                        scrollRef.current.elements().viewport.scroll({ top: 0, left: 0 });

                        let page = e.target.value ? Number(e.target.value) : 0;
                        if (page === 0) return;
                        page = page > Math.ceil(count / size) ? page + 1 : page;
                        e.target.value = page - 1;
                        param.page = page - 1;
                        if (sortColumnInformation) {
                          param.sort = sortColumnInformation;
                        }
                        const result = await listApi[`${listFuncName}`](
                          searchParameters ? searchParameters(param) : param,
                          listApi,
                        );
                        unstable_batchedUpdates(() => {
                          if (result && result.status === 200) {
                            toggleAllRowsSelected(false);
                            if (onChangeChecked) onChangeChecked([]);
                            setData(result.data.content);

                            if (setUpdateData) {
                              setUpdateData(result.data.content);
                            }

                            setParameters({
                              ...param,
                              page: page - 1,
                              sort: sortColumnInformation ?? '',
                            });
                            setPage(page - 1);
                          }
                        });
                      }}
                      sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 } }}
                    />
                    <Typography variant="caption" color="secondary">
                      페이지
                    </Typography>
                  </>
                )}
                {!totalPage && !pageSelectNum && !pageInputNum && (
                  <>
                    <Typography variant="caption" color="secondary">
                      전체
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {count}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      건 /
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      페이지당
                    </Typography>
                    <FormControl sx={{ m: 1 }}>
                      <Select
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={size}
                        onChange={handleChange}
                        size="small"
                        sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" color="secondary">
                      건 표시 /
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      전체
                    </Typography>
                    <Typography variant="h5" color="secondary">
                      {Math.ceil(count / size)}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      페이지 중
                    </Typography>

                    <TextField
                      size="small"
                      type="number"
                      InputProps={{ inputProps: { min: 1, max: Math.ceil(count / size) } }}
                      value={page + 1}
                      onChange={async (e) => {
                        scrollRef.current.elements().viewport.scroll({ top: 0, left: 0 });
                        let page = e.target.value ? Number(e.target.value) : 0;
                        if (page === 0) return;
                        page = page > Math.ceil(count / size) ? page + 1 : page;
                        e.target.value = page - 1;

                        param.page = page - 1;

                        if (sortColumnInformation) {
                          param.sort = sortColumnInformation;
                        }
                        const result = await listApi[`${listFuncName}`](
                          searchParameters ? searchParameters(param) : param,
                          listApi,
                        );
                        unstable_batchedUpdates(() => {
                          if (Object.keys(result).length !== 0) {
                            toggleAllRowsSelected(false);
                            if (onChangeChecked) onChangeChecked([]);

                            setData(result.data.content);

                            if (setUpdateData) {
                              setUpdateData(result.data.content);
                            }

                            setParameters({
                              ...param,
                              page: e.nativeEvent instanceof InputEvent ? page - 2 : page - 1,
                              sort: sortColumnInformation ?? '',
                            });

                            setPage(page - 1);
                          }
                        });
                      }}
                      sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 } }}
                    />
                    <Typography variant="caption" color="secondary">
                      페이지
                    </Typography>
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
            <Pagination
              count={Math.ceil(count / size)}
              page={page + 1}
              onChange={handleChangePagination}
              color="primary"
              variant="outlined"
              showFirstButton
              showLastButton
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

TablePagination.propTypes = {
  gotoPage: PropTypes.func,
  setPageSize: PropTypes.func,
  page: PropTypes.number,
  size: PropTypes.number,
  rows: PropTypes.array,
};

export default React.memo(TablePagination);
