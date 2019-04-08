import {
  AnchorButton,
  Button,
  Classes,
  Dialog,
  Intent,
  Tag,
  Tooltip,
} from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { JobOffer } from '../models/job-offer';

const MAX_TEXT_LENGTH = 40;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    padding-top: 1em;
  }
`;

const Label = styled.strong`
  opacity: 0.8;
`;

const TextWrapper = styled.div`
  display: flex;
  flex: 1 auto;
  overflow: hidden;
  justify-content: flex-end;
`;

const TagList = styled.div`
  & > * {
    margin-right: 0.5em;
  }
`;

const PreLine = styled.span`
  white-space: pre-line;
`;

function renderTruncatedRow(label: string, text: string) {
  text = text || '';
  const showTooltip = text.length > MAX_TEXT_LENGTH;
  const tooltipContent = (
    <TextWrapper>
      {text.substr(0, MAX_TEXT_LENGTH)}
      {showTooltip ? '...' : ''}
    </TextWrapper>
  );

  return (
    <Row>
      <Label>{label}</Label>
      {showTooltip ? (
        <Tooltip content={text}>{tooltipContent}</Tooltip>
      ) : (
        tooltipContent
      )}
    </Row>
  );
}

export interface JobDialogProps {
  job: JobOffer | null;

  onClose(): void;
}

export const JobDialog = React.memo(
  (props: JobDialogProps) => {
    const job: JobOffer = props.job || {
      commentId: 0,
      by: '',
      company: '',
      position: '',
      positionTags: [],
      minSalary: 0,
      maxSalary: 0,
      currency: null,
      remote: false,
      description: '',
    };

    return (
      <Dialog
        autoFocus={true}
        isOpen={!!props.job}
        onClose={props.onClose}
        canOutsideClickClose={true}
      >
        <div className={Classes.DIALOG_BODY}>
          {renderTruncatedRow('Company', job.company)}
          {renderTruncatedRow('Position', job.position)}
          {job.positionTags && job.positionTags.length > 0 ? (
            <Row>
              <TagList>
                {job.positionTags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagList>
            </Row>
          ) : null}

          {!!job.currency && (
            <Row>
              <Label>Salary</Label>
              <TextWrapper>
                {job.maxSalary !== job.minSalary
                  ? `${job.minSalary} - ${job.maxSalary}`
                  : job.maxSalary}{' '}
                {job.currency} annualy
              </TextWrapper>
            </Row>
          )}

          {!!job.remote && (
            <Row>
              <Tag large={true} intent={Intent.SUCCESS}>
                Remote possible
              </Tag>
            </Row>
          )}

          <Row>
            <Label>Description</Label>
          </Row>

          <PreLine>{job.description}</PreLine>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent={Intent.NONE} onClick={props.onClose}>
              Close
            </Button>
            <AnchorButton
              intent={Intent.PRIMARY}
              href={`https://news.ycombinator.com/item?id=${job.commentId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              See it on HN
            </AnchorButton>
          </div>
        </div>
      </Dialog>
    );
  },
  (prev, next) => prev.job === next.job
);
