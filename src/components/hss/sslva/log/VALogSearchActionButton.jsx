import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { setParameters } from '@modules/redux/reducers/hss/common/log';
import { Typography, Box } from '@mui/material';
import { useState } from 'react';

const logDescriptions = [
  {
    title: '[기본 로그]',
    logs: [
      { code: 'CONN', description: '세션 접속 로그' },
      { code: 'DISCONN', description: '세션 종료 로그' },
      { code: 'HANDSHAKE_FAIL', description: 'SSL/TLS HandShake 실패 로그' },
    ],
  },
  {
    title: '[인증서 검증 옵션 로그]',
    logs: [
      {
        code: 'CERT_VERIFY_FAIL',
        description: (
          <>
            인증서 검증 실패 로그 <br />
            (실패 사유는 reason/code 확인)
          </>
        ),
      },
    ],
  },
  {
    title: '[프로토콜 검증 옵션 로그]',
    logs: [
      {
        code: 'VALIDATE_PROTO',
        description: (
          <>
            프로토콜 검증 실패 로그 <br />
            (실패 사유는 reason 확인)
          </>
        ),
      },
    ],
  },
];

function VALogSearchActionButton(props) {
  const { onSearchButtonClick } = props;

  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.log);

  const inquiryClickButton = () => {
    if (parameterData.parameters.current.page === 0) {
      onSearchButtonClick(parameterData.parameters.current);
    }
    dispatch(setParameters({ page: 0 }));
  };

  const [showDesc, setShowDesc] = useState(false);

  return (
    <>
      <GridItem item directionHorizon="space-between">
        <ButtonSet
          options={[
            {
              label: `설명 ${showDesc ? '숨기기' : '보기'}`,
              callBack: () => setShowDesc((prev) => !prev),
              color: showDesc ? 'secondary' : 'success',
              variant: 'contained',
            },
          ]}
        />
        <ButtonSet
          options={[
            {
              label: '조회',
              callBack: () => inquiryClickButton(),
              color: 'primary',
              variant: 'contained',
            },
          ]}
        />
      </GridItem>
      {showDesc && (
        <GridItem item>
          <GridItem container spacing={2}>
            {logDescriptions.map((section, idx) => (
              <GridItem item xs={4} key={idx}>
                <Box
                  sx={{
                    backgroundColor: '#FAFAFA',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 1.5,
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {section.title}
                  </Typography>
                  {section.logs.map((log, i) => (
                    <Typography key={i} variant="body2" sx={{ display: 'flex', lineHeight: 1.6 }}>
                      <Box component="strong" sx={{ minWidth: 130 }}>
                        {log.code}
                      </Box>
                      {log.description}
                    </Typography>
                  ))}
                </Box>
              </GridItem>
            ))}
          </GridItem>
        </GridItem>
      )}
    </>
  );
}

export default VALogSearchActionButton;
