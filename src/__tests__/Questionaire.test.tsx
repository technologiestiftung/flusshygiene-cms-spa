import React from 'react';
import { render } from '../../__test-utils/render-with-providers';
import { QuestionaireIntro } from '../components/DEPRECATED-Questionaire';

it('renders Profile without crashing', () => {
  render(<QuestionaireIntro />);
});
