import * as React from 'react';
import styled from 'styled-components';
import { JobList } from '../components/JobList';
import { Loader } from '../components/Loader';
import { JobOffer } from '../models/job-offer';

const Wrapper = styled.div`
  width: 100%;
  min-height: 40vmin;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: 1em;
  background-color: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;

  span {
    padding-top: 1em;
  }
`;

interface ListingState {
  pending: boolean;
  jobs: JobOffer[] | null;
}

const listingDefaultState: ListingState = {
  pending: true,
  jobs: null,
};

function listingReducer(state: ListingState, action: any) {
  return state;
}

export interface ListingsProps {
  jobs: JobOffer[];
}

export function Listings(props: ListingsProps) {
  const [state, dispatch] = React.useReducer(
    listingReducer,
    listingDefaultState
  );

  return (
    <Wrapper>
      {state.pending ? (
        <LoaderWrapper>
          <Loader />
          <span>Loading job offerings ...</span>
        </LoaderWrapper>
      ) : (
        <JobList />
      )}
    </Wrapper>
  );
}
