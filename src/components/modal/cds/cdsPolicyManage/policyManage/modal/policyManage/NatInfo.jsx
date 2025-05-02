import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack } from '@mui/material';
import CodeInput from '@components/modules/input/CodeInput';

function NatInfo() {
  return (
    <GridItem
      container
      direction="row"
      divideColumn={4}
      borderFlag
      sx={{
        mt: '7px',
        '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
        '.inputBox': {
          maxWidth: '150px',
          minWidth: '150px',
        },
      }}
    >
      <Stack colSpan={2} direction="row" alignItems="center">
        <CodeInput
          required
          codeType="USE_YN"
          label="SNAT IP"
          name="useSnatIp"
          disabledefault
          labelBackgroundFlag
        />
        <LabelInput name="snatIp" />
      </Stack>
      <Stack colSpan={2} direction="row" alignItems="center">
        <CodeInput
          required
          codeType="USE_YN"
          label="SNAT Port"
          name="useSnatPort"
          disabledefault
          labelBackgroundFlag
        />
        <LabelInput name="snatPort" />
      </Stack>
      <Stack colSpan={2} direction="row" alignItems="center">
        <CodeInput
          required
          codeType="USE_YN"
          label="DNAT IP"
          name="useDnatIp"
          disabledefault
          labelBackgroundFlag
        />
        <LabelInput name="dnatIp" />
      </Stack>
      <Stack colSpan={2} direction="row" alignItems="center">
        <CodeInput
          required
          codeType="USE_YN"
          label="DNAT Port"
          name="useDnatPort"
          disabledefault
          labelBackgroundFlag
        />
        <LabelInput name="dnatPort" />
      </Stack>
    </GridItem>
  );
}

export default NatInfo;
