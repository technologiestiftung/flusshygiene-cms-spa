import React from 'react';
import { render } from '../../__test-utils/render-with-providers';
import { QuestionaireIntro } from '../components/Questionaire';

it('renders Profile without crashing', () => {
  render(<QuestionaireIntro />);
});
