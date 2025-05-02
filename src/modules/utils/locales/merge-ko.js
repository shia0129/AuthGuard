import common from '@modules/utils/locales/common/ko.json';
import components from '@modules/utils/locales/components/ko.json';
import user from '@modules/utils/locales/user/ko.json';
import monitoring from '@modules/utils/locales/monitoring/ko.json';
import system from '@modules/utils/locales/system/ko.json';

const ko = {
  common,
  components,
  user,
  monitoring,
  system,
};
const prefixNames = Object.keys(ko);

const flattenedData = prefixNames.reduce((acc, prefix) => {
  const data = ko[prefix];
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
