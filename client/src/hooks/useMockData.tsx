import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import queryString from 'query-string';
import axios, { AxiosRequestConfig } from 'axios';

import { ENVIRONMENT_TYPE, LOADING_STATUS } from '../../utils/Enum';
import { MOCK_DATA } from '../services/apiUrls';

type Props = {
  children: React.ReactNode;
  mockData: Record<string, any>,
}

interface UseMockDataType {
  loadingStatus: LOADING_STATUS,

  isMocked: boolean,

  mockData: any,

  addMockData: (newMockData: Record<string, any>) => void,
}

const MockDataContext = createContext<UseMockDataType>({
  isMocked: false,
  loadingStatus: LOADING_STATUS.NOT_YET_STARTED,
  addMockData: () => {},
  mockData: {},
});

export const api = axios.create({});

const useMockData = () => useContext(MockDataContext);

const UseMockDataProvider = (props : Props) => {
  const { children, mockData: mockDataProps } = props;

  const [mockData, setMockData] = useState<Record<string, any>>({});
  const [isMocked, setIsMocked] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<LOADING_STATUS>(LOADING_STATUS.NOT_YET_STARTED);
  const [environment, setEnvironment] = useState<ENVIRONMENT_TYPE>(ENVIRONMENT_TYPE.LOCAL);

  // TO CHECK ON EVERY LOAD IF ISMOCKED IS PRESENT IN THE QUERY PARAM
  useEffect(
    () => {
      const { url, query } = queryString.parseUrl(window.location.search);
      if (query?.isMocked) {
        setIsMocked(true);
      } else {
        setIsMocked(false);
      }
      // SET THE ENVIRONMENT TYPE ALSO AS PER USE CASE
    }, [isMocked],
  );

  // LOADING THE MOCK DATA UPON EVERY CHANGE OF THE PROPS FOR MOCK DATA
  useEffect(
    () => {
      setMockData((prevState: Record<string, any>) => ({
        ...prevState,
        ...mockDataProps,
      }));
    }, [mockDataProps],
  );

  // ADD MOCK DATA FROM THE EXTERNAL HOOK
  const addMockData = useCallback(
    (newMockData: Record<string, any>) => {
      if (!isMocked) {
        return;
      }
      setMockData((prevState: Record<string, any>) => ({
        ...prevState, ...newMockData,
      }));
    },
    [isMocked],
  );

  // CHECK IF URL MOCK DATA IS PRESENT OR NOT
  const isUrlMocked = useCallback(
    (url: string) => url in MOCK_DATA,
    [],
  );

  // CHECK IF MOCK DATA IS PRESENT IN ERROR OBJECT
  const isMockError = useCallback(
    (error: any) => Boolean((error.mockDataResponse)),
    [],
  );

  // todo add the type for the promise
  const onRequestInterceptorFullFillment = useCallback(
    (config: any) : Promise<any> => new Promise((
      resolve, reject,
    ) => {
      if (isMocked && isUrlMocked(config.url as string)) {
        // URL IS MOCKED REJECT THE PROMISE
        console.log(
          'Mocking URL: ', config.url,
        );
        const mockError = new Error();

        // REJECTING AS ERROR TO AVOID ACTUAL CALL TO BACKEND
        reject(Object.assign(
          mockError, {
            config,
            mockDataResponse: MOCK_DATA[config.url],
          },
        ));
        return;
      }
      // URL IS NOT MOCKED
      resolve(config);
    }), [isMocked, isUrlMocked],
  );

  const onRequestInterceptorRejection = useCallback(
    (error: any) : Promise<any> => new Promise((
      resolve, reject,
    ) => {
      // ERROR IN REQUEST INTERCEPTOR
      console.log(
        'Error from Request Interceptor', error,
      );
      reject(error);
    }),
    [],
  );

  const onResponseInterceptorFullFillment = useCallback(
    (response:any) : Promise<any> => new Promise((
      resolve, reject,
    ) => {
      // ACTUAL RESPONSE
      resolve(response);
    }),
    [],
  );

  const onResponseInterceptorRejection = useCallback(
    (error: any): Promise<any> => new Promise((
      resolve, reject,
    ) => {
      const { config, mockDataResponse } = error;
      // RETURN MOCKED RESPONSE IF MOCKERROR IS PRESENT
      if (isMockError(error)) {
        const mockResponse = {
          data: {},
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          isMocked,
        };

        // RESOLVING PROMISE TO GET THE MOCKED RESULT AT API CALL.
        resolve(Object.assign(
          mockResponse, {
            data: mockDataResponse,
          },
        ));
        return;
      }
      // REJECT THE PROMISE IF ANY ERROR IS FOUND AND MOCKDATA IS NOT PRESENT.
      reject(error);
    }),
    [isMockError, isMocked],
  );

  // ADDED INTERCEPTOR TO USEEFFECT TO AVOID THE SIDE EFFECT AND EFFECT FROM REACT LIFE CYCLE.
  useEffect(
    () => {
      const requestInterceptor = axios.interceptors.request.use(
        onRequestInterceptorFullFillment, onRequestInterceptorRejection,
      );

      const responseInterceptor = axios.interceptors.response.use(
        onResponseInterceptorFullFillment, onResponseInterceptorRejection,
      );

      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }, [
      onRequestInterceptorFullFillment,
      onRequestInterceptorRejection,
      onResponseInterceptorFullFillment,
      onResponseInterceptorRejection,
    ],
  );

  const contextValue = useMemo(
    () => ({
      isMocked,

      loadingStatus,

      mockData,

      addMockData,
    }), [
      isMocked,

      loadingStatus,

      mockData,

      addMockData,
    ],
  );

  return (
    <MockDataContext.Provider value={contextValue}>
      {children}
    </MockDataContext.Provider>
  );
};

export {
  useMockData,
  UseMockDataProvider,
};
