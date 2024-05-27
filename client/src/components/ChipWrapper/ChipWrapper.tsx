import React, { SyntheticEvent, useCallback } from 'react';
import { Chip } from '@mui/material';

import './chip-wrapper.scss';

type Props = {
  id: string,
  label?: string,
  icon?: React.ReactNode,
  onDelete?: (id: string, event: SyntheticEvent) => void,
  className?: string,
}

const ChipWrapper = (props: Props) => {
  const {
    id,
    label,
    icon,
    onDelete,
    className,
  } = props;

  const onDeleteLocal = useCallback(
    (event: SyntheticEvent) => {
      onDelete?.(
        id, event,
      );
    }, [id, onDelete],
  );

  return (
    <Chip
      id={id}
      label={label}
      onDelete={onDeleteLocal}
      className={className}
    />
  );
};
ChipWrapper.defaultProps = {
  label: '',
  icon: null,
  onDelete: () => {},
  className: '',
};

export { ChipWrapper };
