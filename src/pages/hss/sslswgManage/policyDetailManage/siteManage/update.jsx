import SiteGroupUpdate from '@components/hss/sslswg/policy/policyDetailManage/siteGroupStatus/update';

import Layout from '@components/layouts';

function SiteListUpdate() {
  return <SiteGroupUpdate />;
}

SiteListUpdate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SiteListUpdate;
