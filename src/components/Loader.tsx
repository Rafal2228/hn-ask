import React from 'react';
import styled, { keyframes } from 'styled-components';

const ProgressIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      // tslint:disable-next-line:max-line-length
      d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
    />
  </svg>
);

const rotate = keyframes`
  from {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  to {
    transform: rotate3d(0, 0, 1, 360deg);
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    animation: ${rotate} 1s linear infinite;
    width: 4em;
  }
`;

export function Loader() {
  return <Wrapper>{ProgressIcon}</Wrapper>;
}
