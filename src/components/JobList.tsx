import React from 'react';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import { JobOffer } from '../models/job-offer';
import { JOB_LIST_ITEM_HEIGHT, JobListItem } from './JobListItem';

export interface JobListProps {
  jobs: JobOffer[];
  onJobSelected(job: JobOffer): void;
}

export function JobList(props: JobListProps) {
  if (!props.jobs || props.jobs.length < 1) {
    return null;
  }

  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          focusable="false"
          rowHeight={JOB_LIST_ITEM_HEIGHT}
          rowCount={props.jobs.length}
          rowRenderer={rowRenderer}
          width={width}
          height={height}
        />
      )}
    </AutoSizer>
  );

  function rowRenderer(rowProps: ListRowProps) {
    const job = props.jobs[rowProps.index];

    return (
      <JobListItem
        key={rowProps.key}
        style={rowProps.style}
        job={job}
        onClick={() => props.onJobSelected(job)}
      />
    );
  }
}
