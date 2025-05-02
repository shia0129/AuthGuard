// libraries
import { useState, useEffect,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Stack, Checkbox } from '@mui/material';
import { unstable_batchedUpdates } from 'react-dom';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
// functions
import { AuthInstance } from '@modules/axios';
import codeApi from '@api/system/codeApi';
import { isNull } from 'lodash';
function ObjectModal({ alertOpen, setModalOpen, modalParams, getCodeList }) {
  // 파라미터
  const { flag, id } = modalParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      location: '',
      objectName: '',
      division: '',
      ipBandwidth: '',
      ipAddress: '',
      dnatIP: '',
      dnatPort: '',
      description: '',
    },
  });
  // 수정팝업여부 상태값
  const [isUpdate, setIsUpdate] = useState(true);
  // 체크여부 상태값
  const [isChecked, setIsChecked] = useState(false);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 초기화
    init();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, []);
  // 초기화
  const init = () => {
    // 변경모드 세팅
    if (flag === 'update') {
      getDetails();
    }
  };
  // 선택된 상세값 출력
  const getDetails = async () => {
    // const result = await apiCall(codeApi.getDetails, id);
    // if (result.status === 200) {
    //   for (const key in result.data) {
    //     methods.setValue(key, result.data[`${key}`]);
    //   }
    // }
    let detailData_01 = {};
    if (id === '내부망 인프라') {
      detailData_01 = {
        location: '업무망',
        objectName: '내부망 인프라',
        division: 'IPv4',
        ipBandwidth: '32',
        ipAddress: '192.168.3.50',
        dnatIP: '',
        dnatPort: '-',
        description: '',
      };
    } else {
      detailData_01 = {
        location: '인터넷망',
        objectName: '외부망 인프라',
        division: 'IPv4',
        ipBandwidth: '32',
        ipAddress: '50.50.50.60',
        dnatIP: '',
        dnatPort: '-',
        description: '',
      };
    }
    for (const key in detailData_01) {
      if (!isNull(detailData_01[`${key}`])) {
        methods.setValue(key, detailData_01[`${key}`]);
      }
    }
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      setIsUpdate(true);
    });
  };

  // 신규 데이터 저장
  const insertData = async (data) => {
    // const result = await apiCall(codeApi.insertData, { ...data });
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 등록되었습니다.';
    //   else message = '코드정보 등록에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getCodeList();
    //     },
    //   });
    // }
    // setIsUpdate(false);
  };
  // 변경 데이터 저장
  const updateData = async (data) => {
    // const result = await apiCall(codeApi.updateData, data);
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 수정되었습니다.';
    //   else message = '코드정보 수정에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getCodeList();
    //     },
    //   });
    // }
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="md"
        fullWidth
        callBack={methods.handleSubmit(flag === 'insert' ? insertData : updateData)}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title="객체 상세"
        // title={`스트리밍 정책 ${flag === 'insert' ? '작성' : '수정'}`}
      >
        <FormProvider {...methods}>
          <form id="policyModal">
            <GridItem
              container
              direction="row"
              divideColumn={3}
              borderFlag
              sx={{
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
              }}
            >
              <LabelInput
                type="select"
                label="위치"
                name="location"
                list={[
                  { value: '업무망', label: '업무망' },
                  { value: '인터넷망', label: '인터넷망' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="객체명"
                name="objectName"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="설명"
                name="description"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                type="select"
                label="IP구분"
                name="division"
                list={[
                  { value: 'URL', label: 'URL' },
                  { value: 'IPv4', label: 'IPv4' },
                ]}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="IP대역"
                name="ipBandwidth"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
                // colSpan={2}
              />
              <LabelInput
                required
                label="시작IP"
                name="ipAddress"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <Stack direction="row" alignItems="center">
                <LabelInput
                  label="종료IP"
                  name="ipAddress2"
                  placeholder=""
                  labelBackgroundFlag
                  disabled={!isChecked}
                  sx={{
                    '.CMM-li-inputArea-textField': {
                      width: '135px !important',
                    },
                  }}
                />
                <Checkbox
                  color="secondary"
                  variant="contained"
                  checked={isChecked}
                  sx={{ minWidth: 0, maxWidth: 30, height: 30, padding: 0 }}
                  onChange={(e) => {
                    setIsChecked(e.target.checked);
                  }}
                />
              </Stack>
              <LabelInput
                label="DNAT IP"
                name="dnatIP"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
              <LabelInput
                label="DNAT PORT"
                name="dnatPort"
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
              />
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('객체상세 화면로딩... ')} */}
    </>
  );
}

ObjectModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ObjectModal;
