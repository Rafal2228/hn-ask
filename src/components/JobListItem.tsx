import React from 'react';
import styled from 'styled-components';
import { JobOffer } from '../models/job-offer';

export const JOB_LIST_ITEM_HEIGHT = 40;

const Wrapper = styled.div`
  height: ${JOB_LIST_ITEM_HEIGHT}px;
  padding: 1em;
  display: flex;
  align-items: center;
`;

export interface JobListItemProps {
  job: JobOffer;
  style?: React.CSSProperties;
  className?: string;
  onClick(e: React.SyntheticEvent<HTMLDivElement>): void;
}

export function JobListItem(props: JobListItemProps) {
  const { position, company } = props.job;
  return (
    <Wrapper
      onClick={props.onClick}
      className={props.className}
      style={props.style}
    >
      {position} @ {company}
    </Wrapper>
  );
}
