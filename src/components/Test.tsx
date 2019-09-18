import React from 'react';
import { QuestionsProvider } from '../contexts/questions';
import { RouteComponentProps } from 'react-router';
import { Question } from './questionaire/Question';

export const Questions: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  // const { questions, answers } = useQuestions();
  // console.log('test');
  // console.log(questions);
  return (
    <>
      <QuestionsProvider>
        <p>Match {match.params.id}</p>
        <Question qid={parseInt(match.params.id, 10)}></Question>
      </QuestionsProvider>
    </>
  );
};

// const Question: React.FC<{ qid: number }> = ({ qid }) => {
//   return (
//     <QuestionsContext.Consumer>
//       {(value) => {
//         return (
//           <>
//             <button
//               onClick={() => {
//                 value.updateAnswer(qid, 'foo');
//               }}
//             >
//               click
//             </button>
//             <Link to={`/test/${qid + 1}`}>Next</Link>
//             <pre>
//               <code>{JSON.stringify(value.answers, null, 2)}</code>
//             </pre>
//             <pre>
//               <code>{JSON.stringify(value.questions[qid], null, 2)}</code>
//             </pre>
//           </>
//         );
//       }}
//     </QuestionsContext.Consumer>
//   );
// };
