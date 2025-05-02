import { useEffect, useState,useRef } from 'react';
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import MainCard from '@components/mantis/MainCard';
import GridItem from '@components/modules/grid/GridItem';
import { Button } from '@mui/material';
import preferencesApi from '@api/system/preferencesApi';
import useApi from '@modules/hooks/useApi';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import alarmMailApi from '@api/system-manage/alarmMailApi';
import { AuthInstance } from '@modules/axios';

function AlarmMail() {
  const { instance } = AuthInstance();

  alarmMailApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const [preferencesList, setPreferencesList] = useState([]);

  const methods = useForm({
    defaultValues: {
      host: '',
      sender: '',
      recipients: '',
      username: '',
      password: '',
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
    getAlarmMailConfig();
  }, []);

  const getAlarmMailConfig = async () => {
    const { status, data } = await apiCall(preferencesApi.getPreferences, {
      configType: 'MAIL',
      hasToken: false,
    });

    // TODO: 향후 기존 API 응답 포맷 변경 시 errorYn을 사용.
    if (status === 200) {
      setPreferencesList(data);
      data.forEach((config) => {
        methods.setValue(config.configName, config.configValue);
      });
    }
  };

  const handleSubmitAlarmConfig = async (data) => {
    const parameters = [];

    for (const key in data) {
      const config = preferencesList.find((config) => config.configName === key);
      parameters.push({ configId: config.configId, configValue: data[`${key}`] });
    }

    if (_.isEmpty(parameters)) {
      openModal({
        message: '다시 시도해주시기 바랍니다.',
      });
      return;
    }

    await apiCall(alarmMailApi.updateAlarmConfig, parameters);

    openModal({
      message: '저장되었습니다.',
      onConfirm: getAlarmMailConfig,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmitAlarmConfig)}>
        <GridItem divideColumn={1} spacing={2}>
          <MainCard>
            <GridItem
              item
              divideColumn={1}
              spacing={2}
              sx={{
                '& .text': { maxWidth: '270px', minWidth: '270px' },
                '.inputBox': { maxWidth: '400px', minWidth: '400px' },
              }}
            >
              <LabelInput required label="SMTP URL" name="host" />
              <LabelInput required label="송신자 Email(From Account)" name="sender" />
              <LabelInput required label="수신자 Email(To Account)" name="recipients" />
              <LabelInput required label="SMTP 인증 사용자 ID(Auth User)" name="username" />
              <LabelInput
                required
                label="SMTP 인증 비밀번호(Auth Password)"
                name="password"
                htmlType="password"
              />
            </GridItem>
          </MainCard>
          <GridItem item directionHorizon="end">
            <Button variant="contained" type="submit">
              저장
            </Button>
          </GridItem>
        </GridItem>
      </form>
    </FormProvider>
  );
}

AlarmMail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AlarmMail;
