import { all } from 'redux-saga/effects';
import modalSaga from './modal';
import confirmSaga from './confirm';
import customSaga from './custom';

// saga 묶어주기.
function* rootSaga() {
  yield all([modalSaga(), confirmSaga(), customSaga()]);
}

export default rootSaga;
