import React, { useEffect } from 'react';

import './video-chat-page.scss';
import {
  Avatar, AvatarGroup, Typography,
} from '@mui/material';
import { TYPOGRAPHY_VARIANT } from '../../../utils/Enum';
import { useMeet } from '../../hooks/useMeet';
import { isLoadingOrNotStarted } from '../../utils/CommonUtils';
import { FullPageLoader } from '../../components/FullPageLoader/FullPageLoader';

const styles = {
  container: '',
};

/*
*  This File renders when new meeting starts and loads up the other components required.
*
*/

// GET THE MEMBER LIST PRESENT IN THE MEETING
// SHOW THE MEMBER WITH THE VIDEO CARD IF THE VIDEO OF THE MEMBER IS OPEN
// AUTO ADJUST THE SIZE OF THE VIDEO FOR ANY MEMBER PRESENT IN THE MEETING
// @FUTURE: DON'T SHOW IF MANY MEMBER ARE PRESENT SHOW ONLY THE MEMBERS JOINED AND LIST OF MEMBER SPEAKING AT ATOP LEVEL

// IF THE VIDEO IS NOT OPEN SHOW JUST THE NAME CARD ALONG

// AT BOTTOM GIVE THE OPTIONS FOR SETTINGS AND MUTE/UNMUTE AND ON/OFF VIDEO

// IN THE SIDEBAR SHOW THT MESSAGE AND WITH NOTIFICATION SOUND FOR ALL OTHER USERS.
// IF THE SIDE BAR IS CLOSED SHOW THE MESSAGE IN THE SIDE POPPER VIEW.
// SHOW THE TAB NAVIGATION FOR THE LIST OF USERS PRESENT IN THE MEETING AND LIST OF USER NOT JOINED AND NOTIFY OPTION
const VideoChatPage = () => {
  const {
    meetingDataLoadingStatus,
    getMeetingData,
    meetingData,
  } = useMeet();

  useEffect(
    () => {
    // fetch the meetingID from the query params
      getMeetingData?.();
    }, [],
  );

  const getSidebarView = () => (
    <div />
  );

  // renders the title of the meeting at the top
  const getMeetingTitleView = () => (
    <Typography
      variant={TYPOGRAPHY_VARIANT.H3}
      className={styles.header.title}
    >
      {meetingData?.title}
    </Typography>
  );

  // get the view designs based upon the list
  const getUserCards = (user) => (
    <div className={styles.userCard.container}>
      <Avatar
        src={user.image}
        alt={user.name}
        className={styles.userCard.avatar}
      />
    </div>
  );

  const getMultiUserCardView = (user) => (
    <div>
      <AvatarGroup max={2}>
        <Avatar
          src={user.image}
          alt={user.name}
        />
      </AvatarGroup>
    </div>
  );

  // show only the users present in the meeting.
  // todo map the first 9 user and then for multiple users show the multi user card.
  const getUserAvatarView = () => (
    <div className={styles.userAvatar.container}>
      {userList.map(getUserCards)}

    </div>
  );

  // middle section of the view that handle the meeting video cards and name cards.
  const getMeetingMiddleVideoSectionView = () => (
    <div className={styles.midSection.container}>
      {getUserAvatarView()}
      {getUserVideoView()}
    </div>
  );

  const getScreenShareView = () => (
    <div />
  );

  // Action View for showing meeting controlling options like end meeting,, mute and unmute options and othre optins required
  const getMeetingActionView = () => (
    <div />
  );

  // todo check this error for the loading status/
  if (isLoadingOrNotStarted(meetingDataLoadingStatus)) {
    return <FullPageLoader />;
  }

  return (
    <div className={styles.container}>
      {getMeetingTitleView()}
      {getMeetingMiddleVideoSectionView()}
      {getMeetingActionView()}
      {getSidebarView()}
    </div>
  );
};

export { VideoChatPage };
