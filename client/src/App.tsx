import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { RootNavigator } from './routes/RootNavigator';
import { MOCK_DATA } from './services/apiUrls';
import { UseMockDataProvider } from './hooks/useMockData';

import './app.scss';
import CustomDataHooksWrapper from './hooks/CustomDataHooksWrapper';
import { UseMeetProvider } from './hooks/useMeet';

const styles = {
  container: 'meet-and-greet__app__container',
};

const App = () => {
  const [mockData, setMockData] = useState<Record<string, any>>({});

  useEffect(
    () => {
      setMockData(MOCK_DATA);
    }, [],
  );

  return (
    <div className={styles.container}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UseMeetProvider>
              <UseMockDataProvider mockData={mockData}>
                <CustomDataHooksWrapper>
                  <RootNavigator />
                </CustomDataHooksWrapper>
              </UseMockDataProvider>
            </UseMeetProvider>
          </LocalizationProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </div>
  );
};

export { App };
