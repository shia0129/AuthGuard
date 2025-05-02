// libraries
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Typography, Stack, Button } from '@mui/material';
import { CloseCircleFilled } from '@ant-design/icons';
// components
import ButtonSet from '@components/modules/button/ButtonSet';
import PopUp from '@components/modules/common/PopUp';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import IconButton from '@components/@extended/IconButton';
// functions
import useApi from '@modules/hooks/useApi';

function PolicyTimeSetModal({ alertTimeOpen, setAlertTimeOpen }) {
  const [apiCall, openModal] = useApi();

  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      sundayStart: '',
      sundayEnd: '',
    },
  });

  // 요일목록
  const [sundayList, setSundayList] = useState([]);
  const [mondayList, setMondayList] = useState([]);
  const [tuesdayList, setTuesdayList] = useState([]);
  const [wednesdayList, setWednesdayList] = useState([]);
  const [thursdayList, setThursdayList] = useState([]);
  const [fridayList, setFridayList] = useState([]);
  const [saturdayList, setSaturdayList] = useState([]);

  const addTimeList = (day) => {
    if (methods.getValues(day + 'Start') !== '' && methods.getValues(day + 'End') !== '') {
      const timeDate =
        methods.getValues(day + 'Start').format('HH:mm') +
        '~' +
        methods.getValues(day + 'End').format('HH:mm');

      switch (day) {
        case 'sunday':
          return setSundayList((prev) => [...prev, timeDate]);
        case 'monday':
          return setMondayList((prev) => [...prev, timeDate]);
        case 'tuesday':
          return setTuesdayList((prev) => [...prev, timeDate]);
        case 'wednesday':
          return setWednesdayList((prev) => [...prev, timeDate]);
        case 'thursday':
          return setThursdayList((prev) => [...prev, timeDate]);
        case 'friday':
          return setFridayList((prev) => [...prev, timeDate]);
        case 'saturday':
          return setSaturdayList((prev) => [...prev, timeDate]);
        default:
          return;
      }
    } else {
      openModal({
        message: '시간을 선택해주세요.',
      });
    }
  };

  // x 버튼 클릭 시 해당데이터 지움
  const handleDeleteButtonClick = (item, day) => {
    if (day === 'sunday') {
      const filteredItems = sundayList.filter((oriData) => oriData !== item);
      setSundayList(filteredItems);
    } else if (day === 'monday') {
      const filteredItems = mondayList.filter((oriData) => oriData !== item);
      setMondayList(filteredItems);
    } else if (day === 'tuesday') {
      const filteredItems = tuesdayList.filter((oriData) => oriData !== item);
      setTuesdayList(filteredItems);
    } else if (day === 'wednesday') {
      const filteredItems = wednesdayList.filter((oriData) => oriData !== item);
      setWednesdayList(filteredItems);
    } else if (day === 'thursday') {
      const filteredItems = thursdayList.filter((oriData) => oriData !== item);
      setThursdayList(filteredItems);
    } else if (day === 'friday') {
      const filteredItems = fridayList.filter((oriData) => oriData !== item);
      setFridayList(filteredItems);
    } else if (day === 'saturday') {
      const filteredItems = saturdayList.filter((oriData) => oriData !== item);
      setSaturdayList(filteredItems);
    } else {
      return;
    }
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      alertOpen={alertTimeOpen}
      closeAlert={setAlertTimeOpen}
      title="정책 시간 설정"
    >
      <FormProvider {...methods}>
        <form>
          <Typography variant="h5">시간 설정</Typography>
          <GridItem>
            <GridItem
              container
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '150px', minWidth: '150px' },
              }}
            >
              <LabelInput
                type="select"
                label="일"
                name="sunday"
                labelBackgroundFlag
                list={[
                  { value: '1', label: '전일사용' },
                  { value: '2', label: '사용불가' },
                  { value: '3', label: '사용' },
                ]}
              />
              <Stack colSpan={2} direction="row" alignItems="center" sx={{ height: '100%' }}>
                <LabelInput
                  name="sundayStart"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="sundayEnd"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                <ButtonSet
                  type="search"
                  sx={{ ml: 3 }}
                  options={[
                    {
                      label: '추가',
                      variant: 'outlined',
                      callBack: () => addTimeList('sunday'),
                    },
                  ]}
                />
                {sundayList.length !== 0 && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    sx={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                  >
                    {sundayList.map((item, index) => (
                      <Stack key={index}>
                        <Button>{item}</Button>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteButtonClick(item, 'sunday')}
                          sx={{
                            maxHeight: '22px',
                          }}
                        >
                          <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem>
            <GridItem
              container
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '150px', minWidth: '150px' },
              }}
            >
              <LabelInput
                type="select"
                label="월"
                name="monday"
                labelBackgroundFlag
                //   value={parameters.policyDirection}
                //   onChange={changeParameters}
                list={[
                  { value: '1', label: '전일사용' },
                  { value: '2', label: '사용불가' },
                  { value: '3', label: '사용' },
                ]}
              />
              <Stack colSpan={2} direction="row" alignItems="center" sx={{ height: '100%' }}>
                <LabelInput
                  name="mondayStart"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="mondayEnd"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                  // value={parameters.workEndDate}
                  // onChange={changeParameters}
                />
                <ButtonSet
                  type="search"
                  sx={{ ml: 3 }}
                  options={[
                    {
                      label: '추가',
                      variant: 'outlined',
                      callBack: () => addTimeList('monday'),
                    },
                  ]}
                />
                {mondayList.length !== 0 && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    sx={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                  >
                    {mondayList.map((item, index) => (
                      <Stack key={index}>
                        <Button>{item}</Button>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteButtonClick(item, 'monday')}
                          sx={{
                            maxHeight: '22px',
                          }}
                        >
                          <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem>
            <GridItem
              container
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '150px', minWidth: '150px' },
              }}
            >
              <LabelInput
                type="select"
                label="화"
                name="tuesday"
                labelBackgroundFlag
                list={[
                  { value: '1', label: '전일사용' },
                  { value: '2', label: '사용불가' },
                  { value: '3', label: '사용' },
                ]}
              />
              <Stack colSpan={2} direction="row" alignItems="center" sx={{ height: '100%' }}>
                <LabelInput
                  name="tuesdayStart"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="tuesdayEnd"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                <ButtonSet
                  type="search"
                  sx={{ ml: 3 }}
                  options={[
                    {
                      label: '추가',
                      variant: 'outlined',
                      callBack: () => addTimeList('tuesday'),
                    },
                  ]}
                />
                {tuesdayList.length !== 0 && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    sx={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                  >
                    {tuesdayList.map((item, index) => (
                      <Stack key={index}>
                        <Button>{item}</Button>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteButtonClick(item, 'tuesday')}
                          sx={{
                            maxHeight: '22px',
                          }}
                        >
                          <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem>
            <GridItem
              container
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '150px', minWidth: '150px' },
              }}
            >
              <LabelInput
                type="select"
                label="수"
                name="wednesday"
                labelBackgroundFlag
                list={[
                  { value: '1', label: '전일사용' },
                  { value: '2', label: '사용불가' },
                  { value: '3', label: '사용' },
                ]}
              />
              <Stack colSpan={2} direction="row" alignItems="center" sx={{ height: '100%' }}>
                <LabelInput
                  name="wednesdayStart"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="wednesdayEnd"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                <ButtonSet
                  type="search"
                  sx={{ ml: 3 }}
                  options={[
                    {
                      label: '추가',
                      variant: 'outlined',
                      callBack: () => addTimeList('wednesday'),
                    },
                  ]}
                />
                {wednesdayList.length !== 0 && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    sx={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                  >
                    {wednesdayList.map((item, index) => (
                      <Stack key={index}>
                        <Button>{item}</Button>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteButtonClick(item, 'wednesday')}
                          sx={{
                            maxHeight: '22px',
                          }}
                        >
                          <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem>
            <GridItem
              container
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '150px', minWidth: '150px' },
              }}
            >
              <LabelInput
                type="select"
                label="목"
                name="thursday"
                labelBackgroundFlag
                list={[
                  { value: '1', label: '전일사용' },
                  { value: '2', label: '사용불가' },
                  { value: '3', label: '사용' },
                ]}
              />
              <Stack colSpan={2} direction="row" alignItems="center" sx={{ height: '100%' }}>
                <LabelInput
                  name="thursdayStart"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="thursdayEnd"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                <ButtonSet
                  type="search"
                  sx={{ ml: 3 }}
                  options={[
                    {
                      label: '추가',
                      variant: 'outlined',
                      callBack: () => addTimeList('thursday'),
                    },
                  ]}
                />
                {thursdayList.length !== 0 && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    sx={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                  >
                    {thursdayList.map((item, index) => (
                      <Stack key={index}>
                        <Button>{item}</Button>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteButtonClick(item, 'thursday')}
                          sx={{
                            maxHeight: '22px',
                          }}
                        >
                          <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem>
            <GridItem
              container
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '150px', minWidth: '150px' },
              }}
            >
              <LabelInput
                type="select"
                label="금"
                name="friday"
                labelBackgroundFlag
                list={[
                  { value: '1', label: '전일사용' },
                  { value: '2', label: '사용불가' },
                  { value: '3', label: '사용' },
                ]}
              />
              <Stack colSpan={2} direction="row" alignItems="center" sx={{ height: '100%' }}>
                <LabelInput
                  name="fridayStart"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="fridayEnd"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                <ButtonSet
                  type="search"
                  sx={{ ml: 3 }}
                  options={[
                    {
                      label: '추가',
                      variant: 'outlined',
                      callBack: () => addTimeList('friday'),
                    },
                  ]}
                />
                {fridayList.length !== 0 && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    sx={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                  >
                    {fridayList.map((item, index) => (
                      <Stack key={index}>
                        <Button>{item}</Button>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteButtonClick(item, 'friday')}
                          sx={{
                            maxHeight: '22px',
                          }}
                        >
                          <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridItem>
          </GridItem>
          <GridItem>
            <GridItem
              container
              divideColumn={3}
              spacing={2}
              sx={{
                pr: 5,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '150px', minWidth: '150px' },
              }}
            >
              <LabelInput
                type="select"
                label="토"
                name="saturday"
                labelBackgroundFlag
                list={[
                  { value: '1', label: '전일사용' },
                  { value: '2', label: '사용불가' },
                  { value: '3', label: '사용' },
                ]}
              />
              <Stack colSpan={2} direction="row" alignItems="center" sx={{ height: '100%' }}>
                <LabelInput
                  name="saturdayStart"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                &nbsp;~&nbsp;
                <LabelInput
                  name="saturdayEnd"
                  type="time1"
                  views={['hours', 'minutes']}
                  inputFormat="HH:mm"
                />
                <ButtonSet
                  type="search"
                  sx={{ ml: 3 }}
                  options={[
                    {
                      label: '추가',
                      variant: 'outlined',
                      callBack: () => addTimeList('saturday'),
                    },
                  ]}
                />
                {saturdayList.length !== 0 && (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    sx={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      overflow: 'scroll',
                    }}
                  >
                    {saturdayList.map((item, index) => (
                      <Stack key={index}>
                        <Button>{item}</Button>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteButtonClick(item, 'saturday')}
                          sx={{
                            maxHeight: '22px',
                          }}
                        >
                          <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </GridItem>
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default PolicyTimeSetModal;
