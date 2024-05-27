import React, { useCallback } from 'react';
import { Grid, Modal } from '@mui/material';
import classNames from 'classnames';

import './modal-base.scss';

type Props = {
  children: React.ReactNode,
  className?: string,
  isOpen: boolean,
  onClose: (newValue: any) => void,
}

const styles = {
  container: 'mng__modal-base__container',
  contentWrapper: 'mng__modal-base__content-wrapper',
  gridItem: 'mng__modal-base__grid-item',
};

const ModalBase = (props: Props) => {
  const {
    children,
    className,
    isOpen,
    onClose,
  } = props;

  const onCloseLocal = useCallback(
    (e: any) => {
      onClose?.(e);
    },
    [onClose],
  );

  // Todo: Handle different sizes of the Modal
  return (
    <Modal
      open={isOpen}
      onClose={onCloseLocal}
      closeAfterTransition
      className={classNames(
        styles.container, className,
      )}
    >
      <Grid
        container
        className={styles.contentWrapper}
      >
        <Grid
          item
          xs={8}
          sm={6}
          className={styles.gridItem}
        >
          {children}
        </Grid>
      </Grid>
    </Modal>
  );
};

ModalBase.defaultProps = {
  className: '',
};

export { ModalBase };
