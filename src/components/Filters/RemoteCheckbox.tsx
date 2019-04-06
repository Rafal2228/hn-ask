import { Checkbox } from '@blueprintjs/core';
import React from 'react';

export interface RemoteCheckboxProps {
  remote: boolean;

  onChangeRemote(remote: boolean): void;
}

export function RemoteCheckbox(props: RemoteCheckboxProps) {
  return (
    <Checkbox
      label="Remote"
      defaultIndeterminate={true}
      checked={props.remote}
      onChange={() => {
        props.onChangeRemote(!props.remote);
      }}
    />
  );
}
