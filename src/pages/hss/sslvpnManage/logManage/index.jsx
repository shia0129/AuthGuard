import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
function LogManage() {
  // JSX
  return <GridItem spacing={2} container direction="column" />;
}

LogManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default LogManage;
