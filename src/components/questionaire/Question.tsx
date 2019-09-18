import React from 'react';
import { QuestionsContext } from '../../contexts/questions';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import { Container } from '../Container';
import { QToolBar } from './QToolBar';

export const Question: React.FC<{ qid: number }> = ({ qid }) => {
  const [title, setTitle] = useState('');
  const [qInfo, setQInfo] = useState('');
  const [question, setQuestion] = useState('');
  const [qAddInfo, setQAddInfo] = useState('');
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  interface IAnswer {
    text: string;
    colorText: 'grün' | 'gelb' | 'orange' | 'türkis' | 'rot';
    additionalText: string;
    id: string;
    weight: number;
    answer?: string;
  }

  return (
    <QuestionsContext.Consumer>
      {(value) => {
        setTitle(value.questions[qid].default[1][1]);
        setQInfo(value.questions[qid].default[1][3]);
        setQuestion(value.questions[qid].default[1][4]);
        setQAddInfo(value.questions[qid].default[1][5]);

        const data = value.questions[qid].default;
        const localAnswers: IAnswer[] = [];
        for (let i = 1; i < data.length; i++) {
          // console.log(data[i][6]);
          // if (data[i][6] === null) {
          //   break;
          // }
          const answer: IAnswer = {
            additionalText: data[i][7],
            colorText: data[i][9],
            text: data[i][6],
            id: `${qid}-a${i - 1}-w${data[i][0]}`,
            weight: data[i][0],
          };
          localAnswers.push(answer);
        }
        setAnswers(localAnswers);
        return (
          <>
            <button
              onClick={() => {
                value.updateAnswer(qid, 'foo');
              }}
            >
              click
            </button>
            <Link to={`/test/${qid + 1}`}>Next</Link>
            <pre>
              <code>{JSON.stringify(value.answers, null, 2)}</code>
            </pre>
            <pre>
              <code>{JSON.stringify(value.questions[qid], null, 2)}</code>
            </pre>
            <Formik
              initialValues={{ answers, answer: undefined }}
              enableReinitialize={true}
              onSubmit={(values, { setSubmitting }) => {
                console.log('submitted', values);

                setSubmitting(false);
              }}
            >
              {({
                values,
                isSubmitting,
                handleChange,
                isValid,
                submitForm,
              }) => {
                return (
                  <>
                    <Form>
                      <Container>
                        <QToolBar
                          isSubmitting={isSubmitting}
                          handleClick={(e: React.ChangeEvent<any>) => {
                            console.log(e.currentTarget.id);
                          }}
                        >
                          {}
                        </QToolBar>
                      </Container>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </>
        );
      }}
    </QuestionsContext.Consumer>
  );
};
