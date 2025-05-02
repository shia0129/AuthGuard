import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import {
  setParameters,
  setSearchOpenFlag,
} from '@modules/redux/reducers/hss/sslswg/policyGroupStatus';
import { IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

function PolicyGroupStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.swgPolicyGroupStatus);
  const parameters = parameterData.parameters.current;
  const { segmentNameList, timeNameList } = parameterData;

  const searchOpenFlag = parameterData.searchOpenFlag;
  const handleClickSearchOpen = () => {
    dispatch(setSearchOpenFlag(!searchOpenFlag));
  };

  const handleChange = (event, validValue = null) => {
    let value = validValue === null ? event.target.value : validValue;
    if (event instanceof PointerEvent) {
      value = event.target.value;
    }

    dispatch(setParameters({ [event.target.name]: value }));
  };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={3}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput label="그룹명" name="name" value={parameters.name} onChange={handleChange} />
        <LabelInput
          type="select"
          label="SSL VA <br/>[세그먼트]"
          name="segmentName"
          value={parameters.segmentName}
          list={segmentNameList || []}
          onChange={handleChange}
          labelSx={{ textAlign: 'right' }}
        />
        <LabelInput
          label="설명"
          name="description"
          value={parameters.description}
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
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '180px', minWidth: '180px' },
          }}
        >
          <LabelInput
            type="select"
            label="스케줄 정책"
            name="timeId"
            value={parameters?.timeId || ''}
            list={timeNameList || []}
            onChange={handleChange}
          />
          <LabelInput
            type="select"
            label="블랙리스트 정책"
            name="isBlackList"
            value={parameters?.isBlackList || ''}
            list={[{ label: '적용', value: '1' }]}
            onChange={handleChange}
          />
          <LabelInput
            type="select"
            label="처리 방식"
            name="action"
            value={parameters?.action || ''}
            list={[
              { label: '차단', value: '0' },
              { label: '허용', value: '1' },
            ]}
            onChange={handleChange}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default PolicyGroupStatusSearchForm;
