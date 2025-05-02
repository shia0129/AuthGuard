import { takeLatest, race, take } from 'redux-saga/effects';
import { clickConfirm, openAlert, closeAlert } from '../reducers/alert';

//action 가로챈 뒤 실행하는 제너레이터.
function* handleConfirm(action) {
  // 두 가지 작업 중 먼저 실행된 작업을 실행.
  const { confirm } = yield race({ confirm: take(clickConfirm), cancle: take(closeAlert) });

  // confirm 함수가 존재하면,
  if (confirm) {
    // 넘겨준 함수 실행.
    action.payload.onConfirm?.();
  } else {
    // modal 그냥 닫기.
    action.payload.onCancle?.();
  }
}

// Modal saga 정의.
export default function* modalSaga() {
  // 기존 redux action을 취소하고 handleConfirm 함수 실행.
  yield takeLatest(openAlert.type, handleConfirm);
}
