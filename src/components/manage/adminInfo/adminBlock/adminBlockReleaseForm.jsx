import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Typography } from '@mui/material';
import { FormProvider } from 'react-hook-form';

function AdminBlockReleaseForm({ methods }) {
  return (
    <FormProvider {...methods}>
      <Typography
        variant="h5"
        sx={{
          my: 1,
        }}
      >
        접속 차단/해제 정보
      </Typography>
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
          '& .releaseDescClass': {
            width: '100%',
          },
        }}
      >
        <LabelInput label="관리자" name="blockUserId" disabled labelBackgroundFlag />
        <LabelInput label="차단 유형" name="blockType" disabled labelBackgroundFlag />
        <LabelInput label="차단 시간" name="blockTime" disabled labelBackgroundFlag />
        <LabelInput label="해제 처리자" name="releaseUserName" disabled labelBackgroundFlag />
        <LabelInput label="해제 유형" name="releaseType" disabled labelBackgroundFlag />
        <LabelInput label="해제 시간" name="releaseTime" disabled labelBackgroundFlag />
        <LabelInput
          colSpan={3}
          type="textArea"
          label="해제 사유"
          name="releaseDesc"
          className="releaseDescClass"
          inputProps={{ maxLength: 32 }}
          labelBackgroundFlag
          multiline
          rows={5}
        />
      </GridItem>
    </FormProvider>
  );
}

export default AdminBlockReleaseForm;
