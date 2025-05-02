import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import { setParameters, setSearchOpenFlag } from '@modules/redux/reducers/policyManage';
import { IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import CodeInput from '@components/modules/input/CodeInput';

function PolicyManageSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.policyManage);
  const parameters = parameterData.parameters.current;
  const searchOpenFlag = parameterData.searchOpenFlag;

  const handleClickSearchOpen = () => {
    dispatch(setSearchOpenFlag(!searchOpenFlag));
  };

  const handleChange = (event) => {
    dispatch(setParameters({ [event.target.name]: event.target.value }));
  };

  return (
    <SearchInput>
      <GridItem
        container
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <CodeInput
          codeType="BOUND_TYPE"
          label="정책방향"
          name="boundType"
          value={parameters.boundType}
          onChange={handleChange}
        />
        <LabelInput
          label="정책명"
          name="policyName"
          value={parameters.policyName}
          onChange={handleChange}
        />
        <CodeInput
          codeType="SERVICE_METHOD"
          label="서비스 메소드"
          name="serviceMethod"
          value={parameters.serviceMethod}
          onChange={handleChange}
        />
        <LabelInput
          label="목적지IP"
          name="destinationIp"
          value={parameters.destinationIp}
          onChange={handleChange}
        />
      </GridItem>

      <IconButton
        aria-label="delete"
        size="small"
        sx={{
          position: 'absolute',
          right: 10,
          top: '15px',
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
          divideColumn={4}
          spacing={2}
          sx={{
            pr: 5,
            pt: 2,
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '180px', minWidth: '180px' },
          }}
        >
          <LabelInput
            label="목적지Port"
            name="destinationPort"
            value={parameters.destinationPort}
            onChange={handleChange}
          />
          <LabelInput
            label="출발지IP"
            name="sourceIp"
            value={parameters.sourceIp}
            onChange={handleChange}
          />
          <CodeInput
            codeType="ENABLED_TYPE"
            label="활성여부"
            name="enabledType"
            value={parameters.enabledType}
            onChange={handleChange}
          />
          <CodeInput
            codeType="SYSTEM_GROUP"
            label="시스템그룹"
            name="systemGroupId"
            value={parameters.systemGroupId}
            onChange={handleChange}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default PolicyManageSearchForm;
