import React from 'react';
import { QuestionsProvider } from '../../contexts/questions';
import { RouteComponentProps } from 'react-router';
import { Question } from './Question';
export const QA: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  // const [state, dispatch]  = useQuestions();
  // console.log(questions);
  return (
    <>
      <QuestionsProvider>
        <Question qid={parseInt(match.params.id, 10)}></Question>
      </QuestionsProvider>
    </>
  );
};
