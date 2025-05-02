import { useEffect, useState, useRef, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import MultipleSelect from '@components/modules/select/multipleSelect';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import policyGroupStatusApi from '@api/hss/sslva/policy/policyGroupStatusApi';
import { useSelector } from 'react-redux';
import Loader from '@components/mantis/Loader';
import { CenteredSpinner } from '@components/modules/common/Spinner';
import useInitialFormDataLoad from '@modules/hooks/useInitialFormDataLoad';

function PolicyGroupStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getPolicyGroupStatusList } = props;

  const { flag, id } = modalParams;
  const { instance, source } = AuthInstance();

  policyGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const [detailValue, setDetailValue] = useState([]);
  const [selectedDetailList, setSelectedDetailList] = useState([]);
  const [isDetailValueChange, setDetailValueChange] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const parameterData = useSelector((state) => state.vaPolicyGroupStatus);
  const segmentNameList = parameterData?.segmentNameList ?? [];
  const detailList = parameterData?.detailList ?? [];

  const methods = useForm({
    defaultValues: {
      name: '',
      segmentName: '',
      detailIdList: [],
    },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    return () => {
      source.cancel();
    };
  }, []);

  const fetcher = useCallback(() => {
    return apiCall(policyGroupStatusApi.getPolicyGroupStatusDetails, id);
  }, [apiCall, id]);

  const onLoaded = useCallback(
    (result) => {
      for (const key in result) {
        const value = result[key] ?? null;

        if (value === null) {
          methods.setValue(key, '');
        } else {
          if (key === 'detailIdList') {
            const dList = value ?? [];
            setDetailValue(dList);
          } else {
            methods.setValue(key, value);
          }
        }
      }
    },
    [methods, setDetailValue],
  );

  const isInitLoading = useInitialFormDataLoad({
    enabled: flag === 'update',
    fetcher,
    onLoaded,
  });

  const saveButtonClick = async (data) => {
    if (isInitLoading) {
      return;
    }

    let result = '';

    if (flag === 'update') {
      if (isDetailValueChange) {
        data.detailIdList = selectedDetailList.length > 0 ? selectedDetailList : [];
      } else {
        data.detailIdList = detailValue;
      }
    } else {
      data.detailIdList = selectedDetailList;
    }

    if (!data.detailIdList || data.detailIdList.length === 0) {
      requestAnimationFrame(() => {
        document.activeElement?.blur();
        openModal({
          message: '정책 목록을 선택해주세요.',
          onConfirm: () => {},
        });
      });
      return;
    }

    setIsSaving(true);
    result =
      flag === 'update'
        ? await apiCall(policyGroupStatusApi.updatePolicyGroupStatusData, data)
        : await apiCall(policyGroupStatusApi.insertPolicyGroupStatusData, data);
    setIsSaving(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getPolicyGroupStatusList();
        },
      });
    }
  };

  const onDetailValueChange = (selectList) => {
    const selectDetailList = selectList
      .filter((data) => data && typeof data.id !== 'undefined')
      .map((data) => data.id);
    setSelectedDetailList(selectDetailList);
    setDetailValueChange(true);
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`정책 그룹 ${flag === 'insert' ? '작성' : '수정'}`}
      confirmLabel="저장"
    >
      {isSaving && <Loader isGuard />}
      {isInitLoading ? (
        <CenteredSpinner />
      ) : (
        <FormProvider {...methods}>
          <form id="policyGroupStatusModal">
            {/* <Typography variant="h5">기본정보</Typography> */}
            <GridItem
              direction="row"
              divideColumn={1}
              borderFlag
              sx={{
                mt: '7px',
                '& .text': { maxWidth: '200px !important', minWidth: '200px !important' },
                '.inputBox': {
                  maxWidth: '400px',
                  minWidth: '400px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
              }}
            >
              <LabelInput
                required
                label="정책명"
                name="name"
                disabled={flag == 'update'}
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="세그먼트"
                name="segmentName"
                list={segmentNameList}
                disabledefault
                labelBackgroundFlag
              />
              <MultipleSelect
                required
                label="정책 목록"
                name="detailIdList"
                dataList={detailList}
                onValueChange={onDetailValueChange}
                initValue={detailValue}
              />
            </GridItem>
          </form>
        </FormProvider>
      )}
    </PopUp>
  );
}

export default PolicyGroupStatusModal;
