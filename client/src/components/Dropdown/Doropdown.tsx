import React, {
  ChangeEvent,
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Avatar,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import classNames from 'classnames';

import {
  DROPDOWN_VARIANT, TEXT_FIELD_VARIANT, TYPOGRAPHY_VARIANT,
} from '../../../utils/Enum';
import { isNullOrEmpty } from '../../utils/CommonUtils';
import { DROPDOWN_STATICS } from './DropdownStatics';
import { ChipWrapper } from '../ChipWrapper/ChipWrapper';

import './dropdown.scss';

export type DropdownItemType = {
  id?: string,
  label?: string,
  value?: string,
  iconName?: string,
}

type Props = {
  // input elements props
  id: string,
  label?: string,
  // description?: string, // optional,
  placeholder?: string,
  inputTextFieldType?: TEXT_FIELD_VARIANT,

  // dropdown elements props
  selectedItemIds?: string[],
  onSelect?: (selectedId: string, selectedObject: DropdownItemType) => void,
  onRemoveItem?: (removedItemId: string, event: SyntheticEvent) => void,
  dropDownItems?: DropdownItemType[]
  // isLoading?: boolean,
  variant?: DROPDOWN_VARIANT,
  className?: string,
}

const styles = {
  container: 'mng__dropdown__container',
  contentWrapper: 'mng__dropdown__content-wrapper',
  selectedItem: {
    container: 'mng__dropdown__selected-item-container',
    chip: 'mng__dropdown__selected-item-chip',
    placeholderText: 'mng__dropdown__selected-item-placeholder-text',
  },
  inputField: {
    container: 'mng__dropdown__input-field-container',
    tag: 'mng__dropdown__input-field-tag',
  },
  popover: {
    container: 'mng__dropdown__popover-container',
    wrapper: 'mng__dropdown__popover-wrapper',
    isOpen: 'mng__dropdown__popover-is-open',
    menu: {
      container: 'mng__dropdown__popover__menu-container',
      item: 'mng__dropdown__popover__menu-item',
      label: 'mng__dropdown__popover__menu-label',
      icon: 'mng__dropdown__popover__menu-icon-name',
      emptyList: 'mng__dropdown__popover__menu-empty-list',
    },
  },
};


/* FIXME: To check the scroll issue when down arrow is clicked */
const Dropdown = (props: Props) => {
  const {
    id,
    label,
    placeholder,
    inputTextFieldType,

    selectedItemIds,
    onSelect,
    onRemoveItem,
    dropDownItems,
    variant,
    className,
  } = props;

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState<boolean>(false);
  const [inputTextFieldValueLocal, setInputTextFieldValueLocal] = useState<string>('');
  const [autoFocusLocal, setAutoFocusLocal] = useState<boolean>(false);
  const [dropdownItemsLocal, setDropdownItemsLocal] = useState<DropdownItemType[]>([]);
  const [selectedItemsLocal, setSelectedItemsLocal] = useState<DropdownItemType[]>([]);

  useEffect(
    () => {
      setDropdownItemsLocal(dropDownItems || []);
    }, [dropDownItems],
  );

  useEffect(
    () => {
      if (!isNullOrEmpty(dropdownItemsLocal) && !isNullOrEmpty(selectedItemIds)) {
        const selectedDropdownItem: DropdownItemType[] = dropdownItemsLocal.filter((currentItem: DropdownItemType) => (selectedItemIds?.includes(currentItem?.id as string)));
        setSelectedItemsLocal(selectedDropdownItem);
      } else {
        setSelectedItemsLocal([]);
      }
    }, [dropdownItemsLocal, selectedItemIds],
  );

  // FILTER THE DROPDOWN ITEMS
  const dropDownItemRenderList: DropdownItemType[] = useMemo(
    () => (dropdownItemsLocal.filter((currentItem:DropdownItemType) => currentItem.label?.includes(inputTextFieldValueLocal)) || []),
    [dropdownItemsLocal, inputTextFieldValueLocal],
  );

  const onChangeLocal = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length > 0) {
        setIsDropdownMenuOpen(true);
      } else {
        setIsDropdownMenuOpen(false);
      }
      setInputTextFieldValueLocal(event.target.value);
    }, [],
  );

  const isItemAlreadyPresent = useCallback(
    (selectedItemId: string) => (!isNullOrEmpty(selectedItemsLocal.find((currentItem: DropdownItemType) => currentItem.id === selectedItemId))),
    [selectedItemsLocal],
  );

  const onSelectLocal = useCallback(
    (event:SyntheticEvent) => {
      const selectedId = event.currentTarget.id;
      const currentSelectedItem = dropDownItems?.find((item) => (item.id === selectedId)) || {};

      if (variant === DROPDOWN_VARIANT.SIMPLE_DROPDOWN) {
        setInputTextFieldValueLocal(currentSelectedItem?.label as string);
      }

      if (variant === DROPDOWN_VARIANT.MULTI_SELECT_DROPDOWN) {
        if (isItemAlreadyPresent(selectedId)) {
          return;
        }
        setSelectedItemsLocal((prevSelectedItem: DropdownItemType[]) => ([
          ...prevSelectedItem,
          currentSelectedItem,
        ]));
      }

      onSelect?.(
        selectedId, currentSelectedItem,
      );
      setIsDropdownMenuOpen(false);
    },
    [dropDownItems, isItemAlreadyPresent, onSelect, variant],
  );

  const onClickAway = useCallback(
    () => {
      setIsDropdownMenuOpen(false);
      setAutoFocusLocal(false);
    },
    [],
  );

  const onTextFieldFocus = useCallback(
    () => {
      setIsDropdownMenuOpen(true);
    },
    [],
  );

  const onTextFieldKeyDownLocal = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        setIsDropdownMenuOpen(true);
        setAutoFocusLocal(true);
      }
    },
    [],
  );

  const onRemoveItemLocal = useCallback(
    (
      removedItemId: string, event: SyntheticEvent,
    ) => {
      onRemoveItem?.(
        removedItemId, event,
      );
    },
    [onRemoveItem],
  );

  const getChipsView = (item: DropdownItemType) => (
    <ChipWrapper
      key={item.id}
      id={item.id!}
      label={item.value || item.label}
      onDelete={onRemoveItemLocal}
      className={styles.selectedItem.chip}
    />
  );

  const getPlaceholderTextView = () => (
    <Typography className={styles.selectedItem.placeholderText}>
      {DROPDOWN_STATICS.EMPTY_SELECTED_ITEM.label}
    </Typography>
  );

  const getSelectedItemsView = () => (
    <Paper className={styles.selectedItem.container}>
      {isNullOrEmpty(selectedItemsLocal)
        ? getPlaceholderTextView()
        : selectedItemsLocal.map(getChipsView)}
    </Paper>
  );

  const getInputTextFieldView = () => (
    <div className={styles.inputField.container}>
      <TextField
        id={id}
        label={label}
        placeholder={placeholder}
        variant={inputTextFieldType}
        value={inputTextFieldValueLocal}
        onChange={onChangeLocal}
        onFocus={onTextFieldFocus}
        onKeyDown={onTextFieldKeyDownLocal}
        className={styles.inputField.tag}
      />
    </div>
  );

  const getMenuItem = (item: DropdownItemType) => (
    <MenuItem
      id={item.id}
      key={item.id}
      onClick={onSelectLocal}
      className={styles.popover.menu.item}
    >
      {item.iconName && (
        <Avatar
          alt={item.label}
          src={item.iconName}
          className={styles.popover.menu.icon}
        />
      )}
      <Typography
        variant={TYPOGRAPHY_VARIANT.BODY1}
        className={styles.popover.menu.label}
      >
        {item.label}
      </Typography>
    </MenuItem>
  );

  const getEmptyDropdownView = () => (
    <Typography
      variant={TYPOGRAPHY_VARIANT.BODY1}
      className={styles.popover.menu.emptyList}
    >
      {DROPDOWN_STATICS.EMPTY_LIST.label}
    </Typography>
  );

  const getMenuListView = () => (
    <MenuList
      id={id}
      autoFocus={autoFocusLocal}
      // onKeyDown={handleListKeyDown} // use only if required
      className={styles.popover.menu.container}
    >
      {isNullOrEmpty(dropDownItemRenderList)
        ? getEmptyDropdownView()
        : dropDownItemRenderList?.map(getMenuItem)}
    </MenuList>
  );

  const customPopoverClassName = classNames(
    styles.popover.container,
    {
      [styles.popover.isOpen]: isDropdownMenuOpen,
    },
  );

  const getDropdownPopoverView = () => (
    <div className={customPopoverClassName}>
      <Paper className={styles.popover.wrapper}>
        {getMenuListView()}
      </Paper>
    </div>
  );

  const getDropdownWrapper = () => (
    <ClickAwayListener onClickAway={onClickAway}>
      <div className={styles.contentWrapper}>
        {getInputTextFieldView()}
        {getDropdownPopoverView()}
      </div>
    </ClickAwayListener>

  );

  return (
    <div className={classNames(
      styles.container,
      className,
    )}
    >
      {variant === DROPDOWN_VARIANT.MULTI_SELECT_DROPDOWN && getSelectedItemsView()}
      {getDropdownWrapper()}
    </div>
  );
};

Dropdown.defaultProps = {
  label: '',
  placeholder: '',
  inputTextFieldType: TEXT_FIELD_VARIANT.STANDARD,
  selectedItemIds: [],
  onSelect: () => {},
  onRemoveItem: () => {},
  variant: DROPDOWN_VARIANT.SIMPLE_DROPDOWN,
  dropDownItems: [],
  className: '',
};

export { Dropdown };
