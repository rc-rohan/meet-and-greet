import React from 'react';

import { CircularProgress } from '@mui/material';

import './full-page-loader.scss';

const styles = {
  container: 'mng__full-page-loader__container',
  icon: 'mng__full-page-loader__icon',
};

const FullPageLoader = () => (
  <div className={styles.container}>
    <CircularProgress />
  </div>
);

export { FullPageLoader };
