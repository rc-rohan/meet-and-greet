import React from 'react';
import { UseEnterpriseDataProvider } from './useEnterpriseData';
import { UseUserDataProvider } from './useUserData';

const CustomDataHooksWrapper = (...wrappers: any) => ({ children } :any) => wrappers.reduceRight(
  (
    rendered:any, Component:any,
  ) => (
    <Component>
      {rendered}
    </Component>
  ), children,
);

export default CustomDataHooksWrapper(
  UseEnterpriseDataProvider,
  UseUserDataProvider,
);
