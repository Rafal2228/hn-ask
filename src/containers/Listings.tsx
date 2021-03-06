import { Intent, Spinner } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { Filters } from '../components/Filters';
import { JobDialog } from '../components/JobDialog';
import { JobList } from '../components/JobList';
import jobsUrl from '../jobs.json';
import { JobFilters } from '../models/job-filters';
import { JobOffer } from '../models/job-offer';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  span {
    padding-top: 1em;
  }
`;

const FiltersWrapper = styled.div`
  padding: 1em;
  height: 100%;
  width: 250px;
`;

const ListWrapper = styled.div`
  height: 100%;
  width: calc(100% - 250px);
`;

interface ListingState {
  pending: boolean;
  jobs: JobOffer[] | null;
  filters: JobFilters | null;
  filteredJobs: JobOffer[] | null;
  selectedJob: JobOffer | null;
}

const listingDefaultState: ListingState = {
  pending: true,
  jobs: null,
  filters: null,
  filteredJobs: null,
  selectedJob: null,
};

function listingReducer(
  state: ListingState,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case 'LOAD': {
      return {
        ...state,
        pending: true,
      };
    }
    case 'LOAD_SUCCESS': {
      return {
        ...state,
        pending: false,
        jobs: action.payload,
        filteredJobs: action.payload,
      };
    }
    case 'LOAD_FAILURE': {
      return {
        ...state,
        pending: false,
      };
    }
    case 'FILTER': {
      const filters = action.payload as JobFilters;
      const filteredJobs =
        state.jobs &&
        state.jobs.filter(job => {
          if (filters.currency) {
            if (job.currency !== filters.currency) {
              return false;
            }

            if (
              filters.salaryMin &&
              job.maxSalary &&
              filters.salaryMin > job.maxSalary
            ) {
              return false;
            }

            if (
              filters.salaryMax &&
              job.minSalary &&
              filters.salaryMax < job.minSalary
            ) {
              return false;
            }
          }

          if (!!filters.positionTags && !!filters.positionTags.length) {
            return !!job.positionTags.find(
              tag => (filters.positionTags as string[]).indexOf(tag) !== -1
            );
          }

          if (Object.prototype.hasOwnProperty.call(filters, 'remote')) {
            return job.remote === filters.remote;
          }

          return true;
        });

      return {
        ...state,
        filters,
        filteredJobs,
      };
    }
    case 'SELECT_JOB': {
      return {
        ...state,
        selectedJob: action.payload,
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
        <LoaderWrapper data-test-id="Listings__Loader">
          <Spinner intent={Intent.PRIMARY} size={100} />
          <span>Loading job offerings ...</span>
        </LoaderWrapper>
      ) : (
        <>
          <FiltersWrapper>
            <Filters
              filters={state.filters}
              onChangeFilters={filters => {
                dispatch({ type: 'FILTER', payload: filters });
              }}
            />
          </FiltersWrapper>
          <ListWrapper data-test-id="Listings__JobList">
            <JobList
              jobs={state.filteredJobs}
              onJobSelected={job => {
                dispatch({ type: 'SELECT_JOB', payload: job });
              }}
            />
          </ListWrapper>

          <JobDialog
            job={state.selectedJob}
            onClose={() => {
              dispatch({ type: 'SELECT_JOB', payload: null });
            }}
          />
        </>
      )}
    </Wrapper>
  );
}
