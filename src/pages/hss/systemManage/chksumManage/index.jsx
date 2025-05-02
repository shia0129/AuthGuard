import Layout from '@components/layouts';
import { useState, useEffect } from 'react';
import { styled } from '@mui/styles';

// Project import
// import chksumInfoApi from '@api/system/chksumInfoApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import GridItem from '@components/modules/grid/GridItem';
import useApi from '@modules/hooks/useApi';
import MiniTable from '@components/modules/table/MiniTable';
import usePopup from '@modules/hooks/usePopup';
import {
  Button,
  Stack,
  CardHeader,
  Card,
  CardActions,
  IconButton,
  Collapse,
  Typography,
  CardContent,
  Box,
  CircularProgress,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { unstable_batchedUpdates } from 'react-dom';
import { useIntl } from 'react-intl';

// 컴포넌트 페이지 호출
// import ChksumStat from 'src/pages/system/chksum/chksumStat';
import ChksumStat from './chksumStat';

// next
import { useSession } from 'next-auth/react';

const AnimationExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  color: '#fff',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// style
const COMMON_BUTTON_HEADER_STYLE = {
  backgroundColor: '#fff',
  borderRadius: '3px',
  fontSize: '13px',
  color: '#000000bd',
  fontWeight: 600,
  ':hover': { backgroundColor: '#dcd8d8' },
};
const HEADER_BUTTON_STYLE = {
  ...COMMON_BUTTON_HEADER_STYLE,
  '&.disabled': {
    color: '#c7c7c7',
    backgroundColor: '#f9f6f6',
  },
};

const mockHisData = {
  data: {
    resultData: [
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000014',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 1,
        workRdate: '20250424130000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424130005',
        workEdate: '20250424130006',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000014',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 2,
        workRdate: '20250424130000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424130008',
        workEdate: '20250424130009',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000014',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 3,
        workRdate: '20250424130000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424130006',
        workEdate: '20250424130006',
        workTotal: 32,
        workSucc: 32,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000014',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 4,
        workRdate: '20250424130000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424130006',
        workEdate: '20250424130008',
        workTotal: 1681,
        workSucc: 1681,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000013',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 5,
        workRdate: '20250424120000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424120006',
        workEdate: '20250424120006',
        workTotal: 32,
        workSucc: 32,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000013',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 6,
        workRdate: '20250424120000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424120008',
        workEdate: '20250424120008',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000013',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 7,
        workRdate: '20250424120000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424120006',
        workEdate: '20250424120008',
        workTotal: 1681,
        workSucc: 1681,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000013',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 8,
        workRdate: '20250424120000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424120005',
        workEdate: '20250424120006',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000012',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 9,
        workRdate: '20250424110000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424110007',
        workEdate: '20250424110007',
        workTotal: 32,
        workSucc: 32,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000012',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 10,
        workRdate: '20250424110000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424110011',
        workEdate: '20250424110011',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000012',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 11,
        workRdate: '20250424110000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424110007',
        workEdate: '20250424110011',
        workTotal: 1681,
        workSucc: 1681,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000012',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 12,
        workRdate: '20250424110000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424110005',
        workEdate: '20250424110007',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000011',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 13,
        workRdate: '20250424100000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424100006',
        workEdate: '20250424100006',
        workTotal: 32,
        workSucc: 32,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000011',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 14,
        workRdate: '20250424100000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424100008',
        workEdate: '20250424100008',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000011',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 15,
        workRdate: '20250424100000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424100006',
        workEdate: '20250424100008',
        workTotal: 1681,
        workSucc: 1681,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000011',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 16,
        workRdate: '20250424100000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424100005',
        workEdate: '20250424100006',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000010',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 17,
        workRdate: '20250424090000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424090006',
        workEdate: '20250424090006',
        workTotal: 32,
        workSucc: 32,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000010',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 18,
        workRdate: '20250424090000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424090008',
        workEdate: '20250424090009',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000010',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 19,
        workRdate: '20250424090000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424090006',
        workEdate: '20250424090008',
        workTotal: 1681,
        workSucc: 1681,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000010',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 20,
        workRdate: '20250424090000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424090005',
        workEdate: '20250424090006',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000009',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 21,
        workRdate: '20250424080000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424080006',
        workEdate: '20250424080006',
        workTotal: 32,
        workSucc: 32,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000009',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 22,
        workRdate: '20250424080000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424080008',
        workEdate: '20250424080008',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000009',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 23,
        workRdate: '20250424080000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424080006',
        workEdate: '20250424080008',
        workTotal: 1681,
        workSucc: 1681,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000009',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 24,
        workRdate: '20250424080000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424080005',
        workEdate: '20250424080006',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000008',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 25,
        workRdate: '20250424070000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424070005',
        workEdate: '20250424070006',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000008',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 26,
        workRdate: '20250424070000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424070008',
        workEdate: '20250424070008',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000008',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 27,
        workRdate: '20250424070000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424070006',
        workEdate: '20250424070008',
        workTotal: 1681,
        workSucc: 1681,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000008',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 28,
        workRdate: '20250424070000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424070006',
        workEdate: '20250424070006',
        workTotal: 32,
        workSucc: 32,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000007',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 29,
        workRdate: '20250424060000',
        workTypeNm: 'HASH 검사',
        workStepNm: '실패종료',
        workStep: '9',
        userNm: '-',
        userDept: '',
        workSdate: '20250424060005',
        workEdate: '20250424060006',
        workTotal: 130,
        workSucc: 86,
        workFail: 44,
      },
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '2025042410610000007',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: '2',
        regUserSeq: '0',
        no: 30,
        workRdate: '20250424060000',
        workTypeNm: 'HASH 검사',
        workStepNm: '성공종료',
        workStep: '3',
        userNm: '-',
        userDept: '',
        workSdate: '20250424060008',
        workEdate: '20250424060008',
        workTotal: 1684,
        workSucc: 1684,
        workFail: 0,
      },
    ],
  },
};

const mockChkSumInfoList = {
  data: {
    groupInfoList: [
      {
        locale: 'ko',
        systemId: null,
        groupId: 'E0',
        groupNm: '접근제어 엔진',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '0',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: null,
        regUserSeq: '0',
        no: 0,
        workRdate: null,
        workTypeNm: null,
        workStepNm: null,
        workStep: null,
        userNm: null,
        userDept: null,
        workSdate: null,
        workEdate: null,
        workTotal: 0,
        workSucc: 0,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: null,
        groupId: 'S0',
        groupNm: '자체시험',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '0',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: null,
        regUserSeq: '0',
        no: 0,
        workRdate: null,
        workTypeNm: null,
        workStepNm: null,
        workStep: null,
        userNm: null,
        userDept: null,
        workSdate: null,
        workEdate: null,
        workTotal: 0,
        workSucc: 0,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: null,
        groupId: 'W1',
        groupNm: 'WEB 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '0',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: null,
        regUserSeq: '0',
        no: 0,
        workRdate: null,
        workTypeNm: null,
        workStepNm: null,
        workStep: null,
        userNm: null,
        userDept: null,
        workSdate: null,
        workEdate: null,
        workTotal: 0,
        workSucc: 0,
        workFail: 0,
      },
      {
        locale: 'ko',
        systemId: null,
        groupId: 'W0',
        groupNm: 'WAS 서버',
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '0',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: null,
        regUserSeq: '0',
        no: 0,
        workRdate: null,
        workTypeNm: null,
        workStepNm: null,
        workStep: null,
        userNm: null,
        userDept: null,
        workSdate: null,
        workEdate: null,
        workTotal: 0,
        workSucc: 0,
        workFail: 0,
      },
    ],
    systemInfoList: [
      {
        locale: 'ko',
        systemId: 'passguard01',
        groupId: null,
        groupNm: null,
        chksumRun: null,
        statStopFlag: false,
        statValidFlag: false,
        workTypeHashFlag: false,
        workTypeValidFlag: false,
        chksumReq: '0',
        chksumRunNm: null,
        chksumStat: null,
        chksumStatNm: null,
        hashDate: null,
        chksumSdate: null,
        chksumEdate: null,
        chksumTotal: 0,
        chksumSucc: 0,
        chksumFail: 0,
        workType: null,
        regUserSeq: '0',
        no: 0,
        workRdate: null,
        workTypeNm: null,
        workStepNm: null,
        workStep: null,
        userNm: null,
        userDept: null,
        workSdate: null,
        workEdate: null,
        workTotal: 0,
        workSucc: 0,
        workFail: 0,
      },
    ],
  },
};

const mockChksumStatMap = {
  data: {
    'passguard01^W1': {
      locale: 'ko',
      systemId: 'passguard01',
      groupId: 'W1',
      groupNm: null,
      chksumRun: '1',
      statStopFlag: false,
      statValidFlag: false,
      workTypeHashFlag: false,
      workTypeValidFlag: false,
      chksumReq: '2025042410610000014',
      chksumRunNm: 'ON',
      chksumStat: '3',
      chksumStatNm: '정상',
      hashDate: '20250328170943',
      chksumSdate: '20250424130008',
      chksumEdate: '20250424130009',
      chksumTotal: 1684,
      chksumSucc: 1684,
      chksumFail: 0,
      workType: null,
      regUserSeq: '0',
      no: 0,
      workRdate: null,
      workTypeNm: null,
      workStepNm: null,
      workStep: null,
      userNm: null,
      userDept: null,
      workSdate: null,
      workEdate: null,
      workTotal: 0,
      workSucc: 0,
      workFail: 0,
    },
    'passguard01^W0': {
      locale: 'ko',
      systemId: 'passguard01',
      groupId: 'W0',
      groupNm: null,
      chksumRun: '1',
      statStopFlag: false,
      statValidFlag: false,
      workTypeHashFlag: false,
      workTypeValidFlag: false,
      chksumReq: '2025042410610000014',
      chksumRunNm: 'ON',
      chksumStat: '3',
      chksumStatNm: '정상',
      hashDate: '20250418165702',
      chksumSdate: '20250424130006',
      chksumEdate: '20250424130008',
      chksumTotal: 1681,
      chksumSucc: 1681,
      chksumFail: 0,
      workType: null,
      regUserSeq: '0',
      no: 0,
      workRdate: null,
      workTypeNm: null,
      workStepNm: null,
      workStep: null,
      userNm: null,
      userDept: null,
      workSdate: null,
      workEdate: null,
      workTotal: 0,
      workSucc: 0,
      workFail: 0,
    },
    'passguard01^S0': {
      locale: 'ko',
      systemId: 'passguard01',
      groupId: 'S0',
      groupNm: null,
      chksumRun: '1',
      statStopFlag: false,
      statValidFlag: false,
      workTypeHashFlag: false,
      workTypeValidFlag: false,
      chksumReq: '2025042410610000014',
      chksumRunNm: 'ON',
      chksumStat: '3',
      chksumStatNm: '정상',
      hashDate: '20250328170941',
      chksumSdate: '20250424130006',
      chksumEdate: '20250424130006',
      chksumTotal: 32,
      chksumSucc: 32,
      chksumFail: 0,
      workType: null,
      regUserSeq: '0',
      no: 0,
      workRdate: null,
      workTypeNm: null,
      workStepNm: null,
      workStep: null,
      userNm: null,
      userDept: null,
      workSdate: null,
      workEdate: null,
      workTotal: 0,
      workSucc: 0,
      workFail: 0,
    },
    'passguard01^E0': {
      locale: 'ko',
      systemId: 'passguard01',
      groupId: 'E0',
      groupNm: null,
      chksumRun: '1',
      statStopFlag: false,
      statValidFlag: false,
      workTypeHashFlag: false,
      workTypeValidFlag: false,
      chksumReq: '2025042410610000014',
      chksumRunNm: 'ON',
      chksumStat: '9',
      chksumStatNm: '오류',
      hashDate: '20250422101046',
      chksumSdate: '20250424130005',
      chksumEdate: '20250424130006',
      chksumTotal: 130,
      chksumSucc: 86,
      chksumFail: 44,
      workType: null,
      regUserSeq: '0',
      no: 0,
      workRdate: null,
      workTypeNm: null,
      workStepNm: null,
      workStep: null,
      userNm: null,
      userDept: null,
      workSdate: null,
      workEdate: null,
      workTotal: 0,
      workSucc: 0,
      workFail: 0,
    },
  },
};

function ChksumInfo() {
  const intl = useIntl();

  //   chksumInfoApi.axios = AuthInstance();

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  const handleOpenWindow = usePopup();
  const { data: session } = useSession();

  // 시스템 정보 리스트
  const [systemInfoList, setSystemInfoList] = useState([]);
  // 무결성 그룹 정보 리스트
  const [chksumGroupList, setChksumGroupList] = useState([]);
  // 무결성 상태 정보 Object ( {systemId^groupId} )
  const [chksumStatMap, setChksumStatMap] = useState({});

  // 전체 끄기/켜기 시스템 별 상태 ({systemId: '1'(모두켜짐), '2'(모두꺼짐)})
  const [chksumRunSystemBtnInfo, setChksumRunSystemBtnInfo] = useState({});
  // 네트워크 실패 상태 ({systemId: true(실패), false(성공)})
  const [networkFailInfo, setNetworkFailInfo] = useState({});
  // 전체 Hash생성, 전체 검사 상태(개별 생성, 검사일 때도 해당 버튼 disabled)  ({systemId: true(작업중), false(미작업중)})
  // + chksumStat 모두 중지(0) 상태도 disabled
  const [chksumReqCheck, setChksumReqCheck] = useState({});
  // 시스템별 모든 버튼 disabled ({system: true, system1: false}) true: 사용불가능, false: 사용가능
  const [chksumAllBtnDisableInfo, setChksumAllBtnDisableInfo] = useState({});

  ///////////// 하단부 리스트
  // 무결성 요청 이력 목록
  const [chksumReqHisList, setChksumReqHisList] = useState([]);

  // 데이터 마운트
  const [isMount, setIsMount] = useState(false);

  // 무결성 검사 끄기
  const doChangeChksumRunAll = async (chksumRun, systemId) => {
    console.log('doChangeChksumRunAll()');
    // const result = await apiCall(chksumInfoApi.updateChksumRunInfo, { systemId, chksumRun });
    // if (result.status === 200) {
    //   await getChksumStatData(); // 데이터 갱신
    // }
  };
  // 무결성 검사 끄기 Confirm
  const handleChangeChksumRunAllOpenConfirm = (chksumRun, systemId) => {
    const msg =
      chksumRun === '1'
        ? intl.formatMessage({ id: 'system.chksumInfo-confirm-all-off' }) // 시스템의 무결성 검사를 모두 끄시겠습니까?
        : intl.formatMessage({ id: 'system.chksumInfo-confirm-all-on' }); // 시스템의 무결성 검사를 모두 켜시겠습니까?
    const changeRunStat = chksumRun === '1' ? '2' : '1';
    openModal({
      message: (
        <>
          <Typography sx={{ cursor: 'default' }}>
            {systemId}
            {msg}
          </Typography>
        </>
      ),
      onConfirm: () => {
        doChangeChksumRunAll(changeRunStat, systemId);
        setChksumRunSystemBtnInfo((p) => ({
          ...p,
          [systemId]: changeRunStat,
        }));
      },
    });
  };

  // 전체 Hash 생성 / 전체 검사 요청
  const doChksumAllRequest = async (workType, systemId) => {
    console.log('doChksumAllRequest()');
    // const result = await apiCall(chksumInfoApi.insertChksumAllRequestInfo, {
    //   workType,
    //   systemId,
    //   regUserSeq: session.user.userSeq,
    // });
    // if (result.status === 200) {
    //   await getChksumStatData(); // 데이터 갱신
    // }
  };
  // 전체 Hash 생성 / 전체 검사 요청 Confirm
  // workType = '1': hash 생성, '2': 검사
  const handleChksumAllRequest = (workType, systemId) => {
    const msg =
      workType === '1'
        ? intl.formatMessage({ id: 'system.chksumInfo-confirm-all-hash' }) // 시스템의 전체 Hash 생성을 요청 하시겠습니까?
        : intl.formatMessage({ id: 'system.chksumInfo-confirm-all-chksum' }); // 시스템의 전체 무결성 검사를 요청 하시겠습니까?
    openModal({
      message: (
        <>
          <Typography sx={{ cursor: 'default' }}>
            {systemId}
            {msg}
          </Typography>
        </>
      ),
      onConfirm: () => {
        doChksumAllRequest(workType, systemId);
      },
    });
  };

  // 시스템 리스트, 무결성 그룹 정보 가져오기
  const getChksumInfoData = async () => {
    console.log('getChksumInfoData()');
    // const chksumInfoList = await apiCall(chksumInfoApi.getChksumInfo);
    const chksumInfoList = mockChkSumInfoList;
    // // 시스템 리스트 정보, 무결성 그룹 정보
    // if (chksumInfoList.status === 200) {
    setSystemInfoList(
      chksumInfoList.data?.systemInfoList?.map((data) => ({ ...data, expanded: true })),
    );
    setChksumGroupList(chksumInfoList.data?.groupInfoList);
    // }
  };

  // 하단 부 리스트 가져오기
  const getChksumReqHisList = async () => {
    console.log('getChksumReqHisList()');
    return mockHisData.data.resultData;
    // const result = await apiCall(chksumInfoApi.getChksumReqHisList);
    // if (result.status === 200) {
    //   return result.data.resultData;
    // }
  };

  /////// 무결성 상태 가져오기(데이터 가져오기 ※중요)
  const getChksumStatData = async () => {
    console.log('getChksumStatData()');

    const chksumStatMap = mockChksumStatMap;
    const chksumAllOnOrOffInfo = chksumAllOnOrOff(chksumStatMap?.data); // 무결성 전체 켜기, 끄기 Text 설정
    const chksumAllBtnDisableInfo = chksumAllBtnDisable(chksumStatMap?.data);

    const chksumReqHisInfo = await getChksumReqHisList(); // 하단부 무결성 검사 이력 가져오기
    unstable_batchedUpdates(() => {
      setChksumStatMap(chksumStatMap?.data); // 무결성 시스템, 그룹별 상태 가져오기
      setChksumRunSystemBtnInfo(chksumAllOnOrOffInfo);
      setChksumAllBtnDisableInfo(chksumAllBtnDisableInfo);
      setChksumReqHisList(chksumReqHisInfo);
    });

    // const chksumStatMap = await apiCall(chksumInfoApi.getChksumStatInfo);
    // // 무결성 상태 정보
    // if (chksumStatMap.status === 200) {
    //   const networkFailureInfo = await getNetworkFailure(); // 네트워크 실패 정보 가져오기
    //   const chksumAllReqBtnInfo = await chksumAllReqBtn(); // 전체 Hash 생성, 전체 검사 상태 값 가져오기 {systemId: true, systemId: false(disabled)}
    //   const chksumAllOnOrOffInfo = chksumAllOnOrOff(chksumStatMap?.data); // 무결성 전체 켜기, 끄기 Text 설정
    //   const chksumAllBtnDisableInfo = chksumAllBtnDisable(chksumStatMap?.data);
    //   const chksumReqHisInfo = await getChksumReqHisList(); // 하단부 무결성 검사 이력 가져오기
    //   unstable_batchedUpdates(() => {
    //     setNetworkFailInfo(networkFailureInfo);
    //     setChksumStatMap(chksumStatMap?.data); // 무결성 시스템, 그룹별 상태 가져오기
    //     setChksumReqCheck(chksumAllReqBtnInfo);
    //     setChksumRunSystemBtnInfo(chksumAllOnOrOffInfo);
    //     setChksumAllBtnDisableInfo(chksumAllBtnDisableInfo);
    //     setChksumReqHisList(chksumReqHisInfo);
    //   });
    // }
  };

  // 네트워크 성공, 실패 정보 가져오기
  const getNetworkFailure = async () => {
    console.log('getNetworkFailure()');
    // const result = await apiCall(chksumInfoApi.getNetworkFailureInfo);
    // if (result.status === 200) {
    //   return result.data;
    // }
  };

  // 전체 Hash 생성, 전체 검사 상태 값 가져오기 {systemId: true, systemId: false(disabled)}
  const chksumAllReqBtn = async () => {
    console.log('chksumAllReqBtn()');
    // 시스템 별 요청 여부 정보 (+ 정지 중이여도 true로 나옴 => 전체버튼들 disabled 용도)
    // const result = await apiCall(chksumInfoApi.getChksumStatOfSystemInfo);
    // if (result.status === 200) {
    //   return result.data;
    // }
  };

  // // 무결성 전체 켜기, 끄기 Text 설정
  const chksumAllOnOrOff = (data) => {
    let chksumRunInfo = {};
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const item = data[key];
        if (item !== null && item !== undefined) {
          if (item.chksumRun === '1') {
            // 동작중이 아니면 false (text: 전체 끄기)
            chksumRunInfo[item?.systemId] = '1';
          } else {
            if (!(item?.systemId in chksumRunInfo)) chksumRunInfo[item?.systemId] = '2'; // (text: 전체 켜기)
          }
        }
      }
    }
    return chksumRunInfo;
  };

  const chksumAllBtnDisable = (statMap) => {
    // systemId 별로 모든 값이 null인지를 확인하는 함수
    const isAllNullBySystemId = (data, systemId) => {
      const prefix = systemId + '^';
      return Object.keys(data)
        .filter((key) => key.startsWith(prefix)) // 해당 systemId로 시작하는 key만 필터링
        .every((key) => data[key] === null); // 해당 key의 값이 모두 null인지 확인
    };

    // // 각 systemId 별로 모든 값이 null인지를 확인하여 결과를 출력
    const result = Object.keys(statMap).reduce((acc, key) => {
      const systemId = key.split('^')[0]; // systemId 추출
      if (!acc[systemId]) {
        acc[systemId] = isAllNullBySystemId(statMap, systemId); // 해당 systemId 별로 모든 값이 null인지 확인
      }
      return acc;
    }, {});

    return result;
  };

  const init = async () => {
    await getChksumInfoData();
    await getChksumStatData(); // 초기 데이터 가져오고 mount 변경되면 주기적으로 가져옴
    setIsMount(true);
  };

  useEffect(() => {
    setIsMount(false);
    init();
  }, []);

  // 마운트 끝나면 주기적 데이터 가져오기
  useEffect(() => {
    const waitAndReload = setInterval(async () => {
      await getChksumStatData();
    }, 2000);

    return () => clearInterval(waitAndReload);
  }, [isMount]); // 마운트되면 주기적으로 데이터 갱신

  // Card 확장, 축소 함수
  const handleExpandClick = (e, index) => {
    setSystemInfoList((prevList) => {
      const newList = [...prevList];
      newList[index] = {
        ...newList[index],
        expanded: !newList[index].expanded,
      };
      return newList;
    });
    e.stopPropagation();
  };

  const doDetail = (chksumReq, systemId, groupId) => {
    handleOpenWindow({
      url: `${window.location.origin}/record/chksum/popup/chksumHisFailPopup`,
      openName: 'chksumHisFailPopup',
      width: '1126',
      height: '710',
      dataSet: {
        chksumReq,
        systemId,
        groupId,
      },
    });
  };

  return !isMount ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 48 }}>
      <CircularProgress />
    </Box>
  ) : (
    <GridItem containter direction="row" divideColumn="column" sx={{ pt: 1, pl: 0.5, pr: 0.5 }}>
      {systemInfoList?.map((system, i) => (
        <Card
          sx={{
            minWidth: '83.5vw',
            mb: 3,
          }}
          key={`chksum-info-${system?.systemId}-${i}`}
        >
          <CardHeader
            title={
              <Stack
                sx={{
                  display: '-webkit-box',
                  justifyContent: 'space-between',
                  pr: 5,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: '400', fontSize: '1.125rem', cursor: 'default' }}
                >
                  {system?.systemId} &nbsp;&nbsp;
                  {/* {networkFailInfo[system?.systemId]
                    ? `[네트워크 오류]`
                    : ''} */}
                  {networkFailInfo[system?.systemId]
                    ? `[${intl.formatMessage({ id: 'system.chksumInfo-typo-networkErr' })}]`
                    : ''}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    sx={HEADER_BUTTON_STYLE}
                    disabled={
                      chksumAllBtnDisableInfo[system?.systemId] || networkFailInfo[system?.systemId]
                    }
                    onClick={() =>
                      handleChangeChksumRunAllOpenConfirm(
                        chksumRunSystemBtnInfo[system?.systemId],
                        system.systemId,
                      )
                    }
                    className={
                      chksumAllBtnDisableInfo[system?.systemId] || networkFailInfo[system?.systemId]
                        ? 'disabled'
                        : ''
                    }
                  >
                    {/* {chksumRunSystemBtnInfo[system?.systemId] === '1'
                      ? '전체 끄기'
                      : '전체 켜기'} */}
                    {chksumRunSystemBtnInfo[system?.systemId] === '1'
                      ? intl.formatMessage({ id: 'system.chksumInfo-btn-allOff' })
                      : intl.formatMessage({ id: 'system.chksumInfo-btn-allOn' })}
                  </Button>
                  <Button
                    variant="contained"
                    sx={HEADER_BUTTON_STYLE}
                    disabled={
                      chksumAllBtnDisableInfo[system?.systemId] ||
                      networkFailInfo[system?.systemId] ||
                      chksumReqCheck[system?.systemId] ||
                      chksumRunSystemBtnInfo[system?.systemId] === '2'
                    }
                    onClick={() => handleChksumAllRequest('1', system?.systemId)}
                    className={
                      chksumAllBtnDisableInfo[system?.systemId] ||
                      networkFailInfo[system?.systemId] ||
                      chksumReqCheck[system?.systemId] ||
                      chksumRunSystemBtnInfo[system?.systemId] === '2'
                        ? 'disabled'
                        : ''
                    }
                  >
                    {/* 전체 Hash 생성 */}
                    {intl.formatMessage({ id: 'system.chksumInfo-btn-allHashCreate' })}
                  </Button>
                  <Button
                    variant="contained"
                    sx={HEADER_BUTTON_STYLE}
                    disabled={
                      chksumAllBtnDisableInfo[system?.systemId] ||
                      networkFailInfo[system?.systemId] ||
                      chksumReqCheck[system?.systemId] ||
                      chksumRunSystemBtnInfo[system?.systemId] === '2'
                    }
                    onClick={() => handleChksumAllRequest('2', system?.systemId)}
                    className={
                      chksumAllBtnDisableInfo[system?.systemId] ||
                      networkFailInfo[system?.systemId] ||
                      chksumReqCheck[system?.systemId] ||
                      chksumRunSystemBtnInfo[system?.systemId] === '2'
                        ? 'disabled'
                        : ''
                    }
                  >
                    {/* 전체 검사 */}
                    {intl.formatMessage({ id: 'system.chksumInfo-btn-allCheck' })}
                  </Button>
                </Stack>
              </Stack>
            }
            sx={{
              p: '4px 15px 4px 20px',
              minHeight: '40px',
              maxHeight: '40px',
              backgroundColor: '#0a97c9',
              color: '#fff',

              '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' },
            }}
          />

          <CardActions disableSpacing sx={{ p: 0, pr: 1, mt: -4.5 }}>
            <AnimationExpandMore
              expand={system?.expanded}
              onClick={(e) => handleExpandClick(e, i)}
              aria-expanded={system?.expanded}
              aria-label={`more ${system?.systemId}`}
            >
              <ExpandMore sx={{ mt: system?.expanded ? 0.5 : 0, mb: system?.expanded ? 0 : 0.5 }} />
            </AnimationExpandMore>
          </CardActions>
          <Collapse in={system?.expanded} timeout="auto" unmountOnExit>
            <CardContent sx={{ pt: 2, pl: 2, pr: 1, height: '360px', overflowY: 'auto' }}>
              <GridItem container direction="row" divideColumn={4} columnSpacing={1} rowSpacing={3}>
                {chksumGroupList?.map(
                  (groupInfo, index) =>
                    chksumStatMap?.[system?.systemId + '^' + groupInfo?.groupId] && (
                      <ChksumStat
                        key={index}
                        groupNm={groupInfo?.groupNm}
                        statInfo={chksumStatMap?.[system?.systemId + '^' + groupInfo?.groupId]}
                        networkFail={networkFailInfo[system.systemId]}
                        buttonStyle={HEADER_BUTTON_STYLE}
                        getChksumStatData={getChksumStatData}
                        regUserSeq={session.user.userSeq}
                      />
                    ),
                )}
              </GridItem>
            </CardContent>
          </Collapse>
        </Card>
      ))}

      {/* 무결성 요청 작업 이력 테이블 */}
      <MiniTable
        margin
        maxHeight="360px"
        ellipsis
        pageSize={30}
        rowClick={(event, rowData) => {
          rowData.workType !== '2' || rowData.workStep !== '9'
            ? {}
            : doDetail(rowData.chksumReq, rowData.systemId, rowData.groupId);
        }}
        columns={[
          {
            label: 'NO.',
            id: 'no',
            options: {
              textAlign: 'center',
              width: '30px',
              minWidth: chksumReqHisList.length !== 0 ? '30px' : '48px',
            },
          },
          {
            //label: '작업 요청시간',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workRdate' }),
            id: 'workRdate',
            options: {
              textAlign: 'center',
              width: '165px',
              minWidth: chksumReqHisList.length !== 0 ? '165px' : '182px',
            },
          },
          {
            //label: '작업 구분',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workType' }),
            id: 'workTypeNm',
            options: {
              textAlign: 'center',
              width: '100px',
              minWidth: chksumReqHisList.length !== 0 ? '100px' : '116px',
            },
          },
          {
            //label: '작업 상태',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workStep' }),
            id: 'workStepNm',
            options: {
              textAlign: 'center',
              width: '100px',
              minWidth: chksumReqHisList.length !== 0 ? '100px' : '118px',
            },
          },
          {
            //label: '작업자 이름',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-userNm' }),
            id: 'userNm',
            options: {
              textAlign: 'left',
              width: '120px',
              minWidth: chksumReqHisList.length !== 0 ? '120px' : '136px',
            },
          },
          {
            //label: '작업자 소속',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-userDept' }),
            id: 'userDept',
            options: {
              textAlign: 'left',
              width: '120px',
              minWidth: chksumReqHisList.length !== 0 ? '120px' : '137px',
            },
          },
          {
            //label: '작업 서버',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-systemId' }),
            id: 'systemId',
            options: {
              textAlign: 'left',
              width: '105px',
              minWidth: chksumReqHisList.length !== 0 ? '105px' : '123px',
            },
          },
          {
            //label: '작업 그룹',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-groupNm' }),
            id: 'groupNm',
            options: {
              textAlign: 'center',
              width: '100px',
              minWidth: chksumReqHisList.length !== 0 ? '100px' : '117px',
            },
          },
          {
            //label: '작업 시작시간',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workSdate' }),
            id: 'workSdate',
            options: {
              textAlign: 'center',
              width: '165px',
              minWidth: chksumReqHisList.length !== 0 ? '165px' : '182px',
            },
          },
          {
            //label: '작업 종료시간',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workEdate' }),
            id: 'workEdate',
            options: {
              textAlign: 'center',
              width: '165px',
              minWidth: chksumReqHisList.length !== 0 ? '165px' : '181px',
            },
          },
          {
            //label: '총건수',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workTotal' }),
            id: 'workTotal',
            options: {
              textAlign: 'right',
              width: '68px',
              minWidth: chksumReqHisList.length !== 0 ? '68px' : '87px',
            },
          },
          {
            //label: '정상건수',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workSucc' }),
            id: 'workSucc',
            options: {
              textAlign: 'right',
              width: '68px',
              minWidth: chksumReqHisList.length !== 0 ? '68px' : '87px',
            },
          },
          {
            //label: '오류건수',
            label: intl.formatMessage({ id: 'system.chksumInfo-label-workFail' }),
            id: 'workFail',
            options: {
              textAlign: 'right',
              width: '68px',
              minWidth: chksumReqHisList.length !== 0 ? '68px' : '87px',
            },
          },
        ]}
        data={chksumReqHisList.map((item) => ({
          no: item.no,
          workRdate: HsLib.changeDateFormat(item?.workRdate, '$1-$2-$3 $4:$5:$6'),
          workTypeNm: item.workTypeNm,
          workStepNm: item.workStepNm,
          userNm: item.userNm,
          userDept: item.userDept,
          systemId: item.systemId,
          groupId: item.groupId,
          groupNm: item.groupNm,
          workSdate: HsLib.changeDateFormat(item?.workSdate, '$1-$2-$3 $4:$5:$6'),
          workEdate: HsLib.changeDateFormat(item?.workEdate, '$1-$2-$3 $4:$5:$6'),
          workTotal: HsLib.addNumberComma(item.workTotal),
          workSucc: HsLib.addNumberComma(item.workSucc),
          workFail: HsLib.addNumberComma(item.workFail),
          chksumReq: item.chksumReq,
          workType: item.workType,
          workStep: item.workStep,
        }))}
      />
    </GridItem>
  );
}

ChksumInfo.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ChksumInfo;
