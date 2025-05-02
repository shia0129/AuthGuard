import SrcIpGroupUpdate from '@components/hss/sslswg/policy/policyDetailManage/srcIpGroupStatus/update';

import Layout from '@components/layouts';

function SrcIpListUpdate() {
  return <SrcIpGroupUpdate />;
}

SrcIpListUpdate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SrcIpListUpdate;
