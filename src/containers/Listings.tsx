import React from 'react';
import styled from 'styled-components';
import { JobList } from '../components/JobList';
import { Loader } from '../components/Loader';
import jobsUrl from '../jobs.json';
import { JobOffer } from '../models/job-offer';

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  span {
    padding-top: 1em;
  }
`;

const ListWrapper = styled.div`
  height: 100%;
`;

interface ListingState {
  pending: boolean;
  jobs: JobOffer[] | null;
}

const listingDefaultState: ListingState = {
  pending: true,
  jobs: null,
};

function listingReducer(
  state: ListingState,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case 'LOAD': {
      return {
        pending: true,
      };
    }
    case 'LOAD_SUCCESS': {
      return {
        pending: false,
        jobs: action.payload,
      };
    }
    case 'LOAD_FAILURE': {
      return {
        pending: false,
      };
    }
  }

  return state;
}

export function Listings() {
  const [state, dispatch] = React.useReducer(
    listingReducer,
    listingDefaultState
  );

  React.useEffect(() => {
    async function loadJobs() {
      dispatch({ type: 'LOAD' });

      try {
        const res = await fetch(jobsUrl);
        const jobs = await res.json();
        dispatch({ type: 'LOAD_SUCCESS', payload: jobs });
      } catch (e) {
        dispatch({ type: 'LOAD_FAILURE' });
      }
    }

    loadJobs();
  }, []);

  return (
    <Wrapper>
      {state.pending ? (
        <LoaderWrapper>
          <Loader />
          <span>Loading job offerings ...</span>
        </LoaderWrapper>
      ) : (
        <ListWrapper>
          <JobList
            jobs={state.jobs}
            onJobSelected={job => {
              // tslint:disable-next-line:no-console
              console.log(job);
            }}
          />
        </ListWrapper>
      )}
    </Wrapper>
  );
}
