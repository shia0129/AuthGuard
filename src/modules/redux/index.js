import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import rootSaga from './saga';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, createTransform } from 'redux-persist';
import { openAlert } from './reducers/alert';
import { openConfirmAlert } from './reducers/confirmAlert';
import { openCustomAlert } from './reducers/customAlert';

const sagaMiddleware = createSagaMiddleware();

const makeConfiguredStore = (reducer) =>
  configureStore({
    reducer,
    // redux-persist 직렬화 예외 처리.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            openAlert.type,
            openConfirmAlert.type,
            openCustomAlert.type,
          ],
          ignoredPaths: [
            'alert.onConfirm',
            'alert.message',
            'confirmAlert.onConfirm',
            'confirmAlert.message',
            'confirmAlert.methods',
            'customAlert.title',
            'customAlert.content',
            'customAlert.buttons',
            'customAlert.onClose',
          ],
        },
      }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

export const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return makeConfiguredStore(reducer);
  } else {
    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistTransform = createTransform(
      (inboundState, key) => {
        const transformedState = { ...inboundState };
        return transformedState;
      },
      (outboundState, key) => {
        let transformedState = { ...outboundState };
        if (key === 'alert' || key === 'confirmAlert' || key === 'customAlert') {
          transformedState = {
            ...outboundState,
            open: false,
          };
        }
        return transformedState;
      },
    );

    const persistConfig = {
      key: 'nextjs',
      storage,
      transforms: [persistTransform],
    };

    const persistedReducer = persistReducer(persistConfig, reducer);
    const store = makeConfiguredStore(persistedReducer);

    store.__persistor = persistStore(store);

    sagaMiddleware.run(rootSaga);

    return store;
  }
};

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
});
