// THIS HOOK WILL BE REQUIRED FOR MORE USERS ON ADVANCE LEVEL.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';

import { LOADING_STATUS } from '../../utils/Enum';
import { API_URLS, MOCK_DATA } from '../services/apiUrls';
import { isLoadingOrCompletedOrFailed, isLoadingOrNotStarted } from '../utils/CommonUtils';
import { useMockData } from './useMockData';
import { FullPageLoader } from '../components/FullPageLoader/FullPageLoader';

type Props = {
  children: React.ReactNode,
}

export type EnterpriseDataType = {
  id?: string,
  logo?: string,
  companyName?: string,
  companyDescription?: string,
}

export type EnterpriseUserListType = {
  id?: string,
  name?: string,
  email?: string,
}

interface UseEnterpriseDataType {
  // LOADING STATUS
  enterpriseDataLoadingStatus?: LOADING_STATUS,
  enterpriseUserListLoadingStatus?: LOADING_STATUS,
  // DATA
  enterpriseData?: EnterpriseDataType,
  enterpriseUserList?: EnterpriseUserListType[],
  // FUNCTIONS
  getEnterpriseData: () => void,
  getEnterpriseUserList: () => void,
}

const UseEnterpriseDataContext = createContext<UseEnterpriseDataType>({
  // LOADING STATUS
  enterpriseDataLoadingStatus: LOADING_STATUS.NOT_YET_STARTED,
  enterpriseUserListLoadingStatus: LOADING_STATUS.NOT_YET_STARTED,
  // DATA
  enterpriseData: {},
  enterpriseUserList: [],
  // FUNCTIONS
  getEnterpriseData: () => {},
  getEnterpriseUserList: () => {},
});

const useEnterpriseData = () => useContext(UseEnterpriseDataContext);

const UseEnterpriseDataProvider = ({ children }: Props) => {
  const { addMockData } = useMockData();

  const [isMockDataAdded, setIsMockDataAdded] = useState(LOADING_STATUS.NOT_YET_STARTED);

  const [enterpriseLoadingStatus, setEnterpriseLoadingStatus] = useState<LOADING_STATUS>(LOADING_STATUS.NOT_YET_STARTED);
  const [enterpriseUserListLoadingStatus, setEnterpriseUserListLoadingStatus] = useState<LOADING_STATUS>(LOADING_STATUS.NOT_YET_STARTED);
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseDataType>({});
  const [enterpriseUserList, setEnterpriseUserList] = useState<EnterpriseUserListType[]>([]);

  useEffect(
    () => {
      addMockData(MOCK_DATA);
      setTimeout(
        () => {
          setIsMockDataAdded(LOADING_STATUS.COMPLETED);
        }, 1000,
      );
    }, [addMockData],
  );

  // GET ENTERPRISE LEVEL DATA
  const getEnterpriseData = useCallback(
    () => {
      axios.get('https://catfact.ninja/fact')
        .then((response: any) => {
          console.log(
            'Actual response data from response function', response,
          );
          // setEnterpriseData(response);
        })
        .catch((error) => {
          console.log(
            'Error from getEnterprise func.', error,
          );
        });
    },
    [],
  );

  // GET USERS EMAILS PRESENT IN THE ENTERPRISE
  const getEnterpriseUserList = useCallback(
    () => {
      if (isLoadingOrCompletedOrFailed(enterpriseUserListLoadingStatus)) {
        return;
      }
      setEnterpriseUserListLoadingStatus(LOADING_STATUS.LOADING);
      axios.get(API_URLS.GET_ENTERPRISE_USER_LIST)
        .then((response:any) => {
          setEnterpriseUserList(response.data);
          setEnterpriseUserListLoadingStatus(LOADING_STATUS.COMPLETED);
        })
        .catch((error) => {
          console.log(
            'Error in fetching the userList data', error,
          );
          setEnterpriseUserListLoadingStatus(LOADING_STATUS.FAILED);
        });
    },
    [enterpriseUserListLoadingStatus],
  );

  const contextValue = useMemo(
    () => ({
      enterpriseLoadingStatus,
      enterpriseUserListLoadingStatus,

      enterpriseData,
      enterpriseUserList,

      getEnterpriseData,
      getEnterpriseUserList,
    }), [
      enterpriseLoadingStatus,
      enterpriseUserListLoadingStatus,

      enterpriseData,
      enterpriseUserList,

      getEnterpriseData,
      getEnterpriseUserList,
    ],
  );

  if (isLoadingOrNotStarted(isMockDataAdded)) {
    return (
      <FullPageLoader />
    );
  }

  return (
    <UseEnterpriseDataContext.Provider value={contextValue}>
      {children}
    </UseEnterpriseDataContext.Provider>
  );
};

export {
  useEnterpriseData,
  UseEnterpriseDataProvider,
};
