import { faker } from '@faker-js/faker';

import { emailList, userList } from './getEnterpriseMockData';

const RANDOM_MINUTES_IN_MILLISECONDS = Math.random() * 120 * 60 * 1000;
const MEETING_START_TIME = faker.date.anytime();
const MEETING_END_TIME = new Date();
MEETING_END_TIME.setTime(MEETING_START_TIME.getTime() + RANDOM_MINUTES_IN_MILLISECONDS);
const SCHEDULED_MEETING_ARRAY_LENGTH = Math.floor(Math.random() * 5); // any number between 0 and 5
const RANDOM_USER = Math.floor(Math.random() * 20);

export const GET_USER_MOCK_DATA = {
  id: userList.find,
  email: userList[RANDOM_USER]?.email,
  name: faker.person.fullName(),
  avatar: faker.internet.avatar(),
  scheduledMeeting: new Array(SCHEDULED_MEETING_ARRAY_LENGTH).fill(null).map(() => (
    {
      meetingId: faker.datatype.uuid(),
      title: faker.lorem.text,
      description: faker.lorem.sentence(1),
      membersList: [...emailList],
      date: faker.date.soon({
        days: 10,
      }),
      startTime: MEETING_START_TIME.toLocaleTimeString(),
      endTime: MEETING_END_TIME.toLocaleTimeString(),
    }
  )),
};
