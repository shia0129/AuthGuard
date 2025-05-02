import MiniTableButton from './MiniTableButton';
import MiniTableCheckbox from './MiniTableCheckbox';
import MiniTableDefault from './MiniTableDefault';

function MiniTableCell({
  checkList,
  column,
  item,
  index,
  onChangeCheck,
  ellipsis,
  onClickCell,
  children,
}) {
  if (column.id === 'check')
    return (
      <MiniTableCheckbox list={checkList} data={item} index={index} onChange={onChangeCheck} />
    );

  if (column.id === 'button')
    return (
      <MiniTableButton item={item[`${column.id}`]} className={column.id}>
        {item[`${column.id}`].title}
      </MiniTableButton>
    );

  return (
    <MiniTableDefault ellipsis={ellipsis} onClick={onClickCell} column={column} item={item}>
      {children}
    </MiniTableDefault>
  );
}

export default MiniTableCell;
