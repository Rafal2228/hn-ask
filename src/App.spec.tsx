import { shallow, mount } from 'enzyme';
import React from 'react';
import { App } from './App';
import { Listings } from './containers/Listings';

describe('App component', () => {
  test('should render wrapper with 100vh height', () => {
    const app = mount(<App />);

    expect(app).toHaveStyleRule('height', '100vh');
    expect(app).toHaveStyleRule('box-sizing', 'border-box');
  });

  test('should render Listing component', () => {
    const app = shallow(<App />);

    expect(app.containsMatchingElement(<Listings />)).toBe(true);
  });
});
