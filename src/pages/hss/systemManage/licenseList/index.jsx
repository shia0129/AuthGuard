import _ from 'lodash';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import useApi from '@modules/hooks/useApi';
import licenseApi from '@api/hss/common/systemManage/licenseApi';
import { AuthInstance } from '@modules/axios';
import { useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import LicenseFileUpload from '@components/hss/licenseUpload/licenseFileUpload';
import LicenseUploadActionButton from '@components/hss/licenseUpload/licenseUploadActionButton';
import LicenseUploadResult from '@components/hss/licenseUpload/licenseUploadResult';

function LicenseList() {
  const [apiCall] = useApi();
  const { instance } = AuthInstance();

  licenseApi.axios = instance;

  const [fileList, setFileList] = useState([]);

  const [isVerify, setIsVerify] = useState(false);

  useEffect(() => {}, []);

  const handleClickUploadButton = async () => {
    const result = await apiCall(licenseApi.insertLicenseData, fileList);
    if (result) {
      unstable_batchedUpdates(() => {
        setIsVerify(true);
      });
    }
  };

  return (
    <GridItem container direction="column" spacing={1} sx={{ mt: 2 }}>
      <LicenseFileUpload onChangeFileList={setFileList} />
      <LicenseUploadActionButton onUploadButtonClick={handleClickUploadButton} />
      <LicenseUploadResult titleFlag={isVerify} />
    </GridItem>
  );
}

LicenseList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default LicenseList;
