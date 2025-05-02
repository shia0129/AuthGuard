import Packetcapture from '@components/hss/sslva/policy/packetcapture';
import Layout from '@components/layouts';

function PacketcaptureManager() {
  return (
    <>
      <Packetcapture />
    </>
  );
}

PacketcaptureManager.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PacketcaptureManager;
