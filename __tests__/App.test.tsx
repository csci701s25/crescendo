import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  let tree;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />).toJSON();
  });

  expect(tree).toMatchSnapshot();
});
