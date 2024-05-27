import React, { useCallback, useState } from 'react';
import { Button, Container } from '@mui/material';
import { CalendarMonth, AccessTime } from '@mui/icons-material';

import { BUTTON_VARIANT, SIZE } from '../../../utils/Enum';
import { LANDING_PAGE_STATICS } from './LandingPageStatics';
import { ScheduleMeetingModal } from '../ScheduleMeetingModal/ScheduleMeetingModal';

import './landing-page.scss';

const styles = {
  container: 'mng__landing-page__container',
  header: {
    container: 'mng__landing-page__header-container',
    textWrapper: 'mng__landing-page__header-text-wrapper',
    title: 'mng__landing-page__header-title',
    description: 'mng__landing-page__header-description',
    image: {
      container: 'mng__landing-page__header__image-container',
      tag: 'mng__landing-page__header__image-tag',
    },
  },
  actionView: {
    container: 'mng__landing-page__action-view-container',
    button: 'mng__landing-page__action-view-button',
  },
};

const LandingPage = () => {
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] = useState<boolean>(false);

  const onConnectNowCtaClick = useCallback(
    () => {
      // navigate to meeting page
      // navigate()
    },
    [],
  );

  const onScheduleMeetingCtaClick = useCallback(
    () => {
      // show scheduleMeeting Modal
      setIsScheduleMeetingModalOpen(true);
    },
    [],
  );

  const getActionView = () => (
    <div className={styles.actionView.container}>
      <Button
        variant={BUTTON_VARIANT.CONTAINED}
        size={SIZE.MEDIUM}
        endIcon={<AccessTime />}
        onClick={onConnectNowCtaClick}
        className={styles.actionView.button}
      >
        {LANDING_PAGE_STATICS.ACTION_VIEW.connectNowCta}
      </Button>
      <Button
        variant={BUTTON_VARIANT.CONTAINED}
        size={SIZE.MEDIUM}
        endIcon={<CalendarMonth />}
        onClick={onScheduleMeetingCtaClick}
        className={styles.actionView.button}
      >
        {LANDING_PAGE_STATICS.ACTION_VIEW.scheduleMeetingCta}
      </Button>
    </div>
  );

  const getHeaderTextView = () => (
    <div className={styles.header.textWrapper}>
      <p className={styles.header.title}>
        {LANDING_PAGE_STATICS.HEADER.title}
      </p>
      <p className={styles.header.description}>
        {LANDING_PAGE_STATICS.HEADER.description}
      </p>
      {getActionView()}
    </div>
  );

  const getHeaderImageView = () => (
    <div className={styles.header.image.container}>
      <img
        src={LANDING_PAGE_STATICS.HEADER.imageURL}
        alt={LANDING_PAGE_STATICS.HEADER.title}
        className={styles.header.image.tag}
      />
    </div>
  );
  const getHeaderView = () => (
    <div className={styles.header.container}>
      {getHeaderTextView()}
      {getHeaderImageView()}
    </div>
  );

  const getScheduleMeetingModal = () => (
    <ScheduleMeetingModal
      isOpen={isScheduleMeetingModalOpen}
      onModalClose={setIsScheduleMeetingModalOpen}
    />
  );

  return (
    <Container className={styles.container}>
      {getHeaderView()}
      {getScheduleMeetingModal()}
    </Container>
  );
};

export { LandingPage };
