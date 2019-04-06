import { Button, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import React from 'react';
import { POSITION_TAGS } from '../../constants/position-tags';

export interface TagMultiSelectProps {
  tags: string[];

  onChangeTags(tags: string[]): void;
}

export function TagMultiSelect(props: TagMultiSelectProps) {
  const clearButton =
    props.tags.length > 0 ? (
      <Button
        icon="cross"
        minimal={true}
        onClick={() => props.onChangeTags([])}
      />
    ) : (
      undefined
    );

  return (
    <MultiSelect
      items={POSITION_TAGS}
      tagRenderer={tag => tag}
      itemRenderer={(tag, itemProps) => {
        return (
          <MenuItem
            active={itemProps.modifiers.active}
            disabled={itemProps.modifiers.disabled}
            icon={props.tags.indexOf(tag) !== -1 ? 'tick' : 'blank'}
            key={tag}
            onClick={itemProps.handleClick}
            text={tag}
            shouldDismissPopover={false}
          />
        );
      }}
      selectedItems={props.tags}
      popoverProps={{ minimal: true }}
      tagInputProps={{
        onRemove: tag => {
          props.onChangeTags(props.tags.filter(t => t !== tag));
        },
        rightElement: clearButton,
        tagProps: {
          minimal: true,
        },
      }}
      onItemSelect={tag => {
        const selectedTags =
          props.tags.indexOf(tag) !== -1
            ? props.tags.filter(t => t !== tag)
            : [...props.tags, tag];

        props.onChangeTags(selectedTags);
      }}
    />
  );
}
