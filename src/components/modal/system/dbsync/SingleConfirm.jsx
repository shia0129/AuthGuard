import PopUp from '@components/modules/common/PopUp';

/**
 * SingleConfirm 정의
 *
 * 배치 화면에서 인사연동 실행 시 실행여부를 확인하는 모달
 *
 * @param {Boolean} alertOpen 모달 호출 여부
 * @param {Function} setModalOpen 모달 호출 상태값 지정 함수
 * @param {Function} handleTestResult callBack시 실행 함수
 *
 */
function SingleConfirm({ alertOpen, setModalOpen, handleTestResult  }) {
  return (
    <>
      <PopUp
        maxWidth="sm"
        callBack={handleTestResult}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title={'인사연동 실행 여부'}
      >
        인사연동을 1회 실행하시겠습니까?
      </PopUp>
    </>
  );
}


export default SingleConfirm;
