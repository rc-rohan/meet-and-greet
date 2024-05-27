import { GET_USER_MOCK_DATA } from './mock-data/getUserMockData';
import { GET_ENTERPRISE_USERS_MOCK_DATA } from './mock-data/getEnterpriseMockData';

export const API_URLS = {
  GET_USER_DATA: '/api/get-user-data',
  GET_ENTERPRISE_DATA: '/api/get-enterprise-data',
  GET_ENTERPRISE_USER_LIST: '/api/get-enterprise-user-list',

  GET_MEETING_DATA: '/api/get-meeting-data',
};

export const MOCK_DATA = {
  [API_URLS.GET_USER_DATA]: GET_USER_MOCK_DATA,
  [API_URLS.GET_ENTERPRISE_USER_LIST]: GET_ENTERPRISE_USERS_MOCK_DATA,
  [API_URLS.GET_MEETING_DATA]: GET_USER_MOCK_DATA,
};
