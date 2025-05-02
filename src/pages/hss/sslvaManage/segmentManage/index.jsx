import SegmentStatus from '@components/hss/sslva/policy/segmentStatus';
import Layout from '@components/layouts';

function SegmentManage() {
  return (
    <>
      <SegmentStatus />
    </>
  );
}

SegmentManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SegmentManage;
