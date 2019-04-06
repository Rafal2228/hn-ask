import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { App } from './App';

configure({ adapter: new Adapter() });

describe('App component', () => {
  test('should render div with Test', () => {
    const app = shallow(<App />);

    expect(app.is('div')).toBe(true);
    expect(app.contains('Test')).toBe(true);
  });
});
