import CertStatus from '@components/hss/sslva/policy/certStatus';
import Layout from '@components/layouts';

function CertManage() {
  return (
    <>
      <CertStatus />
    </>
  );
}

CertManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default CertManage;
