import { RangeSlider } from '@blueprintjs/core';
import React from 'react';

export interface SalarySliderProps {
  disabled?: boolean;
  salaryMin: number;
  salaryMax: number;
  min: number;
  max: number;

  onChangeSalary(salaryMin: number, salaryMax: number): void;
}

export function SalarySlider(props: SalarySliderProps) {
  const range: [number, number] = [props.salaryMin, props.salaryMax];

  return (
    <RangeSlider
      min={props.min}
      max={props.max}
      stepSize={1000}
      labelStepSize={40000}
      labelRenderer={value => `${Math.floor(value / 1000)}k`}
      disabled={props.disabled}
      onChange={value => {
        props.onChangeSalary(Math.min(...value), Math.max(...value));
      }}
      value={range}
    />
  );
}
