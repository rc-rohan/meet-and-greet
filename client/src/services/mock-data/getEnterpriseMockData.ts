import { faker } from '@faker-js/faker';

export const emailList: string[] = new Array(20).fill(null).map(() => (faker.internet.email()));

export const userList = new Array(20).fill(null).map((
  el, index: number,
) => ({
  id: faker.datatype.uuid(),
  name: faker.person.fullName(),
  email: emailList[index],
}));

export const GET_ENTERPRISE_USERS_MOCK_DATA = [
  ...userList,
];
