import { TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TableHeader } from '@components/modules/table/HsReactTable/TableHeader';
export const TableHeaders = ({
  headerGroup,
  headerHeight,
  page,
  onChangeChecked,
  setToggleAll,
}) => {
  const theme = useTheme();

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = page.map((row) => row.original);
      onChangeChecked(newSelected);
      setToggleAll(true);
      return;
    }
    setToggleAll(false);
    onChangeChecked([]);
  };

  // ✅ key를 분리해서 직접 전달
  const headerGroupProps = headerGroup.getHeaderGroupProps();
  const { key, ...restProps } = headerGroupProps;

  return (
    <TableRow
      key={key} // ✅ key를 직접 전달
      className="CMM-rt-headerArea-tableRow"
      {...restProps} // ✅ key를 제외한 나머지 props만 전달
      sx={{
        '& [data-sticky-td]': {
          backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
          fontSize: '14px',
          fontWeight: '500',
        },
      }}
      height={headerHeight}
    >
      {headerGroup.headers.map((column, index) => {
        return (
          <TableHeader
            key={index}
            headerHeight={headerHeight}
            column={column}
            handleSelectAllClick={handleSelectAllClick}
          />
        );
      })}
    </TableRow>
  );
};
