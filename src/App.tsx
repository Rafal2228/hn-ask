import * as React from 'react';
import styled from 'styled-components';
import { Listings } from './containers/Listings';

const Wrapper = styled.div`
  background: #efefef;
  font-size: 14px;
  min-height: 100vh;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

export function App() {
  return (
    <Wrapper>
      <Listings />
    </Wrapper>
  );
}
