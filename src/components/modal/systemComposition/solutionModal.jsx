// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import PopUp from '@components/modules/common/PopUp';
import { FormProvider, useForm } from 'react-hook-form';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import { useEffect,useRef } from 'react';
import systemGroupApi from '@api/systemComposition/systemGroupApi';
import solutionApi from '@api/systemComposition/solutionApi';

function SolutionModal({ alertOpen, setModalOpen, comboList, updateFlag, id, getSolutionList }) {
  const { instance, source } = AuthInstance();

  systemGroupApi.axios = instance;
  solutionApi.axios = instance;

  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();

  const methods = useForm({
    defaultValues: {
      systemSeq: '',
      tag: '',
      tagValue: '',
      tagDesc: '',
    },
  });

  const init = async () => {
    if (updateFlag) {
      const result = await apiCall(solutionApi.getSolutionDetailList, id);

      if (result.status === 200) {
        for (const key in result.data) {
          methods.setValue(key, result.data[`${key}`]);
        }
      }
    }
  };

  const insertList = async (data) => {
    const result = await apiCall(solutionApi.insertSolutionList, data);

    let message;
    if (result.status === 200) {
      if (result.data > 0) {
        message = '저장되었습니다.';
      }
      openModal({
        message,
        onConfirm: () => {
          setModalOpen(false);
          getSolutionList();
        },
      });
    }
  };

  const updateList = async (data) => {
    const result = await apiCall(solutionApi.updateSolutionList, data);

    let message;
    if (result.status === 200) {
      if (result.data > 0) {
        message = '수정되었습니다.';
      }
      openModal({
        message,
        onConfirm: () => {
          setModalOpen(false);
          getSolutionList();
        },
      });
    }
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();
  }, []);

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      callBack={methods.handleSubmit(updateFlag ? updateList : insertList)}
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      title={updateFlag ? `솔루션 환경 설정 수정` : `솔루션 환경 설정 추가`}
    >
      <FormProvider {...methods}>
        <form id="solutionInfo">
          <GridItem
            container
            item
            divideColumn={2}
            borderFlag
            sx={{
              '& .text': { maxWidth: '155px', minWidth: '155px' },
              '.inputBox': { width: '100%' },
            }}
          >
            <LabelInput
              required
              type="select"
              label="시스템"
              name="systemSeq"
              list={comboList}
              labelBackgroundFlag
            />
            <LabelInput required label="TAG" name="tag" labelBackgroundFlag />
            <LabelInput required label="Value" name="tagValue" labelBackgroundFlag />
            <LabelInput required label="변수설명" name="tagDesc" labelBackgroundFlag />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

SolutionModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SolutionModal;
