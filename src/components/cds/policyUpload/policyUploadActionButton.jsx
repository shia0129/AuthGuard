import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';

function PolicyUploadActionButton({ onVerifyButtonClick, onUploadButtonClick }) {
  return (
    <GridItem item directionHorizon="end">
      <ButtonSet
        type="custom"
        options={[
          {
            label: '파일 검증',
            callBack: onVerifyButtonClick,
          },
          {
            label: '파일 업로드',
            callBack: onUploadButtonClick,
            variant: 'contained',
            color: 'primary',
          },
        ]}
      />
    </GridItem>
  );
}

export default PolicyUploadActionButton;
