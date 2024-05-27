import { MEETING_REPEAT_INTERVAL } from '../../utils/Enum';

// todo: use the Generics for the MeetingRepeatInterval

export type UserDataType= {
  id?: string,
  name?: string,
  email?: string,
  avatar?: string, // location of the image file hosted on server.
  scheduledMeeting?: MeetingDataType[]
}

export type MeetingDataType= {
  meetingId?: string,
  title?: string,
  description?: string,
  membersList?: string[], // user ID
  date?: string,
  startTime?: string,
  endTime?: string,
  // isRepeating?: boolean,
  // repeatInterval?: MEETING_REPEAT_INTERVAL
}

export type MeetingTimeType = {
  start: Date,
  end: Date,
}

export type OverlappingMeetingType = {
  isOverlapFound: boolean
  overlapTime: MeetingTimeType
}
