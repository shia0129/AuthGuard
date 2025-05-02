import { Stack, TableCell, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import IndeterminateCheckbox from '../IndeterminateCheckbox';
export const TableHeader = ({ column, headerHeight, handleSelectAllClick }) => {
  const theme = useTheme();
  const intl = useIntl();

  const headerProps = column.getHeaderProps([{ className: column.className }]);
  const { key, ...restProps } = headerProps; // ✅ key를 분리해서 직접 전달

  return (
    <TableCell
      key={key} // ✅ key를 직접 전달
      {...restProps} // ✅ key를 제외한 나머지 props만 전달
      className="CMM-rt-headerArea-tableRow-tableCell"
      align={column.headerAlign || 'left'}
      sx={{
        whiteSpace: 'nowrap',
        py: 1,
        height: headerHeight ? headerHeight : 40,
        maxHeight: headerHeight ? headerHeight : 40,
        borderBottom: '1px solid #d4d8e1 !important',
        borderTop: '1px solid #d4d8e1 !important',
        backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FAFAFA',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: column?.id === 'row-selection-chk' || column?.id === 'no' ? '50px' : null,
        display: column.defaultYn === 'N' && 'none',
      }}
      onClick={(event) => {
        if (column?.id === 'row-selection-chk') handleSelectAllClick(event);
      }}
    >
      <Stack
        className="CMM-rt-headerArea-tableRow-tableCell-stack"
        direction="row"
        sx={{ height: '100%' }}
        justifyContent="center"
        alignItems="center"
      >
        <Typography component={'div'} className="CMM-rt-headerArea-tableRow-tableCell-stack-typography">
          {column.id === 'row-selection-chk'
            ? column.render(({ getToggleAllPageRowsSelectedProps }) => (
                <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
              ))
            : intl.messages[column.render('Header')]
            ? intl.messages[column.render('Header')]
            : column.render('Header')}
        </Typography>
      </Stack>
    </TableCell>
  );
};
