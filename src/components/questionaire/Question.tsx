import React, { useEffect } from 'react';
import { useQuestions } from '../../contexts/questions';

import { useState } from 'react';
import { Formik, Form, FieldArray, Field } from 'formik';
import { Container } from '../Container';
import { QToolBar } from './QToolBar';
import { Pagination } from './Pagination';
interface IAnswer {
  text: string;
  colorText: 'grün' | 'gelb' | 'orange' | 'türkis' | 'rot';
  additionalText: string;
  id: string;
  weight: number;
  answer?: string;
  checked: boolean;
}

export const Question: React.FC<{ qid: number }> = ({ qid }) => {
  const [title, setTitle] = useState('');
  const [qInfo, setQInfo] = useState('');
  const [question, setQuestion] = useState('');
  const [qAddInfo, setQAddInfo] = useState('');
  const [curAnswers, setCurAnswers] = useState<IAnswer[]>([]);

  const [aAddInfo, setAAddInfo] = useState('');
  const { answers, questions, updateAnswer } = useQuestions();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  useEffect(() => {
    if (questions === undefined) return;
    if (questions.length - 1 < qid) return;

    setTitle(questions[qid].default[1][1]);
    setQInfo(questions[qid].default[1][3]);
    // console.log('qInfo', questions[qid].default[1][3]);
    setQuestion(questions[qid].default[1][4]);
    setQAddInfo(questions[qid].default[1][5]);
    // console.log('qAddInfo', questions[qid].default[1][5]);

    const q = questions[qid].default;
    const localAnswers: IAnswer[] = [];
    // const a = answers[qid];

    for (let i = 1; i < q.length; i++) {
      // console.log(data[i][6]);
      // if (data[i][6] === null) {
      //   break;
      // }
      const answer: IAnswer = {
        additionalText: q[i][7],
        colorText: q[i][9],
        text: q[i][6],
        id: `${qid}-a${i - 1}-w${q[1][0]}`,
        weight: q[1][0],
        checked: false,
      };
      localAnswers.push(answer);
    }
    setCurAnswers(localAnswers);
    setAAddInfo('');
    console.log(qid, answers[qid]);

    setFormReadyToRender(true);
  }, [questions, qid]);

  // useEffect(() => {
  //   if (answers === undefined) return;
  //   if (answers[qid] === undefined) return;

  //   if (answers[qid] === null) {
  //     setSelection(undefined);
  //   } else {
  //     const existingSelection = answers[qid].split('-')[1].substring(1);
  //     console.log(existingSelection);
  //     const num = parseInt(existingSelection, 10);
  //     if (isNaN(num) === true) {
  //       throw new Error('could not parse selection');
  //     } else {
  //       setSelection(num);
  //     }
  //   }
  // }, [answers, qid]);
  // useEffect(() => {
  //   if (answers === undefined) return;
  //   if (answers.length - 1 < qid) return;
  //   if (answers[qid] === null) return;
  //   if (answers[qid] !== undefined) {
  //     const split = answers[qid].split('-');
  //     const aId = split[0];
  //     if (aId !== qid) {
  //       // setIntSelection(undefined);
  //       return;
  //     }
  //     const selectionId = split[1];
  //     const selectionWeight = split[2];
  //     const selection = selectionId.substring(1);
  //     setIntSelection((_prev) => {
  //       const res = parseInt(selection, 10);
  //       return isNaN(res) ? undefined : res;
  //     });
  //   }
  // }, [answers, qid]);
  return (
    <>
      {formReadyToRender === true && (
        <Formik
          initialValues={{ answers: curAnswers, answer: undefined }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submitted', values);
            updateAnswer(
              qid,
              values.answer === undefined ? '' : values.answer!,
            );
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting, handleChange, isValid, submitForm }) => {
            return (
              <>
                <pre>
                  <code>{JSON.stringify(answers, null, 2)}</code>
                </pre>
                <Form>
                  <Container>
                    <QToolBar
                      isSubmitting={isSubmitting}
                      handleClick={(e: React.ChangeEvent<any>) => {
                        console.log(e.currentTarget.id);
                      }}
                    >
                      <Pagination
                        pages={questions.length - 1}
                        currentPage={qid}
                        isRounded={false}
                        isSmall={true}
                        isCentered={true}
                        onChange={(
                          event: React.ChangeEvent<any>,
                          page: number,
                        ) => {
                          console.log('Clicked button', event.currentTarget.id);
                          console.log('page', page);

                          switch (event.currentTarget.id) {
                            case 'fwd':
                              console.log('-->');
                              break;
                            case 'bwd':
                              console.log('<--');
                              break;
                            default:
                              console.log('default');
                              break;
                          }
                        }}
                      ></Pagination>
                    </QToolBar>
                  </Container>
                  <Container>
                    <h1 className='title is-1'>{title}</h1>
                    <div className='content'>
                      <p>{qInfo}</p>
                    </div>
                    <div className='content'>
                      <p className='title'>Frage:</p>

                      <p>{question}</p>
                      <p>
                        <em>{qAddInfo}</em>
                      </p>
                    </div>
                    <div className='content'>
                      <p className='title'>Antworten:</p>
                      <p>{aAddInfo}</p>
                      <div className='control'>
                        <FieldArray
                          name='answers'
                          render={(_helpers) => {
                            return (
                              <>
                                {values.answers.map((ele, i) => {
                                  // console.log(ele);
                                  if (ele === undefined) return null;
                                  if (ele.text === null) return null;

                                  return (
                                    <div key={i} className='field'>
                                      <Field
                                        type='radio'
                                        id={`answer--${i}`}
                                        name={'answer'}
                                        className={'answer'}
                                        onChange={(
                                          e: React.ChangeEvent<any>,
                                        ) => {
                                          handleChange(e);
                                          setAAddInfo(ele.additionalText);
                                        }}
                                        required
                                        value={ele.id}
                                        checked={ele.checked}
                                      />
                                      <label
                                        htmlFor={`answer--${i}`}
                                        className={'radio label__answer'}
                                      >
                                        {ele.text} <em>{ele.colorText}</em>
                                      </label>
                                    </div>
                                  );
                                })}
                              </>
                            );
                          }}
                        ></FieldArray>
                      </div>
                    </div>
                  </Container>
                </Form>
              </>
            );
          }}
        </Formik>
      )}

      {/* <pre>
        <code>{JSON.stringify(curAnswers, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(questions[qid], null, 2)}</code>
      </pre> */}
    </>
  );
};
