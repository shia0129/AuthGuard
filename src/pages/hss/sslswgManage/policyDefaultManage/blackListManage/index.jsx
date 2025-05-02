import BlackListGroupStatus from '@components/hss/sslswg/policy/policyDefaultManage/blackListGroupStatus';
import Layout from '@components/layouts';

function BlackListManage() {
  return (
    <>
      <BlackListGroupStatus />
    </>
  );
}

BlackListManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BlackListManage;
