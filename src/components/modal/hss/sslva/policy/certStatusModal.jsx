import { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import certStatusApi from '@api/hss/sslva/policy/certStatusApi';
import Loader from '@components/mantis/Loader';
import { IconButton, Stack } from '@mui/material';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

function CertStatusModal(props) {
  const { alertOpen, setModalOpen, modalParams, getCertStatusList } = props;
  const { flag, id } = modalParams;
  const { instance } = AuthInstance();

  const [uploadCertFile, setUploadCertFile] = useState(null);
  const [uploadKeyFile, setUploadKeyFile] = useState(null);

  certStatusApi.axios = instance;

  const handleChangeUploadCertFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadCertFile(file);
    methods.setValue('certFile', file.name);

    event.target.value = '';
  };

  const handleClickCancelCertFile = () => {
    setUploadCertFile(null);
    methods.setValue('certFile', '');
  };

  const handleChangeUploadKeyFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadKeyFile(file);
    methods.setValue('keyFile', file.name);

    event.target.value = '';
  };

  const handleClickCancelKeyFile = () => {
    setUploadKeyFile(null);
    methods.setValue('keyFile', '');
  };

  // const segmentNameList = useSelector((state) => state.vaCertStatus.segmentNameList);

  const [apiCall, openModal] = useApi();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      certFile: '',
      keyFile: '',
    },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // setCertList(certTypeList);
    if (flag === 'update') {
      getCertStatusDetail();
      setIsDisabled(true);
    }
  }, []);

  const getCertStatusDetail = async () => {
    // const result = await apiCall(certStatusApi.getCertStatusDetails, id);
    // for (const key in result) {
    //   const value = result[`${key}`] ?? null;
    //   if (value === null) {
    //     methods.setValue(key, '');
    //   } else {
    //     methods.setValue(key, value);
    //   }
    // }
  };

  const saveButtonClick = async (data) => {
    if (!uploadCertFile) {
      return openModal({ message: 'RootCA 인증서 파일을 선택해주세요.' });
    }
    if (!uploadKeyFile) {
      return openModal({ message: 'RootCA 키 파일을 선택해주세요.' });
    }

    setIsLoading(true);

    const result = await apiCall(
      certStatusApi.insertCertStatusData,
      {
        ...data,
        certFile: uploadCertFile,
        keyFile: uploadKeyFile,
      },
      true, // 사용자 예외 스킵
    );

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          setModalOpen(false);
          getCertStatusList();
        },
      });
    }
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      callBack={methods.handleSubmit(saveButtonClick)}
      title={`인증서 ${flag === 'insert' ? '업로드' : '확인'}`}
      confirmLabel="업로드"
      disableConfirm={isDisabled}
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="certStatusModal">
          <GridItem
            container
            direction="row"
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '180px !important', minWidth: '180px !important' },
              '.inputBox': { width: '310px' },
            }}
          >
            <LabelInput
              required
              label="인증서명"
              name="name"
              disabled={isDisabled}
              labelBackgroundFlag
            />
            {/* <LabelInput
              required
              type="select"
              label="세그먼트명"
              name="segmentName"
              list={segmentNameList}
              disabledefault
              labelBackgroundFlag
            /> */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <LabelInput
                required
                labelBackgroundFlag
                name="certFile"
                label="RootCA 인증서"
                inputProps={{ readOnly: true }}
                // labelSx={{ width: '300px' }}
                // stacksx={{ width: '100%' }}
                sx={{ width: '100%' }}
              />
              <input
                accept=".crt" //, .pem, .cer, .der, .pfx, .p12"
                id="icon-button-ca-file"
                type="file"
                style={{ display: 'none' }}
                onChange={handleChangeUploadCertFile}
              />
              <label htmlFor="icon-button-ca-file">
                <IconButton size="small" className="IconBtn" component="span">
                  <SearchOutlined />
                </IconButton>
              </label>
              <IconButton
                sx={{ mr: `8px !important` }}
                size="small"
                className="IconBtn"
                onClick={handleClickCancelCertFile}
              >
                <CloseOutlined />
              </IconButton>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <LabelInput
                required
                labelBackgroundFlag
                name="keyFile"
                label="RootCA 키"
                inputProps={{ readOnly: true }}
                sx={{ width: '100%' }}
              />
              <input
                accept=".key"
                id="icon-button-key-file"
                type="file"
                style={{ display: 'none' }}
                onChange={handleChangeUploadKeyFile}
              />
              <label htmlFor="icon-button-key-file">
                <IconButton size="small" className="IconBtn" component="span">
                  <SearchOutlined />
                </IconButton>
              </label>
              <IconButton
                sx={{ mr: `8px !important` }}
                size="small"
                className="IconBtn"
                onClick={handleClickCancelKeyFile}
              >
                <CloseOutlined />
              </IconButton>
            </Stack>
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default CertStatusModal;
