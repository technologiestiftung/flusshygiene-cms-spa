import React, { createContext, useContext, useState, useEffect } from 'react';
import { getQuestions } from '../questionnaire-data';
//----
interface IQuestionsState {
  questions: any[];
  answers: any[];
  updateAnswer: (i: number, answer: string) => void;
}
export const QuestionsContext = createContext<IQuestionsState>({
  questions: [],
  answers: [],
  updateAnswer: () => {},
});
export const useQuestions = () => useContext(QuestionsContext);

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState<any[]>([{}]);
  const [answers, setAnswers] = useState<any[]>([{}]);
  const updateAnswer = (i: number, answer: string) => {
    const tmp = [...answers];
    tmp[i] = answer;
    setAnswers(tmp);
  };
  useEffect(() => {
    (async () => {
      const data = await getQuestions();
      console.log(data);
      setQuestions((prevState) => {
        const newState = [...prevState, ...data];
        setAnswers(new Array(newState.length));
        return newState;
      });
    })();
  }, []);
  return (
    <QuestionsContext.Provider value={{ questions, answers, updateAnswer }}>
      {children}
    </QuestionsContext.Provider>
  );
};
