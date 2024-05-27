import React, {
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
  useEffect,
} from 'react';
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { DatePicker, TimeField } from '@mui/x-date-pickers';
import stringTemplate from 'string-template';

import {
  BUTTON_VARIANT,
  DROPDOWN_VARIANT,
  SIZE,
  TEXT_FIELD_VARIANT,
  TYPOGRAPHY_VARIANT,
} from '../../../utils/Enum';
import { MeetingDataType, UserDataType } from '../../Types/CommonTypes';
import { SCHEDULE_MEETING_MODAL_STATICS } from './ScheduleMeetingModalStatics';
import { useUserData } from '../../hooks/useUserData';
import { ModalBase } from '../../components/ModalBase/ModalBase';
import {
  EnterpriseUserListType,
  useEnterpriseData,
} from '../../hooks/useEnterpriseData';
import {
  Dropdown,
  DropdownItemType,
} from '../../components/Dropdown/Doropdown';
import { checkForOverlappingTime } from '../../utils/DataUtils';

import './schedule-meeting-modal.scss';
import { isNullOrEmpty } from '../../utils/CommonUtils';

type Props = {
  isOpen: boolean,
  onModalClose: (value: boolean) => void,
}

export type OverlappingTime = {
  start?: string,
  end?: string
}

const styles = {
  container: 'mng__schedule-meeting-modal__container',
  wrapper: 'mng__schedule-meeting-modal__wrapper',
  header: {
    container: 'mng__schedule-meeting-modal__header-container',
    textContentWrapper: 'mng__schedule-meeting-modal__header-text-content-wrapper',
    title: 'mng__schedule-meeting-modal__header-title',
    description: 'mng__schedule-meeting-modal__header-description',
    closeIcon: 'mng__schedule-meeting-modal__header-close-icon',
  },
  form: {
    container: 'mng__schedule-meeting-modal__form-container',
    textField: 'mng__schedule-meeting-modal__form-text-field',
    dropdown: 'mng__schedule-meeting-modal__form-dropdown',
    dateTimePicker: {
      container: 'mng__schedule-meeting-modal__form-date-time-picker-container',
      date: 'mng__schedule-meeting-modal__form-date-time-picker-date',
      time: 'mng__schedule-meeting-modal__form-date-time-picker-time',
    },
  },
  suggestionNote: 'mng__schedule-meeting-modal__member-list-suggestion-note',
  action: {
    container: 'mng__schedule-meeting-modal__action-container',
    cancelCta: 'mng__schedule-meeting-modal__action-cancel-cta',
    sendCta: 'mng__schedule-meeting-modal__action-send-cta',
  },
};

/*
* @Optimize
* - Can we use the useReducer for managing the state for the form data instead of managing it more complex way here
*  */

const ScheduleMeetingModal = (props: Props) => {
  const { isOpen, onModalClose } = props;
  const { getUserData, userData } = useUserData();
  const { getEnterpriseUserList, enterpriseUserList } = useEnterpriseData();

  const [meetingData, setMeetingData] = useState<MeetingDataType>({});
  const [allMembersData, setAllMembersData] = useState<Record<string, UserDataType>>({});
  const [overlappingMemberId, setOverlappingMemberId] = useState<string[]>([]);
  const [overlappingTime, setOverlappingTime] = useState<OverlappingTime>({});

  useEffect(
    () => {
      getEnterpriseUserList?.();
    }, [getEnterpriseUserList],
  );

  // check if this also effects the renderring issue.
  // check if the same useEffect can be used for updating and re running the list of array after removal of any memeber from the array.
  useEffect(
    () => {
      if (!isNullOrEmpty(userData)) {
        setAllMembersData((prevState: Record<string, UserDataType>) => ({
          ...prevState,
          [userData?.id as string]: userData as UserDataType,
        }));
      }
    }, [userData],
  );

  // todo: can we split this function to 2 parts as it has 2 different types of data.
  const isMeetingTimeOverlapping: boolean = useMemo(
    () => {
      const { isOverlapFound, overlapTime } = checkForOverlappingTime(
        meetingData.membersList,
        meetingData.startTime,
        meetingData.endTime,
        allMembersData,
      );

      if (isOverlapFound) {
        setOverlappingTime({
          start: overlapTime.start.toUTCString(),
          end: overlapTime.end?.toUTCString(),
        });
      }
      return isOverlapFound;
    }, [allMembersData, meetingData.endTime, meetingData.membersList, meetingData.startTime],
  );

  // MAPPING THE ENTERPRISE_USER_TYPE TO DROPDOWN_ITEM_TYPE
  const enterpriseMemberList: DropdownItemType[] = useMemo(
    () => (
      enterpriseUserList?.map((currentUser: EnterpriseUserListType) => (
        {
          id: currentUser?.id,
          label: currentUser?.email,
          value: currentUser?.name,
        }
      )) || []
    ), [enterpriseUserList],
  );

  // ON MODAL CLOSE FUNC.
  const onCloseLocal = useCallback(
    () => {
      onModalClose?.(false);
    },
    [onModalClose],
  );

  // // FUNCTION TO HANDLE ALL THE FORM DATA AT ONE PLACE.
  const onInputTextFieldChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setMeetingData((meetData: MeetingDataType) => ({
        ...meetData,
        [event.target.id]: event.target.value,
      }));
    },
    [],
  );

  const onMeetingDateChange = useCallback(
    (selectedDate: string | null) => {
      setMeetingData({
        ...meetingData,
        date: new Date(selectedDate || '').toUTCString(),
      });
    },
    [meetingData],
  );

  const onMeetingStartTimeChange = useCallback(
    (selectedTime: string | null) => {
      const meetingStartTime = new Date(selectedTime || '');
      meetingStartTime.setDate(new Date(meetingData?.date || '').getDate());

      setMeetingData({
        ...meetingData,
        startTime: meetingStartTime.toUTCString(),
      });
    },
    [meetingData],
  );

  const onMeetingEndTimeChange = useCallback(
    (selectedTime: string | null) => {
      const meetingEndTime = new Date(selectedTime || '');
      meetingEndTime.setDate(new Date(meetingData?.date || '').getDate());

      setMeetingData({
        ...meetingData,
        endTime: meetingEndTime.toUTCString(),
      });
    },
    [meetingData],
  );

  const onMemberSelection = useCallback(
    (selectedId: string) => {
      // FETCHING USER DETAILS FOR THE PARTICULAR EMAIL ID
      getUserData?.(selectedId!);

      // ADDING MEMBER TO MEETING LIST
      setMeetingData((prevState: MeetingDataType) => ({
        ...prevState,
        membersList: [...(prevState.membersList || []), selectedId],
      }));
    },
    [getUserData],
  );

  // REMOVE MEMBER FROM INVITE LIST.
  const onRemoveMemberFromInviteList = useCallback(
    (removedItemId: string) => {
      setMeetingData((prevState: MeetingDataType) => ({
        ...prevState,
        membersList: prevState.membersList?.filter((currentId: string) => (currentId !== removedItemId)),
      }));

      if (overlappingMemberId.includes(removedItemId)) {
        setOverlappingMemberId((prevState: string[]) => (
          prevState.filter((currentId) => (currentId !== removedItemId))
        ));
      }

      setAllMembersData((prevState: Record<string, UserDataType>) => {
        const { [removedItemId]: removeMember, ...rest } = prevState;
        return {
          ...rest,
        };
      });
    },
    [overlappingMemberId],
  );

  // SEND INVITE FUNCTION
  const onSendCtaClick = useCallback(
    () => {
      // BEFORE SENDING THE INVITE VERFY THAT THERE IS NO OVERLAP.
      // SEND THE MAIL TO EVERY USER FROM BACKEND FOR THE MEETING.
      // On submit close the modal
      onModalClose?.(false);
    },
    [onModalClose],
  );

  const getHeaderView = () => (
    <div className={styles.header.container}>
      <div className={styles.header.textContentWrapper}>
        <Typography
          variant={TYPOGRAPHY_VARIANT.H3}
          className={styles.header.title}
        >
          {SCHEDULE_MEETING_MODAL_STATICS.HEADER.title}
        </Typography>
        <Typography
          variant={TYPOGRAPHY_VARIANT.H5}
          className={styles.header.description}
        >
          {SCHEDULE_MEETING_MODAL_STATICS.HEADER.description}
        </Typography>
      </div>
      <IconButton onClick={onCloseLocal}>
        <Close
          fontSize={SIZE.LARGE}
          className={styles.header.closeIcon}
        />
      </IconButton>
    </div>
  );

  const getScheduleMeetingFormContent = () => (
    <div className={styles.form.container}>
      <TextField
        id={SCHEDULE_MEETING_MODAL_STATICS.FORM.TITLE.id}
        label={SCHEDULE_MEETING_MODAL_STATICS.FORM.TITLE.label}
        variant={TEXT_FIELD_VARIANT.OUTLINED}
        value={meetingData.title}
        onChange={onInputTextFieldChange}
        className={styles.form.textField}
      />
      <TextField
        id={SCHEDULE_MEETING_MODAL_STATICS.FORM.DESCRIPTION.id}
        label={SCHEDULE_MEETING_MODAL_STATICS.FORM.DESCRIPTION.label}
        variant={TEXT_FIELD_VARIANT.OUTLINED}
        value={meetingData.description}
        onChange={onInputTextFieldChange}
        className={styles.form.textField}
      />
      <div className={styles.form.dateTimePicker.container}>
        <DatePicker
          // id={SCHEDULE_MEETING_MODAL_STATICS.FORM.MEETING_DATE.id}
          disablePast
          label={SCHEDULE_MEETING_MODAL_STATICS.FORM.MEETING_DATE.label}
          value={meetingData.date}
          onChange={onMeetingDateChange}
          className={styles.form.dateTimePicker.date}
        />
        <TimeField
          // id={SCHEDULE_MEETING_MODAL_STATICS.FORM.MEETING_TIME.id}
          label={SCHEDULE_MEETING_MODAL_STATICS.FORM.MEETING_TIME.label}
          value={meetingData.startTime}
          onChange={onMeetingStartTimeChange}
          className={styles.form.dateTimePicker.time}
        />
        <TimeField
          // id={SCHEDULE_MEETING_MODAL_STATICS.FORM.MEETING_TIME.id}
          label={SCHEDULE_MEETING_MODAL_STATICS.FORM.MEETING_TIME.label}
          value={meetingData.endTime}
          onChange={onMeetingEndTimeChange}
          className={styles.form.dateTimePicker.time}
        />
      </div>
      <Dropdown
        id={SCHEDULE_MEETING_MODAL_STATICS.FORM.ADD_MEMBER.id}
        label={SCHEDULE_MEETING_MODAL_STATICS.FORM.ADD_MEMBER.label}
        inputTextFieldType={TEXT_FIELD_VARIANT.OUTLINED}
        variant={DROPDOWN_VARIANT.MULTI_SELECT_DROPDOWN}
        selectedItemIds={meetingData.membersList}
        onRemoveItem={onRemoveMemberFromInviteList}
        onSelect={onMemberSelection}
        dropDownItems={enterpriseMemberList}
        className={styles.form.dropdown}
      />
    </div>
  );

  const getFreeTimeSuggestion = () => (
    <Typography className={styles.suggestionNote}>
      {stringTemplate(
        SCHEDULE_MEETING_MODAL_STATICS.OVERLAPPING_TIME_ERROR.text, {
          startTime: overlappingTime.start,
          endTime: overlappingTime.end,
        },
      )}
    </Typography>
  );

  const getActionView = () => (
    <div className={styles.action.container}>
      <Button
        variant={BUTTON_VARIANT.OUTLINED}
        onClick={onCloseLocal}
        className={styles.action.cancelCta}
      >
        {SCHEDULE_MEETING_MODAL_STATICS.ACTION_VIEW.CANCEL_CTA.name}
      </Button>
      <Button
        onClick={onSendCtaClick}
        variant={BUTTON_VARIANT.CONTAINED}
        className={styles.action.sendCta}
      >
        {SCHEDULE_MEETING_MODAL_STATICS.ACTION_VIEW.SEND_INVITE_CTA.name}
      </Button>
    </div>
  );

  const getModalContent = () => (
    <Paper className={styles.wrapper}>
      {getHeaderView()}
      {getScheduleMeetingFormContent()}
      {isMeetingTimeOverlapping && getFreeTimeSuggestion()}
      {getActionView()}
    </Paper>

  );

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onCloseLocal}
      className={styles.container}
    >
      {getModalContent()}
    </ModalBase>
  );
};

export { ScheduleMeetingModal };
