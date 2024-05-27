import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import axios from 'axios';

import { LOADING_STATUS } from '../../utils/Enum';
import { UserDataType } from '../Types/CommonTypes';
import { API_URLS, MOCK_DATA } from '../services/apiUrls';
import { useMockData } from './useMockData';
import { isLoading, isLoadingOrNotStarted } from '../utils/CommonUtils';
import { FullPageLoader } from '../components/FullPageLoader/FullPageLoader';

type Props = {
  children: React.ReactNode,
};

interface UseUserDataType {
  // LOADING STATUS
  userDataLoadingStatus?: LOADING_STATUS,
  // DATA
  userData?: UserDataType,
  // FUNCTIONS
  getUserData?: (userEmail: string) => void,
}

const UserDataContext = createContext<UseUserDataType>({
  // LOADING STATUS
  userDataLoadingStatus: LOADING_STATUS.NOT_YET_STARTED,
  // DATA
  userData: {},
  // FUNCTIONS
  getUserData: () => {},
});

const useUserData = () => useContext(UserDataContext);

const UseUserDataProvider = ({ children }: Props) => {
  const { addMockData } = useMockData();

  const [isMockDataAdded, setIsMockDataAdded] = useState(LOADING_STATUS.NOT_YET_STARTED);
  const [userDataLoadingStatus, setUserDataLoadingStatus] = useState<LOADING_STATUS>(LOADING_STATUS.NOT_YET_STARTED);
  const [userData, setUserData] = useState<UserDataType>({});

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

  const getUserData = useCallback(
    (userId: string) => {
      if (isLoading(userDataLoadingStatus)) {
        return;
      }
      setUserDataLoadingStatus(LOADING_STATUS.LOADING);
      axios.get(
        API_URLS.GET_USER_DATA, {
          params: {
            id: userId,
          },
        },
      )
        .then((userDataResponse:any) => {
          console.log(
            'userData', userDataResponse,
          );
          setUserData(() => ({
            ...userDataResponse.data,
          } || {}));
          setUserDataLoadingStatus(LOADING_STATUS.COMPLETED);
        })
        .catch((e) => {
          console.error(
            `Error in fetching user data for the user ${userId}: throwing error: `, JSON.stringify(e),
          );
          setUserDataLoadingStatus(LOADING_STATUS.FAILED);
        });
    },
    [userDataLoadingStatus],
  );

  const contextValues = useMemo(
    () => ({
      userDataLoadingStatus,
      userData,
      getUserData,
    }), [
      getUserData,
      userDataLoadingStatus,
      userData,
    ],
  );

  if (isLoadingOrNotStarted(isMockDataAdded)) {
    return <FullPageLoader />;
  }

  return (
    <UserDataContext.Provider value={contextValues}>
      {children}
    </UserDataContext.Provider>
  );
};

export {
  UseUserDataProvider,
  useUserData,
};
