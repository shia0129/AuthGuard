import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';

// Project import
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import MainCard from '@components/mantis/MainCard';
import useInput from '@modules/hooks/useInput';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import permissionApi from '@api/system/permissionApi';
import menuApi from '@api/system/menuApi';
import { AuthInstance } from '@modules/axios';
import Label from '@components/modules/label/Label';
import transferUserApi from '@api/transfer/transferUserApi';

function TransferUserInfo({ value, index }) {
  const { instance, source } = AuthInstance();

  transferUserApi.axios;

  const router = useRouter();

  // 검색조건 파라미터.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({});

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: transferUserApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  return (
    <GridItem hidden={index != value}>
      <GridItem container sx={{ px: 2, pt: 3 }} spacing={2}>
        <GridItem item>
          <GridItem
            container
            direction="row"
            divideColumn={1}
            borderFlag
            sx={{
              '& .labelText': { maxWidth: '125px', minWidth: '125px' },
              '& .inputText': { maxWidth: '150px', minWidth: '150px' },
              '& .inputText.text': { maxWidth: '130px', minWidth: '130px' },
            }}
          >
            <Label labelBackgroundFlag label="사용자 정보" name="userInfo">
              <GridItem container item divideColumn={3} spacing={1} py={1}>
                <LabelInput required label="사용자ID" name="userId" fullWidth />
                <LabelInput required label="사용자명" name="userName" fullWidth />
                <LabelInput required label="부서명" name="deptName" fullWidth />
                <LabelInput required label="사용자 직위" name="userRank" fullWidth />
                <LabelInput label="사용자 직책" name="userPosition" fullWidth />
                <LabelInput label="원본 유저코드" name="originalUserCode" fullWidth />
              </GridItem>
            </Label>
            <Label labelBackgroundFlag label="비밀번호" name="userInfo">
              <GridItem container item divideColumn={3} spacing={1}>
                <LabelInput required label="비밀번호" name="userId" fullWidth />
                <LabelInput required label="비밀번호 확인" name="userName" fullWidth />
              </GridItem>
            </Label>
            <Label labelBackgroundFlag label="사용자 상태" name="userInfo">
              <GridItem container item divideColumn={3} spacing={1}>
                <LabelInput
                  required
                  sx={{ maxWidth: 150 }}
                  type="select"
                  label="사용 상태"
                  name="useState"
                  disabledefault="true"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                />
                <LabelInput
                  required
                  sx={{ maxWidth: 150 }}
                  type="select"
                  label="사용 구분"
                  name="useState"
                  disabledefault="true"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                />
                <LabelInput required label="계정 만료일" name="userName" fullWidth />
              </GridItem>
            </Label>
            <Label labelBackgroundFlag label="결재 정보" name="userInfo">
              <GridItem container item divideColumn={3} spacing={1} py={1}>
                <LabelInput
                  required
                  sx={{ maxWidth: 150 }}
                  type="select"
                  label="팀장 구분"
                  name="useState"
                  disabledefault="true"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                  // value={parameters.userPermissionId}
                  // onChange={changeParameters}
                />
                <LabelInput
                  required
                  sx={{ maxWidth: 150 }}
                  type="select"
                  label="정보보안 구분"
                  name="useState"
                  disabledefault="true"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                  // value={parameters.userPermissionId}
                  // onChange={changeParameters}
                />
                <></>
                <LabelInput
                  required
                  sx={{ maxWidth: 150 }}
                  type="select"
                  label="결재 권한"
                  name="useState"
                  disabledefault="true"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                  // value={parameters.userPermissionId}
                  // onChange={changeParameters}
                />
              </GridItem>
            </Label>
            <Label labelBackgroundFlag label="인사연동 정보" name="userInfo">
              <GridItem container item divideColumn={3} spacing={1}>
                <LabelInput
                  required
                  sx={{ maxWidth: 150 }}
                  type="select"
                  label="인사 동기화"
                  name="useState"
                  disabledefault="true"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                  // value={parameters.userPermissionId}
                  // onChange={changeParameters}
                />
                <LabelInput
                  required
                  sx={{ maxWidth: 150 }}
                  type="select"
                  label="인증 방식"
                  name="useState"
                  disabledefault="true"
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                  // value={parameters.userPermissionId}
                  // onChange={changeParameters}
                />
              </GridItem>
            </Label>
            <Label labelBackgroundFlag label="연락처" name="userInfo">
              <GridItem container item divideColumn={3} spacing={1}>
                <LabelInput label="이메일" name="email" fullWidth />
                <LabelInput label="전화번호" name="tel" fullWidth />
                <LabelInput label="휴대전화" name="cellphone" fullWidth />
              </GridItem>
            </Label>
            <LabelInput
              labelBackgroundFlag
              label="비고"
              name="userInfo"
              sx={{
                minWidth: 'calc(100% - 100px) !important',
                maxWidth: 'calc(100% - 50px) !important',
              }}
              fullWidth
            />
          </GridItem>
        </GridItem>
      </GridItem>
    </GridItem>
  );
}

export default TransferUserInfo;
