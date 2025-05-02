import VALogList from '@components/hss/sslva/log';
import Layout from '@components/layouts';

function LogList() {
  return (
    <>
      <VALogList />
    </>
  );
}

LogList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default LogList;
