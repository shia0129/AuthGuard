import PolicyDetailStatus from '@components/hss/sslva/policy/policyDetailStatus';
import Layout from '@components/layouts';

function PolicyManage() {
  return (
    <>
      <PolicyDetailStatus />
    </>
  );
}

PolicyManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyManage;
