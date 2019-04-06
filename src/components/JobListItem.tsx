import React from 'react';
import styled from 'styled-components';
import { JobOffer } from '../models/job-offer';

export const JOB_LIST_ITEM_HEIGHT = 40;

const Wrapper = styled.div`
  height: ${JOB_LIST_ITEM_HEIGHT}px;
  padding: 1em;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const TextTruncate = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
      <TextTruncate>
        {position} @ {company}
      </TextTruncate>
    </Wrapper>
  );
}
