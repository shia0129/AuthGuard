import { TableCell } from '@mui/material';
// import { SizeMe } from 'react-sizeme'; // 제거됨
import { DefaultCell } from '@components/modules/table/HsReactTable/DefaultCell';
import EditableCell from '@components/modules/table/EditableCell';
import { useTheme } from '@mui/material/styles';
import IndeterminateCheckbox from '../IndeterminateCheckbox';

export const RowContent = ({
  rownum,
  checkList,
  onChangeChecked,
  row,
  toggleAll,
  itemHeight,
  tableEditable,
  update,
}) => {
  const theme = useTheme();

  const handleClick = (event, originalInfo) => {
    if (event.target.checked !== undefined) {
      const selectedIndex = checkList.findIndex((item) => item.id === originalInfo.id);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(checkList, originalInfo);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(checkList.slice(1));
      } else if (selectedIndex === checkList.length - 1) {
        newSelected = newSelected.concat(checkList.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          checkList.slice(0, selectedIndex),
          checkList.slice(selectedIndex + 1),
        );
      }
      onChangeChecked(newSelected);
    }
  };

  const onTableCellClick = (event, cell) => {
    if (cell.column.id === 'row-selection-chk') {
      handleClick(event, cell.row.original, row);
    }
  };

  const tableCellStyle = (cell) => {
    return {
      '&[data-sticky-td]': {
        backgroundColor: row.isSelected
          ? theme.palette.mode === 'dark'
            ? '#45495b'
            : '#e9edff'
          : theme.palette.grey[0],
      },
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      bgcolor:
        cell.row.original.fitWidth === 'Y' && cell.column.id === 'cellWidth'
          ? theme.palette.mode === 'dark'
            ? '#1E1E1E'
            : '#F5F5F5'
          : cell.row.original.boardTopYn === 'Y'
          ? theme.palette.mode === 'dark'
            ? '#1E1E1E'
            : '#F7F7F7'
          : 'inherit',
      height: itemHeight,
      maxWidth:
        cell.column?.id === 'row-selection-chk' || cell.column?.id === 'no'
          ? '50px'
          : null,
      display: cell.column.defaultYn === 'N' && 'none',
      p: 'buttonProps' in cell.column && cell.column.attributeType === 'B' ? 0 : null,
    };
  };

  return (
    <>
      {row.cells.map((cell, index) => {
        // getCellProps()가 key를 포함한 props 객체를 반환할 수 있으므로 key를 분리합니다.
        const cellProps = cell.getCellProps([{ className: cell.column.className }]);
        const { key: cellKey, ...restCellProps } = cellProps;
        return (
          <TableCell
            className="CMM-rt-rowArea-tableCell"
            key={cellKey || index}
            align={
              cell.column.rowAlign || (cell.column.id === 'row-selection-chk' ? 'center' : 'left')
            }
            onClick={(event) => onTableCellClick(event, cell)}
            {...restCellProps}
            sx={() => tableCellStyle(cell)}
          >
            {cell.column.id === 'no' ? (
              rownum
            ) : cell.column.id === 'row-selection-chk' ? (
              <IndeterminateCheckbox sx={{ p: 0 }} {...row.getToggleRowSelectedProps()} />
            ) : !(
                (checkList.find((item) => item.id === row.original.id) ||
                  row.original?.addColumnFlag === true) &&
                !toggleAll
              ) ||
              tableEditable === 'N' ||
              (row.original?.addColumnFlag !== true && !update) ? (
              cell.render((param) => (
                <div
                  style={{
                    height:
                      'buttonProps' in cell.column && cell.column.attributeType === 'B'
                        ? '100%'
                        : undefined,
                  }}
                >
                  <DefaultCell
                    className="CMM-rt-rowArea-tableCell-stack-defaultCell"
                    props={param}
                    theme={theme}
                    // react-sizeme 대신 cell.column.width 또는 기본값 사용
                    tableCellWidth={cell.column.width || 'auto'}
                  />
                </div>
              ))
            ) : (
              cell.render(EditableCell)
            )}
          </TableCell>
        );
      })}
    </>
  );
};
