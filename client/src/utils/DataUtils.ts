import {
  MeetingDataType, OverlappingMeetingType, UserDataType,
} from '../Types/CommonTypes';
import { isNullOrEmpty, isValidDateTime } from './CommonUtils';

/*
*  1. Checks if there is any overlapping time
*  2. Get the common free time for all the users based upon the duration of the meeting.
*  3. If no free time is not found for the duration then send the message to reduce the duration.
*
*  Optimize:
* 1. In case on member addition only single member is added so no need to re-run through entire list.
* 2. On removal of the member also it is running through entire list.
*/
export const checkForOverlappingTime = (
  meetingMembersList: string[] = [],
  meetingStartTime: string = '',
  meetingEndTime: string = '',
  allMembersData: Record<string, UserDataType> = {},
) : OverlappingMeetingType => {
  let isOverlapFound = false;
  let overlapStartDateObj = new Date(meetingStartTime);
  let overlapEndDateObj = new Date(meetingEndTime);

  if (
    isNullOrEmpty(allMembersData)
    || isNullOrEmpty(meetingMembersList)
    || !isValidDateTime(overlapStartDateObj)
    || !isValidDateTime(overlapEndDateObj)
  ) {
    return {
      isOverlapFound,
      overlapTime: {
        start: overlapStartDateObj,
        end: overlapEndDateObj,
      },
    };
  }

  meetingMembersList?.forEach((currentMemberId: string) => {
    const { scheduledMeeting } = allMembersData[currentMemberId]; // function fails here beacuse of the mock data.

    if (!isNullOrEmpty(scheduledMeeting)) {
      scheduledMeeting?.forEach((meetingData: MeetingDataType) => {
        const scheduledMeetingStartDateObj = new Date(meetingData.startTime as string);
        const scheduledMeetingEndDateObj = new Date(meetingData.endTime as string);

        // case 1: current start  < scheduled  start and current end < scheduled end
        // case 2: current start < scheduled start and current end > scheduled end
        if (
          (scheduledMeetingStartDateObj < overlapStartDateObj)
          && (scheduledMeetingEndDateObj > overlapStartDateObj)
        ) {
          isOverlapFound = true;
          overlapEndDateObj = (overlapEndDateObj > scheduledMeetingEndDateObj) ? overlapEndDateObj : scheduledMeetingEndDateObj;
        }

        // case 3:  current start > scheduled start and current end < scheduled end
        // case 4: current start > scheduled start and current end > scheduled end
        if (
          (scheduledMeetingStartDateObj > overlapStartDateObj)
          && (scheduledMeetingStartDateObj < overlapEndDateObj)
        ) {
          isOverlapFound = true;
          overlapStartDateObj = (overlapStartDateObj < scheduledMeetingStartDateObj) ? overlapStartDateObj : scheduledMeetingStartDateObj;
        }
      });
    }
  });

  return {
    isOverlapFound,
    overlapTime: {
      start: overlapStartDateObj,
      end: overlapEndDateObj,
    },
  };
};
