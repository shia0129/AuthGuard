import { takeLatest, race, take } from 'redux-saga/effects';
import { handleConfirmClick, openConfirmAlert, closeConfirmAlert } from '../reducers/confirmAlert';

function* handleAlertConfirm(action) {
  const { confirm } = yield race({
    confirm: take(handleConfirmClick),
    cancle: take(closeConfirmAlert),
  });

  if (confirm) {
    action.payload.onConfirm?.();
  } else {
    action.payload.onCancle?.();
  }
}

export default function* confirmSaga() {
  yield takeLatest(openConfirmAlert.type, handleAlertConfirm);
}
