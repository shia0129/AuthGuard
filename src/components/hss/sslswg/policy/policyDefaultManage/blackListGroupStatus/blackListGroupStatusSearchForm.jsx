import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import {
  setParameters,
  setSearchOpenFlag,
} from '@modules/redux/reducers/hss/sslswg/blackListGroupStatus';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { IconButton } from '@mui/material';
import Transitions from '@components/@extended/Transitions';

function BlackListGroupStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.blackListGroupStatus);
  const parameters = parameterData.parameters.current;

  const searchOpenFlag = parameterData.searchOpenFlag;

  const handleChange = (event, validValue = null) => {
    let value = validValue === null ? event.target.value : validValue;
    if (event instanceof PointerEvent) {
      value = event.target.value;
    }

    dispatch(setParameters({ [event.target.name]: value }));
  };

  const handleClickSearchOpen = () => {
    dispatch(setSearchOpenFlag(!searchOpenFlag));
  };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={3}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '110px', minWidth: '110px' },
          '.inputBox': { maxWidth: '200px', minWidth: '200px' },
        }}
      >
        <LabelInput label="정책명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          label="카테고리"
          name="category"
          value={parameters.category}
          onChange={handleChange}
        />
        <LabelInput
          type="select"
          label="활성화 여부"
          name="enabled"
          value={parameters.enabled ?? ''}
          list={[
            { label: '활성화', value: 1 },
            { label: '비활성화', value: 0 },
          ]}
          onChange={handleChange}
        />
      </GridItem>

      <IconButton
        aria-label="delete"
        size="small"
        sx={{
          position: 'absolute',
          right: 10,
          top: '30px',
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
        onClick={handleClickSearchOpen}
      >
        {searchOpenFlag ? <UpOutlined fontSize="small" /> : <DownOutlined fontSize="small" />}
      </IconButton>

      <Transitions type="collapse" in={searchOpenFlag}>
        <GridItem
          container
          divideColumn={3}
          spacing={2}
          sx={{
            pr: 5,
            pt: 2,
            '& .text': { maxWidth: '110px', minWidth: '110px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <LabelInput
            label="정책 내용"
            name="value"
            value={parameters.value}
            onChange={handleChange}
            placeholder="hanssak.co.kr"
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default BlackListGroupStatusSearchForm;
