// third-party
import { alpha, styled } from '@mui/material/styles';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view';

const TreeListItem = styled((props) => <TreeItem {...props} />)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      display: 'none',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  [`& .${treeItemClasses.label}`]: {
    minWidth: 200,
    // width: 200,
    textOverflow: 'ellipsis',
    // overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

TreeListItem.displayName = 'Item';

export default TreeListItem;
