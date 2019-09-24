import React from 'react';
import { render, fireEvent } from '../../__test-utils/render-with-providers';
import { QToolBar } from '../components/questionaire/QToolBar';
const handleClick = jest.fn((e: React.ChangeEvent<any>, p: number) => {});
describe('Testing Toolbar', () => {
  test('icon info click', () => {
    const { getByTestId } = render(
      <QToolBar
        isSubmitting={false}
        handleInfoClick={(e: React.ChangeEvent<any>) => {}}
      >
        <></>
      </QToolBar>,
    );
    const button = getByTestId(/qtoolbar-i-button/i);
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
