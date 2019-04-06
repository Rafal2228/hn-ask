import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React from 'react';
import { CURRENCIES } from '../../constants/currencies';

export interface CurrencySelectProps {
  currency: string;

  onChangeCurrency(currency: string): void;
}

export function CurrencySelect(props: CurrencySelectProps) {
  return (
    <Select
      filterable={false}
      items={CURRENCIES}
      popoverProps={{ minimal: true }}
      itemRenderer={(currency, itemProps) => {
        return (
          <MenuItem
            active={itemProps.modifiers.active}
            disabled={itemProps.modifiers.disabled}
            key={currency}
            onClick={itemProps.handleClick}
            text={currency}
            shouldDismissPopover={false}
          />
        );
      }}
      onItemSelect={currency => {
        props.onChangeCurrency(currency);
      }}
    >
      <Button
        rightIcon="caret-down"
        text={props.currency || 'Select currency'}
      />
    </Select>
  );
}
