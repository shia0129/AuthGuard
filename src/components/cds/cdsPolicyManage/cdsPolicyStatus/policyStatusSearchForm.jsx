import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Transitions from '@components/@extended/Transitions';
import { setParameters, setSearchOpenFlag } from '@modules/redux/reducers/policyStatus';
import { IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import CodeInput from '@components/modules/input/CodeInput';

function PolicyStatusSearchForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.policyStatus);
  const parameters = parameterData.parameters.current;

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
        divideColumn={4}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <CodeInput
          codeType="SYSTEM_GROUP_TYPE"
          label="시스템그룹"
          name="systemGroup"
          value={parameters.systemGroup}
          onChange={handleChange}
        />

        <CodeInput
          codeType="SYSTEM_TYPE"
          label="시스템"
          name="systemId"
          value={parameters.systemId}
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
          label="포트설명"
          name="svcDesc"
          value={parameters.svcDesc}
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
          divideColumn={4}
          spacing={2}
          sx={{
            pr: 5,
            pt: 2,
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '180px', minWidth: '180px' },
          }}
        >
          <CodeInput
            codeType="DESTINATION_HOST_TYPE"
            label="목적지 구분"
            name="destType"
            value={parameters.destType}
            onChange={handleChange}
          />

          <LabelInput
            label="목적지IP"
            name="destinationIP"
            value={parameters.destinationIP}
            onChange={handleChange}
            maskOptions={{
              type: 'ipv4',
            }}
          />
          <LabelInput
            label="목적지Port (From)"
            name="destinationPortFrom"
            onlyNumber
            value={parameters.destinationPortFrom}
            onChange={handleChange}
          />
          <LabelInput
            label="출발지IP"
            name="sourceIP"
            value={parameters.sourceIP}
            onChange={handleChange}
            maskOptions={{
              type: 'ipv4',
            }}
          />
        </GridItem>
      </Transitions>
    </SearchInput>
  );
}

export default PolicyStatusSearchForm;
