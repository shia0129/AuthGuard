import PatternGroupUpdate from '@components/hss/sslswg/policy/policyDetailManage/patternGroupStatus/update';

import Layout from '@components/layouts';

function PatternListUpdate() {
  return <PatternGroupUpdate />;
}

PatternListUpdate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PatternListUpdate;
