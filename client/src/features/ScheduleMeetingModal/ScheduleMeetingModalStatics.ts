export const SCHEDULE_MEETING_MODAL_STATICS = {
  HEADER: {
    title: 'Schedule your Meeting!',
    description: 'Add the details to calendar.',
  },
  FORM: {
    TITLE: {
      id: 'title',
      label: 'Title',
    },
    DESCRIPTION: {
      id: 'description',
      label: 'Description',
    },
    MEETING_DATE: {
      id: 'date',
      label: 'Date',
    },
    MEETING_START_TIME: {
      id: 'start_time',
      label: 'Start Time',
    },
    MEETING_TIME: {
      id: 'end_time',
      label: 'End Time',
    },
    ADD_MEMBER: {
      id: 'add_members',
      label: 'Add Members',
    },
  },
  EMPTY_MEMBER_LIST: {
    placeholderText: 'No members added',
  },
  OVERLAPPING_TIME_ERROR: {
    text: '${startTime} - ${endTime} is overlapping for users (userNames: ${userName List})'
  },
  ACTION_VIEW: {
    CANCEL_CTA: {
      name: 'Cancel',
    },
    SEND_INVITE_CTA: {
      name: 'Send Invite',
    },
  },
};
