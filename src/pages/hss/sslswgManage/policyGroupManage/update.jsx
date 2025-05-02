import PolicyGroupUpdateStatus from '@components/hss/sslswg/policy/policyGroupStatus/update';

import Layout from '@components/layouts';

function PolicyListUpdate() {
  return <PolicyGroupUpdateStatus />;
}

PolicyListUpdate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyListUpdate;
