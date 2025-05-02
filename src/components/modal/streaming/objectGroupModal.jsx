// libraries
import { useState, useEffect ,useRef} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Stack, Button } from '@mui/material';
import { CloseCircleFilled } from '@ant-design/icons';
import { unstable_batchedUpdates } from 'react-dom';
// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import IconButton from '@components/@extended/IconButton';
import ObjectModal from '@components/modal/streaming/objectModal';
// functions
import { AuthInstance } from '@modules/axios';
import codeApi from '@api/system/codeApi';
import { isNull } from 'lodash';
function ObjectGroupModal({ alertOpen, setModalOpen, modalParams, getList }) {
  // 파라미터
  const { flag, rowData } = modalParams;
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      location: '',
      objectName: '',
      description: '',
      ipAddress: [],
    },
  });
  // 수정팝업여부 상태값
  const [isUpdate, setIsUpdate] = useState(true);
  // IP목록 상태값
  const [ipAddressList, setIpAddressList] = useState([]);
  // 객체팝업 오픈여부 상태값
  const [objectModalOpen, setObjectModalOpen] = useState(false);
  // 객체팝업 파라미터 상태값
  const [objectModalParams, setObjectModalParams] = useState({});
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
    for (const key in rowData) {
      if (key !== 'ipAddress') {
        if (!isNull(rowData[`${key}`])) {
          methods.setValue(key, rowData[`${key}`]);
        }
      }
    }
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      setIpAddressList(rowData.ipAddress);
      setIsUpdate(true);
    });
  };
  // 신규 데이터 저장
  const insertData = async (data) => {
    const requestDate = { ...data, ipAddressList };
    console.log(requestDate);

    // const result = await apiCall(codeApi.insertData, { ...data });
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 등록되었습니다.';
    //   else message = '코드정보 등록에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getList();
    //     },
    //   });
    // }
    // setIsUpdate(false);
  };
  // 변경 데이터 저장
  const updateData = async (data) => {
    const requestDate = { ...data, ipAddressList };
    console.log(requestDate);

    // const result = await apiCall(codeApi.updateData, data);
    // if (result.status === 200) {
    //   let message;
    //   if (result.data === 1) message = '코드정보가 수정되었습니다.';
    //   else message = '코드정보 수정에 실패하였습니다.';
    //   openModal({
    //     message,
    //     onConfirm: () => {
    //       setModalOpen(false);
    //       getList();
    //     },
    //   });
    // }
  };
  // IP목록 엔터 이벤트
  const handleKeyDownIpAddress = (keyEvent) => {
    if (keyEvent.code == 'Enter' && !ipAddressList.includes(keyEvent.target.value)) {
      if (ipAddressList && keyEvent.target.value !== undefined) {
        setIpAddressList((prev) => [...prev, keyEvent.target.value]);
      }
    }
  };
  // IP목록 클릭 이벤트
  const handleClickIpAddress = (flag, item) => {
    // console.log(item);
    setObjectModalParams({ flag: flag, id: item });
    setObjectModalOpen(true);
  };
  // IP목록 삭제 이벤트
  const handleDeleteIpAddress = (item) => {
    const filteredItems =
      ipAddressList && ipAddressList.filter((_ipAddress) => _ipAddress !== item);
    setIpAddressList(filteredItems);
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
        title="객체 그룹 상세"
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
                '.inputBox': {
                  maxWidth: '150px',
                  minWidth: '150px',
                },
                '.CMM-li-inputArea-formControl': {
                  maxWidth: '200px !important',
                  minWidth: '200px !important',
                },
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
            </GridItem>
            <GridItem
              container
              direction="row"
              divideColumn={2}
              borderFlag
              sx={{
                '& .text': { maxWidth: '150px !important', minWidth: '150px !important' },
                '.inputBox': { maxWidth: '300px', minWidth: '300px' },
              }}
            >
              <LabelInput
                requiredMask
                label="IP목록"
                name="ipAddress"
                inputProps={{ maxLength: 32 }}
                disabled={!isUpdate}
                placeholder=""
                labelBackgroundFlag
                onKeyDown={(e) => handleKeyDownIpAddress(e)}
              />
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                flexWrap="wrap"
                sx={{
                  padding: '6px',
                }}
              >
                {ipAddressList.map((item, index) => (
                  <Stack key={index} direction="row">
                    <Button
                      key={index}
                      variant="contained"
                      onClick={() => handleClickIpAddress('update', item)}
                      sx={{
                        maxHeight: '22px',
                        minWidth: '100px',
                        backgroundColor: '#00BCD4',
                        marginBottom: '4px',
                        marginLeft: '4px',
                      }}
                    >
                      {item}
                    </Button>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteIpAddress(item)}
                      sx={{
                        maxHeight: '22px',
                      }}
                    >
                      <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {objectModalOpen && (
        <ObjectModal
          alertOpen={objectModalOpen}
          setModalOpen={setObjectModalOpen}
          modalParams={objectModalParams}
        />
      )}
      {/* {console.log('정책상세 화면로딩... ')} */}
    </>
  );
}

ObjectGroupModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ObjectGroupModal;
