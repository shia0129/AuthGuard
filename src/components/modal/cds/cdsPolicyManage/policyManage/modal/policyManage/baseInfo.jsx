import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import CodeInput from '@components/modules/input/CodeInput';
import { Stack } from '@mui/material';

function BaseInfo({ handleChange, processMode }) {
  return (
    <GridItem
      container
      direction="row"
      divideColumn={3}
      borderFlag
      sx={{
        mt: '7px',
        '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
        '.inputBox': {
          maxWidth: '150px',
          minWidth: '150px',
        },
        '.CMM-li-inputArea-formControl': {
          maxWidth: '200px !important',
          minWidth: '200px !important',
        },
      }}
    >
      <CodeInput
        required
        codeType="BOUND_TYPE"
        label="정책방향"
        name="boundType"
        disabledefault
        onHandleChange={handleChange}
        disabled={(processMode === 'update' || processMode === 'copy') && true}
        labelBackgroundFlag
      />
      <LabelInput required label="정책명" name="policyName" labelBackgroundFlag />
      <LabelInput required label="설명" name="remark" labelBackgroundFlag />
      <CodeInput
        required
        codeType="ENABLED_TYPE"
        label="활성여부"
        name="enabledType"
        onHandleChange={handleChange}
        disabledefault
        labelBackgroundFlag
      />
      <CodeInput
        required
        codeType="SERVICE_METHOD"
        label="서비스 메소드"
        name="serviceMethod"
        disabledefault
        onHandleChange={handleChange}
        labelBackgroundFlag
      />
      <CodeInput
        required
        codeType="SYSTEM_GROUP"
        label="시스템그룹"
        name="systemGroupId"
        disabledefault
        onHandleChange={handleChange}
        labelBackgroundFlag
      />
      <Stack colSpan={3}>
        <LabelInput label="가상출발지IP" name="virtualSourceIp" labelBackgroundFlag />
      </Stack>
    </GridItem>
  );
}

export default BaseInfo;
