import React from 'react';
import { QIntro, QIntroNew } from './QIntro';
//import { QuestionsProvider } from '../../contexts/questionaire';

export const QuestionsIntro: React.FC = () => {
  return (
    <>
      <QIntroNew isModal={false} />
    </>
  );
};
