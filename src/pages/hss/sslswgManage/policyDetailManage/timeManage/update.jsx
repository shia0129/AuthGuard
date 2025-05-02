import TimeGroupUpdate from '@components/hss/sslswg/policy/policyDetailManage/timeGroupStatus/update';

import Layout from '@components/layouts';

function TimeListUpdate() {
  return <TimeGroupUpdate />;
}

TimeListUpdate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default TimeListUpdate;
