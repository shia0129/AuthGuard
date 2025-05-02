import BlackListStatus from '@components/hss/sslswg/policy/policyDefaultManage/blackListStatus';
import Layout from '@components/layouts';

function BlackListUpdate() {
  return (
    <>
      <BlackListStatus />
    </>
  );
}

BlackListUpdate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BlackListUpdate;
