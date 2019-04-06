import { Card, FormGroup } from '@blueprintjs/core';
import React from 'react';
import { JobFilters } from '../../models/job-filters';
import { CurrencySelect } from './CurrencySelect';
import { RemoteCheckbox } from './RemoteCheckbox';
import { SalarySlider } from './SalarySlider';
import { TagMultiSelect } from './TagMultiSelect';

export interface FiltersProps {
  filters: JobFilters | null;

  onChangeFilters(filters: JobFilters): void;
}

export function Filters(props: FiltersProps) {
  const filters = props.filters || {};
  const positionTags = filters.positionTags || [];

  return (
    <Card className="bp3-dark">
      <FormGroup label="Position tag">
        <TagMultiSelect
          tags={positionTags}
          onChangeTags={tags =>
            props.onChangeFilters({ ...filters, positionTags: tags })
          }
        />
      </FormGroup>

      <FormGroup label="Currency">
        <CurrencySelect
          currency={filters.currency as string}
          onChangeCurrency={currency =>
            props.onChangeFilters({
              ...filters,
              currency: currency as JobFilters['currency'],
            })
          }
        />
      </FormGroup>

      <FormGroup label="Salary">
        <SalarySlider
          disabled={!filters.currency}
          min={0}
          max={200000}
          salaryMin={filters.salaryMin || 0}
          salaryMax={filters.salaryMax || 200000}
          onChangeSalary={(salaryMin, salaryMax) =>
            props.onChangeFilters({ ...filters, salaryMax, salaryMin })
          }
        />
      </FormGroup>

      <FormGroup label="Remote">
        <RemoteCheckbox
          remote={filters.remote as boolean}
          onChangeRemote={remote =>
            props.onChangeFilters({ ...filters, remote })
          }
        />
      </FormGroup>
    </Card>
  );
}
