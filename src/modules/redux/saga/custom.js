import { takeLatest, race, take } from 'redux-saga/effects';
import { handleButtonsClick, openCustomAlert, closeCustomAlert } from '../reducers/customAlert';

function* handleCutomAlertClose(action) {
  const { confirm } = yield race({
    confirm: take(handleButtonsClick),
    cancle: take(closeCustomAlert),
  });

  action.payload.onClose?.();
}

export default function* customSaga() {
  yield takeLatest(openCustomAlert.type, handleCutomAlertClose);
}
