import { shallow, mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { JobListItem } from './JobListItem';
import { JobOffer } from '../models/job-offer';

const MOCK_JOB: JobOffer = {
  by: 'test',
  commentId: 123,
  company: 'Testing INC',
  currency: 'EUR',
  description:
    "Our team works on open source GPU\ndrivers for Linux. We're looking for experienced software engineers to develop,\nmaintain, and support graphics and multimedia drivers in support of a wide range\nof applications, including machine learning and data centre",
  maxSalary: 100000,
  minSalary: 60000,
  position: 'Lead UI/UX Developer',
  positionTags: ['Developer'],
  remote: false,
};

describe('JobListItem component', () => {
  test('should render null without required props', () => {
    const JobListItemUnsafe = JobListItem as any;
    const item = shallow(<JobListItemUnsafe />);

    expect(item.getElement()).toBe(null);
  });

  describe('wrapper', () => {
    let item: ReactWrapper;
    let onClick: jest.Mock;
    const itemStyle = { color: 'red' };

    beforeEach(() => {
      onClick = jest.fn();
      item = mount(
        <JobListItem
          job={MOCK_JOB}
          onClick={onClick}
          className="test"
          style={itemStyle}
        />
      );
    });

    test('should receive className and style', () => {
      expect(item.childAt(0).hasClass('test')).toBe(true);
      expect(item.childAt(0).getElement().props).toHaveProperty('style');
      expect(item.childAt(0).getElement().props.style).toBe(itemStyle);
    });

    test('should has tabIndex set to 0', () => {
      expect(item.childAt(0).prop('tabIndex')).toBe(0);
    });

    test('should call onClick when clicked', () => {
      item.childAt(0).simulate('click');

      expect(onClick.mock.calls.length).toBe(1);
    });

    test('should call onClick when in foucs and enter was pressed', () => {
      item.childAt(0).simulate('keydown', { key: 'A' });

      expect(onClick.mock.calls.length).toBe(0);

      item.childAt(0).simulate('keydown', { key: 'Enter' });

      expect(onClick.mock.calls.length).toBe(1);
    });
  });
});
