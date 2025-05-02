import ProtocolStatus from '@components/hss/sslva/policy/protocolStatus';
import Layout from '@components/layouts';

function ProtocolManage() {
  return (
    <>
      <ProtocolStatus />
    </>
  );
}

ProtocolManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProtocolManage;
