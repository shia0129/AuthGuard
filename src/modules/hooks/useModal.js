import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openAlert } from '@modules/redux/reducers/alert';

// Modal 사용을 위한 사용자 정의 훅.
const useModal = () => {
  // modal redux 상태 변경을 위한 dispatch.
  const dispatch = useDispatch();

  // modal redux 상태 변경 함수 선언 후 반환.
  const openModal = useCallback(({ message, close = false, onConfirm, type }) => {
    // 함수로 전달된 값을 통해 modal redux 상태 값 변환.
    dispatch(
      openAlert({
        message,
        close,
        onConfirm,
        type,
      }),
    );
  }, []);

  return openModal;
};

export default useModal;
