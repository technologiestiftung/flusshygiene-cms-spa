import React from 'react';
import { QuestionsProvider, useQuestions } from '../../contexts/questions';
import { RouteComponentProps } from 'react-router';
import { Question } from './Question';
export const QA: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const { answers } = useQuestions();
  // console.log(questions);
  return (
    <>
      <QuestionsProvider>
        <Question qid={parseInt(match.params.id, 10)}></Question>
      </QuestionsProvider>
    </>
  );
};
