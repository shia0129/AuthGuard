// libraries
import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import codeApi from '@api/system/codeApi';
import { List, ListItem, ListItemText } from '@mui/material';

function ApproveLineResultModal({ alertOpen, setModalOpen, errorMessage }) {
  // JSX
  return (
    <>
      <PopUp
        maxWidth="sm"
        fullWidth
        callBack={() => {}}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title={'에러 메시지 상세 조회'}
        disableConfirm
        disableCancel
      >
        <GridItem sx={{ width: '700px' }}>
          <GridItem
            container
            direction="row"
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
              '.inputBox': {
                maxWidth: '310px',
                minWidth: '310px',
              },
            }}
          >
            <List
              dense
              sx={{
                width: '100%',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 100,
              }}
            >
              {errorMessage}
            </List>
          </GridItem>
        </GridItem>
      </PopUp>
    </>
  );
}

ApproveLineResultModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ApproveLineResultModal;
