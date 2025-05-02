import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openConfirmAlert } from '@modules/redux/reducers/confirmAlert';
import { openAlert } from '@modules/redux/reducers/alert';

const useConfirmModal = () => {
  const dispatch = useDispatch();

  const checkEmptyRequired = (inputElement) => {
    if (Array.isArray(inputElement)) {
      return (
        inputElement[0]._f.mount &&
        inputElement[0]._f.validate &&
        !inputElement.filter((_el) => _el._f.value).length
      );
    } else {
      if (inputElement._f.validate) {
        if (!inputElement._f.mount) return false;
        let isValidate = true;

        Object.keys(inputElement._f.validate).forEach((validateFunc) => {
          if (inputElement._f.validate[`${validateFunc}`](inputElement._f.value) !== true) {
            isValidate = false;
          }
        });

        if (!isValidate) return true;
      }

      return (
        inputElement._f.mount &&
        inputElement._f.required.value &&
        (inputElement._f.value === null ||
          inputElement._f.value === undefined ||
          inputElement._f.value === '' ||
          Array.isArray(inputElement._f.value))
      );
    }
  };

  const generateErrorModal = (inputElement) => {
    if (Array.isArray(inputElement)) {
      const elName = inputElement[0]._f.name;
      return {
        name: elName.substring(0, elName.indexOf('.')),
        message: inputElement[0]._f.validate.checkRequired(),
        focus: false,
      };
    } else {
      if (inputElement._f.validate) {
        const validResult = Object.keys(inputElement._f.validate).reduce((result, validateFunc) => {
          if (inputElement._f.validate[`${validateFunc}`](inputElement._f.value) !== true) {
            return [
              ...result,
              {
                name: inputElement._f.name,
                message: inputElement._f.validate[`${validateFunc}`](inputElement._f.value),
                focus: true,
              },
            ];
          }
          return result;
        }, []);

        if (validResult.length > 0) {
          return validResult[0];
        }
      }

      return {
        name: inputElement._f.name,
        message: inputElement._f.required.message,
        focus: true,
      };
    }
  };

  const openConfirmModal = useCallback(
    ({ message, close, validCheck = true, methods, onConfirm, confirmButtonText, target }) => {
      if (validCheck) {
        const fields = methods.control._fields;
        const emptyRequired = Object.keys(fields)
          .filter((el) => {
            const inputElement = fields[`${el}`];
            if (Array.isArray(inputElement) && inputElement[0]?.value) {
              return inputElement.filter((inputEl) => checkEmptyRequired(inputEl.value)).length;
            }

            return checkEmptyRequired(inputElement);
          })
          .map((el) => {
            const inputElement = fields[`${el}`];
            if (Array.isArray(inputElement) && inputElement[0]?.value) {
              for (const inputEl of inputElement.filter((inputEl) =>
                checkEmptyRequired(inputEl.value),
              )) {
                return generateErrorModal(inputEl.value);
              }
            }

            return generateErrorModal(inputElement);
          });

        if (emptyRequired.length) {
          const emptyInput = emptyRequired[0];

          dispatch(
            openAlert({
              message: emptyInput.message,
              onConfirm: () => {
                if (emptyInput.focus) setTimeout(() => methods.setFocus(emptyInput.name), 300);
              },
            }),
          );

          return;
        }
      }

      dispatch(
        openConfirmAlert({
          message,
          close,
          onConfirm,
          confirmButtonText,
          target,
        }),
      );
    },
    [],
  );

  return openConfirmModal;
};

export default useConfirmModal;
