import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

function HsTablePagination({ size = 0, pageCount = 0, totalCount = 0, currentPage, onChangePage }) {
  const [open, setOpen] = useState(false);
  const handleChangePagination = async (event, value) => {
    onChangePage(event, value - 1, size);
  };

  const handlePageChange = async (event) => {
    let toPage = event.target.value ? Number(event.target.value) : 0;
    if (toPage === 0) return;
    onChangePage(event, toPage === 1 ? 0 : toPage - 1, size);
  };

  const handleSizeChange = async (event) => {
    let toSize = event.target.value ? Number(event.target.value) : 0;
    if (toSize === 0) return;
    onChangePage(event, 0, toSize);
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: 'auto', my: 1 }}
    >
      <Grid item>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="secondary">
            전체
          </Typography>
          <Typography variant="h5" color="primary">
            {totalCount}
          </Typography>
          <Typography variant="caption" color="secondary">
            건 / 페이지당
          </Typography>
          <FormControl sx={{ m: 1 }}>
            <Select
              id="demo-controlled-open-select"
              open={open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              value={size || 10}
              onChange={handleSizeChange}
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
            건 표시 / 전체
          </Typography>
          <Typography variant="h5" color="secondary">
            {Number.isNaN(pageCount) ? 0 : pageCount}
          </Typography>
          <Typography variant="caption" color="secondary">
            페이지 중
          </Typography>
          <TextField
            size="small"
            type="number"
            InputProps={{ inputProps: { min: 1, max: Number.isNaN(pageCount) ? 1 : pageCount } }}
            value={currentPage + 1}
            onChange={handlePageChange}
            sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 } }}
          />
          <Typography variant="caption" color="secondary">
            페이지
          </Typography>
        </Stack>
      </Grid>
      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          count={Number.isNaN(pageCount) ? 1 : pageCount}
          page={currentPage + 1}
          onChange={handleChangePagination}
          color="primary"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
}

export default React.memo(HsTablePagination);
