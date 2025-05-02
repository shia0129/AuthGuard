import SWGLogList from '@components/hss/sslswg/log';
import Layout from '@components/layouts';

function LogList() {
  return (
    <>
      <SWGLogList />
    </>
  );
}

LogList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default LogList;
