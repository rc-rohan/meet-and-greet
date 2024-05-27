import React, { useEffect } from 'react';
import {
  Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';

import { ROUTES } from './Routes';
import { LandingPage } from '../features/LandingPage/LandingPage';
import { ErrorPage } from '../features/ErrorPage/ErrorPage';
import { useEnterpriseData } from '../hooks/useEnterpriseData';

import './root-navigator.scss';

const styles = {
  container: 'mng__root-navigator__container',
  loader: {
    container: 'mng__root-navigator__loader-container',
    icon: 'mng__root-navigator__loader-icon',
  },

};

const RootNavigator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getEnterpriseData } = useEnterpriseData();

  useEffect(
    () => {
      if (location.pathname === '/') {
        navigate(
          ROUTES.LANDING_PAGE.path, {
            replace: true,
          },
        );
      }
    }, [location.pathname, navigate],
  );

  // useEffect(
  //   () => {
  //     getEnterpriseData?.();
  //   }, [getEnterpriseData],
  // );

  return (
    <div className={styles.container}>
      <Routes>
        <Route
          path={ROUTES.LANDING_PAGE.path}
          element={<LandingPage />}
        />
        <Route
          path={ROUTES.ERROR_PAGE.path}
          element={<ErrorPage />}
        />
      </Routes>
    </div>
  );
};
export { RootNavigator };
