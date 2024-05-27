/* This hook will handle  the scoket connection creation and initiation of the meeting */
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { io } from 'socket.io-client';

import axios, { AxiosResponse } from 'axios';
import { LOADING_STATUS } from '../../utils/Enum';
import { API_URLS } from '../services/apiUrls';
import { MeetingDataType } from '../Types/CommonTypes';
import { isLoadingOrCompletedOrFailed } from '../utils/CommonUtils';

type Props = {
  children: React.ReactNode
}

interface UseMeetType {
  // LOADING_STATUS
  connectionLoadingStatus?: LOADING_STATUS,
  meetingDataLoadingStatus?: LOADING_STATUS,
  // DATA
  meetingData?: MeetingDataType,
  // FUNCTIONS
  createSocketConnection?: () => void, // this function won't be required
  getMeetingData?: (meetingId: string) => void,
}

const UseMeetContext = createContext<UseMeetType>({
  // LOADING_STATUS
  connectionLoadingStatus: LOADING_STATUS.NOT_YET_STARTED,
  meetingDataLoadingStatus: LOADING_STATUS.NOT_YET_STARTED,
  // DATA
  meetingData: {},
  // FUNCTIONS
  createSocketConnection: () => {},
  getMeetingData: () => {},
});

const useMeet = () => useContext(UseMeetContext);

/* Check if the useExternalSyncStore can be used here */
const UseMeetProvider = ({ children }: Props) => {
  const [connectionLoadingStatus, setConnectionLoadingStatus] = useState<LOADING_STATUS>(LOADING_STATUS.NOT_YET_STARTED);
  const [meetingDataLoadingStatus, setMeetingDataLoadingStatus] = useState<LOADING_STATUS>(LOADING_STATUS.NOT_YET_STARTED);
  const [meetingData, setMeetingData] = useState({});

  // make the connection based upon the page loading only.
  useEffect(
    () => {
      const socket = io('http://localhost:8000');

      // socket.emit('echo');
      // client-side
      socket.on(
        'connect', () => {
          console.log(
            'Socket connection established', socket,
          ); // x8WIv7-mJelg7on_ALbx
        },
      );

      socket.on(
        'disconnect', () => {
          console.log(
            'upon disconnections', socket.id,
          ); // undefined
        },
      );
    }, [],
  );

  const getMeetingData = useCallback(
    (meetingId: string) => {
      if (isLoadingOrCompletedOrFailed(meetingDataLoadingStatus)) {
        return;
      }

      setMeetingDataLoadingStatus(LOADING_STATUS.LOADING);

      axios.get<MeetingDataType>(
        API_URLS.GET_MEETING_DATA,
        {
          params: {
            meetingId,
          },
        },
      )
        .then((response:AxiosResponse) => {
          console.log(
            'Fetched Meeting Response: ', response,
          );

          setMeetingData(response.data);
          setMeetingDataLoadingStatus(LOADING_STATUS.COMPLETED);
        })
        .catch((error) => {
          console.log(
            `Error in fetching meeting data: Meeting ID: ${meetingId}: Error: `, error,
          );

          setMeetingDataLoadingStatus(LOADING_STATUS.FAILED);
        });
    },
    [meetingDataLoadingStatus],
  );

  const createSocketConnection = useCallback(
    () => {

    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      connectionLoadingStatus,
      meetingData,
      createSocketConnection,
      getMeetingData,
    }), [
      connectionLoadingStatus,
      meetingData,
      createSocketConnection,
      getMeetingData,
    ],
  );

  return (
    <UseMeetContext.Provider value={contextValue}>
      {children}
    </UseMeetContext.Provider>
  );
};

export {
  UseMeetProvider,
  useMeet,
};
