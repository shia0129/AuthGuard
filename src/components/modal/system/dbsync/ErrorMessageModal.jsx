import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import { List, ListItem, ListItemText } from '@mui/material';
import HsLib from "@modules/common/HsLib";

/**
 * ErrorMessageModal 정의
 *
 * 검증결과 테이블에서 에러메시지 클릭시 상세조회 모달
 *
 * @param {Boolean} alertOpen 모달 호출 여부
 * @param {Function} setModalOpen 모달 호출 상태값 지정 함수
 * @param {List} messageList 에러메시지 리스트
 *
 */
function ErrorMessageModal({ alertOpen, setModalOpen, messageList }) {
  return (
    <>
      <PopUp
        maxWidth="sm"
        fullWidth
        callBack={() => {}}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title={'결과 메시지 상세 조회'}
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
              {messageList.map((element, index) => {
                return (
                  <ListItem key={index} sx={{ margin: 0, padding: 0 }}>
                    <ListItemText
                      primary={HsLib.formatNewlineString(element)}
                      key={index}
                      sx={{ margin: 0, padding: 0 }}
                      primaryTypographyProps={{
                        variant: 'h6',
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </GridItem>
        </GridItem>
      </PopUp>
    </>
  );
}

ErrorMessageModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ErrorMessageModal;
