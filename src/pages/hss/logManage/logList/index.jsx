import SystemLogList from '@components/hss/common/logManage';
import Layout from '@components/layouts';

function LogList() {
  return (
    <>
      <SystemLogList />
    </>
  );
}

LogList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default LogList;
