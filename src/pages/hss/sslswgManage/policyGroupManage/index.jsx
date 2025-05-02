import PolicyGroupStatus from '@components/hss/sslswg/policy/policyGroupStatus';
import Layout from '@components/layouts';

function PolicyGroupManage() {
  return (
    <>
      <PolicyGroupStatus />
    </>
  );
}

PolicyGroupManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyGroupManage;
