import * as React from 'react';
import styled from 'styled-components';
import { STORY_IDS } from './constants/stories';
import { Listings } from './containers/Listings';

const Wrapper = styled.div`
  background: #efefef;
  padding: 1em;
  font-size: 14px;
  min-height: 100vh;
  box-sizing: border-box;
`;

export function App() {
  return (
    <Wrapper>
      <Listings storyIds={STORY_IDS} />
    </Wrapper>
  );
}
