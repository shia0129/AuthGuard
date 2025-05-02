import common from '@modules/utils/locales/common/en.json';
import components from '@modules/utils/locales/components/en.json';
import user from '@modules/utils/locales/user/en.json';
import monitoring from '@modules/utils/locales/monitoring/en.json';
import system from '@modules/utils/locales/system/en.json';

const en = {
  common,
  components,
  user,
  monitoring,
  system,
};
const prefixNames = Object.keys(en);

const flattenedData = prefixNames.reduce((acc, prefix) => {
  const data = en[prefix];
  const flatData = Object.keys(data).reduce(
    (innerAcc, key) => ({
      ...innerAcc,
      [`${prefix}.${key}`]: data[key],
    }),
    {},
  );

  return {
    ...acc,
    ...flatData,
  };
}, {});

export default flattenedData;
