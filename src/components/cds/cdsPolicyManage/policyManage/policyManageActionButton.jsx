import { useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { AuthInstance } from '@modules/axios';
import { Stack } from '@mui/material';
import policyManageApi from '@api/indirectLink/policyManageApi';

function PolicyManageActionButton(props) {
  const {
    onSearchButtonClick,
    onInsertButtonClick,
    onDeleteButtonClick,
    onCopyButtonClick,
    onUpdatePolicyButtonClick,
    onPolicyButtonClick,
  } = props;

  const { instance } = AuthInstance();
  policyManageApi.axios = instance;

  const parameterData = useSelector((state) => state.policyManage);

  return (
    <GridItem item directionHorizon="end">
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <ButtonSet
          type="custom"
          options={[
            {
              label: '조회',
              callBack: () => onSearchButtonClick(parameterData.parameters.current),
              variant: 'outlined',
            },
            {
              label: '추가',
              callBack: () => onInsertButtonClick(),
              variant: 'outlined',
            },
            {
              label: '복사',
              callBack: () => onCopyButtonClick(),
              variant: 'outlined',
            },
            {
              label: '수정된 정책적용',
              callBack: () => onUpdatePolicyButtonClick(),
              variant: 'outlined',
            },
            {
              label: '정책적용',
              callBack: () => onPolicyButtonClick(),
              variant: 'outlined',
            },
            {
              label: '삭제',
              callBack: () => onDeleteButtonClick(),
              variant: 'outlined',
            },
          ]}
        />
      </Stack>
    </GridItem>
  );
}

export default PolicyManageActionButton;
