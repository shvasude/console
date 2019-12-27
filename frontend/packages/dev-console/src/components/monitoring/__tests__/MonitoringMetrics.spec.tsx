import * as React from 'react';
import { shallow } from 'enzyme';
import MonitoringMetrics from '../MonitoringMetrics';

describe('Monitoring Metrics Tab', () => {
  it('should render monitoring metrics tab', () => {
    const wrapper = shallow(<MonitoringMetrics />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.contains(<title>Metrics</title>)).toBe(true);
  });
});
