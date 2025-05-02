import AccessRequestStatus from '@components/hss/sslswg/policy/accessRequestStatus';
import Layout from '@components/layouts';

function AccessRequestManage() {
  return <AccessRequestStatus />;
}

AccessRequestManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AccessRequestManage;
