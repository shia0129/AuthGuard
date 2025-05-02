import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

function NoticeActionButtons({ onSearchButtonClick }) {
  const router = useRouter();

  const handleInsertButtonClick = () => {
    router.push({
      pathname: '/system/notice/noticeForm',
      query: { flag: 'insert' },
    });
  };

  const parameterData = useSelector((state) => state.notice);

  return (
    <GridItem item direction="row" directionHorizon="end">
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
            callBack: handleInsertButtonClick,
            variant: 'outlined',
            role: 'insert',
          },
        ]}
      />
    </GridItem>
  );
}

export default NoticeActionButtons;
