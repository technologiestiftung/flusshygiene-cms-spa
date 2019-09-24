import React from 'react';
import { QuestionsProvider } from '../../contexts/questionaire';
import { RouteComponentProps } from 'react-router';
import { Question } from './Question';
export const QA: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  return (
    <>
      <QuestionsProvider>
        <Question qid={parseInt(match.params.id, 10)}></Question>
      </QuestionsProvider>
    </>
  );
};
